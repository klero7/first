import { useState } from 'react';
import { ProfileProvider, useProfile, currentProfileConfig } from './profiles/ProfileContext';
import { ProfileSelectScreen } from './profiles/ProfileSelectScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RoundRunner } from './games/RoundRunner';
import { ThemeProvider } from './theme/ThemeProvider';
import { UpdatePrompt } from './pwa/UpdatePrompt';
import { getSetsForChild } from './content/loader';
import { useProgress } from './progress/useProgress';
import type { ChildId, ExerciseSet } from './content/types';

function ChildExperience({ child }: { child: ChildId }) {
  const { clearChild } = useProfile();
  const profile = currentProfileConfig(child)!;
  const sets = getSetsForChild(child);
  const { progress, recordResult } = useProgress(child);
  const [activeSet, setActiveSet] = useState<ExerciseSet | null>(null);

  if (activeSet) {
    return (
      <RoundRunner
        set={activeSet}
        theme={profile.theme}
        onExit={() => setActiveSet(null)}
        onComplete={(correct, total) => recordResult(activeSet.id, correct, total)}
      />
    );
  }

  return (
    <HomeScreen
      profile={profile}
      sets={sets}
      progress={progress}
      onPickSet={setActiveSet}
      onSwitchProfile={clearChild}
    />
  );
}

function AppInner() {
  const { currentChild, selectChild } = useProfile();
  const profile = currentProfileConfig(currentChild);

  return (
    <ThemeProvider theme={profile?.theme ?? null}>
      {currentChild ? <ChildExperience child={currentChild} /> : <ProfileSelectScreen onSelect={selectChild} />}
      <UpdatePrompt />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ProfileProvider>
      <AppInner />
    </ProfileProvider>
  );
}
