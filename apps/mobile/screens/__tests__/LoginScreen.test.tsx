import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import LoginScreen from '../LoginScreen';
import { apiService } from '../../services/api';
import type { AuthResponse } from '@fintrak/types';

// Mock the API service
jest.mock('../../services/api');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('LoginScreen', () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    expect(screen.getByText('Login to Fintrak')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(screen.getByText('Login')).toBeTruthy();
    expect(screen.getByText('Use any email/password combination for testing')).toBeTruthy();
  });

  it('should update email input when user types', () => {
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'test@example.com');
    
    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('should update password input when user types', () => {
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    fireEvent.changeText(passwordInput, 'password123');
    
    expect(passwordInput.props.value).toBe('password123');
  });

  it('should show error alert when fields are empty', () => {
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const loginButton = screen.getByText('Login');
    fireEvent.press(loginButton);
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and password');
  });

  it('should show error alert when email is empty', () => {
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and password');
  });

  it('should show error alert when password is empty', () => {
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.press(loginButton);
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and password');
  });

  it('should show error alert when email is only whitespace', () => {
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(emailInput, '   ');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter both email and password');
  });

  it('should perform login when form is valid', async () => {
    const mockAuthResponse: AuthResponse = { token: 'auth-token-123' };
    mockApiService.login.mockResolvedValueOnce(mockAuthResponse);
    
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(mockApiService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('should call onLoginSuccess and set token when login succeeds', async () => {
    const mockAuthResponse: AuthResponse = { token: 'auth-token-123' };
    mockApiService.login.mockResolvedValueOnce(mockAuthResponse);
    
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(mockApiService.setToken).toHaveBeenCalledWith('auth-token-123');
      expect(mockOnLoginSuccess).toHaveBeenCalledWith('auth-token-123');
    });
  });

  it('should show loading state during login', async () => {
    let resolveLogin: (value: AuthResponse) => void;
    const loginPromise = new Promise<AuthResponse>((resolve) => {
      resolveLogin = resolve;
    });
    mockApiService.login.mockReturnValueOnce(loginPromise);
    
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    // Should show loading state
    expect(screen.getByTestId('login-loading')).toBeTruthy();
    expect(loginButton.props.accessibilityState.disabled).toBe(true);
    
    // Resolve the login
    resolveLogin!({ token: 'token' });
    
    await waitFor(() => {
      expect(screen.queryByTestId('login-loading')).toBeNull();
    });
  });

  it('should disable inputs during loading', async () => {
    let resolveLogin: (value: AuthResponse) => void;
    const loginPromise = new Promise<AuthResponse>((resolve) => {
      resolveLogin = resolve;
    });
    mockApiService.login.mockReturnValueOnce(loginPromise);
    
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    // Inputs should be disabled during loading
    expect(emailInput.props.editable).toBe(false);
    expect(passwordInput.props.editable).toBe(false);
    
    // Resolve the login
    resolveLogin!({ token: 'token' });
    
    await waitFor(() => {
      expect(emailInput.props.editable).toBe(true);
      expect(passwordInput.props.editable).toBe(true);
    });
  });

  it('should handle login failure', async () => {
    const errorMessage = 'Invalid credentials';
    mockApiService.login.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login Failed', errorMessage);
      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });
  });

  it('should handle generic login failure', async () => {
    mockApiService.login.mockRejectedValueOnce('Some error');
    
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Login Failed', 'Login failed');
    });
  });

  it('should trim email input', async () => {
    const mockAuthResponse: AuthResponse = { token: 'auth-token-123' };
    mockApiService.login.mockResolvedValueOnce(mockAuthResponse);
    
    render(<LoginScreen onLoginSuccess={mockOnLoginSuccess} />);
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    const passwordInput = screen.getByPlaceholderText('Enter your password');
    const loginButton = screen.getByText('Login');
    
    fireEvent.changeText(emailInput, '  test@example.com  ');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);
    
    await waitFor(() => {
      expect(mockApiService.login).toHaveBeenCalledWith({
        email: 'test@example.com', // Should be trimmed
        password: 'password123'
      });
    });
  });
});