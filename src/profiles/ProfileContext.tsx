import { createContext, useContext, useState, useCallback } from 'react';
import type { ChildId } from '../content/types';
import { PROFILES } from './profiles.config';

const LAST_PROFILE_KEY = 'kidsapp:lastProfile';

interface ProfileContextValue {
  currentChild: ChildId | null;
  selectChild: (child: ChildId) => void;
  clearChild: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [currentChild, setCurrentChild] = useState<ChildId | null>(null);

  const selectChild = useCallback((child: ChildId) => {
    setCurrentChild(child);
    localStorage.setItem(LAST_PROFILE_KEY, child);
  }, []);

  const clearChild = useCallback(() => {
    setCurrentChild(null);
  }, []);

  return (
    <ProfileContext.Provider value={{ currentChild, selectChild, clearChild }}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

export function currentProfileConfig(child: ChildId | null) {
  return child ? PROFILES[child] : null;
}
