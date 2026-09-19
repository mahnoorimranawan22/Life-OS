import { cn } from '../../utils/cn.js';

const variants = {
  neutral: 'badge--neutral',
  primary: 'badge--primary',
  soft: 'badge--soft',
  accent: 'badge--accent',
  success: 'badge--success',
  warning: 'badge--warning',
  danger: 'badge--danger',
  outline: 'badge--outline',
};

export default function Badge({ variant = 'neutral', dot = false, className, children }) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {dot && <span className="badge-dot" aria-hidden="true" />}
      {children}
    </span>
  );
}