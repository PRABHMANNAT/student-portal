import { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { DEMO_PROFILE, normalizeProfile } from '../lib/profileSchema';

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(() => normalizeProfile(DEMO_PROFILE));
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const updateProfile = useCallback((patch) => {
    setProfileState((current) => normalizeProfile({ ...current, ...patch }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfileState(normalizeProfile(DEMO_PROFILE));
  }, []);

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      resetProfile,
      profileModalOpen,
      setProfileModalOpen
    }),
    [profile, profileModalOpen, resetProfile, updateProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile must be used inside ProfileProvider');
  }

  return context;
}
