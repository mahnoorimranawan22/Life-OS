import { AlertCircle } from 'lucide-react';
import Button from './Button.jsx';
import { cn } from '../../utils/cn.js';

export default function ErrorState({
  icon: Icon = AlertCircle,
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}) {
  return (
    <div className={cn('error-state', className)}>
      <div className="error-state-icon">
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onRetry && <Button onClick={onRetry}>{retryLabel}</Button>}
    </div>
  );
}