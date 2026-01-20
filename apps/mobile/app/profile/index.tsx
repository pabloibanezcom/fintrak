import React from 'react';
import { useRouter } from 'expo-router';
import ProfileScreen from '../../screens/ProfileScreen';
import { useSession } from '../../context/SessionContext';

export default function ProfileRoute() {
  const router = useRouter();
  const { signOut } = useSession();

  const handleBack = () => {
    router.back();
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <ProfileScreen
      onLogout={handleLogout}
      onBack={handleBack}
      onEditProfile={handleEditProfile}
    />
  );
}
