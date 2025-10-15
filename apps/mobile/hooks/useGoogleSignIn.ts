import { useState } from 'react';
import { Alert } from 'react-native';

interface GoogleSignInResult {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    lastName?: string;
    profilePicture?: string;
    authProvider: string;
  };
}

export const useGoogleSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async (): Promise<GoogleSignInResult | null> => {
    try {
      setIsLoading(true);

      // For now, show a message that Google Sign-In is not available
      Alert.alert(
        'Google Sign-In',
        'Google Sign-In is currently not available in development mode. Please use email/password login instead.',
        [
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );

      return null;

    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      Alert.alert(
        'Sign-In Error',
        error.message || 'Failed to sign in with Google. Please try again.'
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
  };
};