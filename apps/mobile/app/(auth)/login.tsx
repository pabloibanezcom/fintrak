import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import type { LoginRequest } from '@fintrak/types';
import { apiService } from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { useSession } from '../../context/SessionContext';
import Input from '../../components/Input';
import { Ionicons } from '@expo/vector-icons';
import { componentStyles } from '../../styles';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { theme } = useTheme();
  const { signIn } = useSession();
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleSignIn();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const credentials: LoginRequest = { email: email.trim(), password };
      const response = await apiService.login(credentials);
      await signIn(response.token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        await signIn(result.token);
      }
    } catch (error) {
      console.error('Google Sign-In failed:', error);
    }
  };

  return (
    <View style={componentStyles.loginContainer}>
      <ScrollView
        style={componentStyles.loginScrollView}
        contentContainerStyle={componentStyles.loginContentContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={componentStyles.loginTitle}>Sign In</Text>

        {/* Email Input */}
        <View style={componentStyles.loginInputContainer}>
          <Text style={componentStyles.loginInputLabel}>Email</Text>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={componentStyles.loginInputContainerOverride}
            inputStyle={componentStyles.loginCustomInput}
          />
        </View>

        {/* Password Input */}
        <View style={componentStyles.loginInputContainer}>
          <Text style={componentStyles.loginInputLabel}>Password</Text>
          <View style={{ position: 'relative' }}>
            <Input
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              containerStyle={componentStyles.loginInputContainerOverride}
              inputStyle={{ ...componentStyles.loginCustomInput, paddingRight: 50 }}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 0, top: 0, bottom: 0, justifyContent: 'center', paddingHorizontal: 16 }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          style={[
            componentStyles.loginSignInButton,
            (loading || googleLoading) && componentStyles.loginSignInButtonDisabled
          ]}
          onPress={handleLogin}
          disabled={loading || googleLoading}
        >
          <Text style={componentStyles.loginSignInButtonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={componentStyles.loginDividerContainer}>
          <View style={componentStyles.loginDividerLine} />
          <Text style={componentStyles.loginDividerText}>or</Text>
          <View style={componentStyles.loginDividerLine} />
        </View>

        {/* Google Sign In Button */}
        <TouchableOpacity
          style={[
            componentStyles.loginGoogleButton,
            (loading || googleLoading) && componentStyles.loginSignInButtonDisabled
          ]}
          onPress={handleGoogleSignIn}
          disabled={loading || googleLoading}
        >
          <Image
            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
            style={[componentStyles.loginGoogleIcon, { width: 24, height: 24 }]}
          />
          <Text style={componentStyles.loginGoogleButtonText}>
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
