import { cn } from '../../utils/cn.js';

export default function Progress({ value = 0, max = 100, label, size = 'md', tone = 'primary', className }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('progress', tone === 'accent' && 'progress--accent', className)}>
      {label && (
        <div className="progress-head">
          <span>{label}</span>
          <span>{Math.round(percent)}%</span>
        </div>
      )}
      <div className={cn('progress-track', size === 'sm' && 'progress-track--sm', size === 'lg' && 'progress-track--lg')}>
        <div className="progress-fill" style={{ width: `${percent}%` }} role="progressbar" aria-valuenow={Math.round(percent)} aria-valuemin={0} aria-valuemax={100} />
      </div>
    </div>
  );
}

export function ProgressIndeterminate({ size = 'md', className }) {
  return (
    <div className={cn('progress progress--indeterminate', className)}>
      <div className={cn('progress-track', size === 'sm' && 'progress-track--sm', size === 'lg' && 'progress-track--lg')}>
        <div className="progress-fill" aria-hidden="true" />
      </div>
    </div>
  );
}