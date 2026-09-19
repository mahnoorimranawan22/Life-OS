import { cn } from '../../utils/cn.js';

const sizes = {
  sm: 'avatar--sm',
  md: 'avatar--md',
  lg: 'avatar--lg',
};

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

export default function Avatar({ name = 'LifeOS', src, size = 'md', tone = 'primary', className }) {
  if (src) {
    return (
      <img
        className={cn('avatar', sizes[size], className)}
        src={src}
        alt={name}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  return (
    <span
      className={cn('avatar', sizes[size], tone === 'accent' && 'avatar--accent', className)}
      aria-label={name}
      title={name}
    >
      {initials(name)}
    </span>
  );
}