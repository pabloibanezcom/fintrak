import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import type { LoginRequest } from '@fintrak/types';
import { apiService } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import Input from '../components/Input';
import { Ionicons } from '@expo/vector-icons';
import { componentStyles } from '../styles';

interface LoginScreenProps {
  onLoginSuccess: (token: string) => void;
  onBackPress?: () => void;
}

export default function LoginScreen({ onLoginSuccess, onBackPress }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const credentials: LoginRequest = { email: email.trim(), password };
      const response = await apiService.login(credentials);
      
      // Set the token in the API service
      apiService.setToken(response.token);
      
      // Notify parent component of successful login
      onLoginSuccess(response.token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={componentStyles.loginContainer}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} translucent={false} />
      <ScrollView
        style={componentStyles.loginScrollView}
        contentContainerStyle={componentStyles.loginContentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Back Button */}
        {onBackPress && (
          <TouchableOpacity style={componentStyles.loginBackButton} onPress={onBackPress}>
            <View style={componentStyles.loginBackButtonCircle}>
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text style={componentStyles.loginTitle}>Sign In</Text>

        {/* Email Field */}
        <View style={componentStyles.loginInputContainer}>
          <Text style={componentStyles.loginInputLabel}>Email Address</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            leftIcon={<Ionicons name="mail-outline" size={22} color={theme.colors.text.secondary} />}
            containerStyle={componentStyles.loginInputContainerOverride}
            inputStyle={componentStyles.loginCustomInput}
          />
        </View>

        {/* Password Field */}
        <View style={componentStyles.loginInputContainer}>
          <Text style={componentStyles.loginInputLabel}>Password</Text>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            leftIcon={<Ionicons name="lock-closed-outline" size={22} color={theme.colors.text.secondary} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            }
            containerStyle={componentStyles.loginInputContainerOverride}
            inputStyle={componentStyles.loginCustomInput}
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[componentStyles.loginSignInButton, (loading || !email.trim() || !password.trim()) && componentStyles.loginSignInButtonDisabled]}
          onPress={handleLogin}
          disabled={loading || !email.trim() || !password.trim()}
        >
          <Text style={componentStyles.loginSignInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

