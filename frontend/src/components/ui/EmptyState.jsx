import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export default function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}) {
  return (
    <div className={cn('empty-state', className)}>
      <div className="empty-state-icon">
        <Icon size={26} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}