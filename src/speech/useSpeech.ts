import { useState, useCallback } from 'react';
import { isMuted, setMuted } from './speech';

export function useSpeech() {
  const [muted, setMutedState] = useState(isMuted());

  const toggleMuted = useCallback(() => {
    setMuted(!muted);
    setMutedState(!muted);
  }, [muted]);

  return { muted, toggleMuted };
}
