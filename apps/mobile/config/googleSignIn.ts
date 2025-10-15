import Constants from 'expo-constants';

// Google Sign-In configuration for Expo
export const getGoogleConfig = () => {
  const googleClientId = Constants.expoConfig?.extra?.googleClientIdIos;

  if (!googleClientId) {
    console.warn('Google Client ID not found in app configuration');
    return null;
  }

  return {
    clientId: googleClientId,
  };
};