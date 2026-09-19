import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const sizes = {
  sm: 16,
  md: 22,
  lg: 32,
};

export default function Spinner({ size = 'md', tone = 'default', label, className }) {
  const pixel = sizes[size] || sizes.md;

  return (
    <span
      className={cn(
        'spinner',
        tone === 'primary' && 'spinner--primary',
        tone === 'accent' && 'spinner--accent',
        className
      )}
      role="status"
      aria-label={label || 'Loading'}
    >
      <Loader2 size={pixel} aria-hidden="true" />
    </span>
  );
}