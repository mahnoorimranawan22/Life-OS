import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

const variants = {
  primary: 'btn--primary',
  accent: 'btn--accent',
  secondary: 'btn--secondary',
  outline: 'btn--outline',
  ghost: 'btn--ghost',
  danger: 'btn--danger',
  success: 'btn--success',
};

const sizes = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn('btn', variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 className="btn-spinner" size={18} aria-hidden="true" />
      ) : LeftIcon ? (
        <LeftIcon size={18} aria-hidden="true" />
      ) : null}
{children && <span>{children}</span>}
      {!loading && RightIcon ? <RightIcon size={18} aria-hidden="true" /> : null}
    </button>
  );
}