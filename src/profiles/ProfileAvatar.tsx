import { useState } from 'react';
import type { ProfileConfig } from './profiles.config';

export function ProfileAvatar({ profile, size }: { profile: ProfileConfig; size: string }) {
  const [photoFailed, setPhotoFailed] = useState(false);

  if (!photoFailed) {
    return (
      <img
        src={profile.photoUrl}
        alt={profile.name}
        onError={() => setPhotoFailed(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '3px solid var(--accent)',
        }}
      />
    );
  }

  return (
    <span className="float-avatar" style={{ fontSize: size }}>
      {profile.avatarEmoji}
    </span>
  );
}
