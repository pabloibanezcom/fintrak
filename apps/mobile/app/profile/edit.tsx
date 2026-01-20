import React from 'react';
import { useRouter } from 'expo-router';
import EditProfileScreen from '../../screens/EditProfileScreen';
import { apiService } from '../../services/api';
import { useUser } from '../../context/UserContext';

interface UserData {
  name: string;
  lastName: string;
  email: string;
}

export default function EditProfileRoute() {
  const router = useRouter();
  const { fetchUser } = useUser();

  const handleBack = () => {
    router.back();
  };

  const handleSave = async (userData: UserData) => {
    try {
      await apiService.updateUserProfile(userData);
      await fetchUser();
      router.back();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <EditProfileScreen
      onBack={handleBack}
      onSave={handleSave}
    />
  );
}
