const DEFAULT_AVATAR_SEED = 'user';

export function getDiceBearAvatarUrl(seed) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed || DEFAULT_AVATAR_SEED)}`;
}

export default function UserAvatar({ seed, name, size = 40, className = '' }) {
  const rawSeed = seed || name || DEFAULT_AVATAR_SEED;
  const avatarSeed = rawSeed === 'Demo Student' ? 'DemoStudent' : rawSeed;
  const label = name || seed || 'User';

  return (
    <img
      src={getDiceBearAvatarUrl(avatarSeed)}
      alt={`${label} avatar`}
      className={`user-avatar ${className}`.trim()}
      width={size}
      height={size}
      style={{ '--avatar-size': `${size}px` }}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  );
}
