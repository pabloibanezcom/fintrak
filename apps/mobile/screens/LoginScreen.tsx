import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background.primary} translucent={false} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Back Button */}
        {onBackPress && (
          <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
            <View style={styles.backButtonCircle}>
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        )}

        {/* Title */}
        <Text style={styles.title}>Sign In</Text>

        {/* Email Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            leftIcon={<Ionicons name="mail-outline" size={22} color={theme.colors.text.secondary} />}
            containerStyle={styles.inputContainerOverride}
            inputStyle={styles.customInput}
          />
        </View>

        {/* Password Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
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
            containerStyle={styles.inputContainerOverride}
            inputStyle={styles.customInput}
          />
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.signInButton, (loading || !email.trim() || !password.trim()) && styles.signInButtonDisabled]}
          onPress={handleLogin}
          disabled={loading || !email.trim() || !password.trim()}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: theme.colors.background.primary,
    minHeight: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
  backButtonCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: theme.typography.fontFamily.medium,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 50,
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginBottom: 12,
  },
  inputContainerOverride: {
    marginBottom: 0,
  },
  customInput: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    backgroundColor: 'transparent',
    paddingVertical: 8,
  },
  signInButton: {
    backgroundColor: theme.colors.primary[500],
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    width: '100%',
  },
  signInButtonDisabled: {
    opacity: 0.5,
  },
  signInButtonText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.semiBold,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
});