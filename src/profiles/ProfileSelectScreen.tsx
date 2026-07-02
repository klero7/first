import { PROFILE_LIST } from './profiles.config';
import { ProfileAvatar } from './ProfileAvatar';
import type { ChildId } from '../content/types';
import { initSpeech } from '../speech/speech';

export function ProfileSelectScreen({ onSelect }: { onSelect: (child: ChildId) => void }) {
  const handlePick = (child: ChildId) => {
    // Speech synthesis needs a user gesture on Android Chrome to reliably
    // unlock voices, so we initialize it here rather than on app mount.
    initSpeech();
    onSelect(child);
  };

  return (
    <div className="app-shell" data-theme="space" style={{ alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
      <h1 className="bounce-in" style={{ fontSize: '2.2rem', margin: 0 }}>
        Кто сегодня играет?
      </h1>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {PROFILE_LIST.map((profile, i) => (
          <button
            key={profile.id}
            className="big-tap card bounce-in"
            onClick={() => handlePick(profile.id)}
            style={{
              width: '13rem',
              height: '13rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              border: '3px solid var(--accent)',
              animationDelay: `${i * 0.1}s`,
              animationFillMode: 'backwards',
            }}
          >
            <ProfileAvatar profile={profile} size="4.5rem" />
            <span style={{ fontSize: '1.6rem' }}>{profile.name}</span>
            <span style={{ fontSize: '0.9rem', opacity: 0.8, fontWeight: 400 }}>{profile.tagline}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
