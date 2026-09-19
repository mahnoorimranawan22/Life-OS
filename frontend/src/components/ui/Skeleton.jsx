import { cn } from '../../utils/cn.js';

export default function Skeleton({ width = '100%', height = 16, className, style }) {
  return (
    <span className={cn('skeleton', className)} style={{ display: 'block', width, height, ...style }} aria-hidden="true" />
  );
}

export function SkeletonLines({ lines = 3, className }) {
  return (
    <div className={cn('demo-col', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} width={`${100 - index * 12}%`} height={14} />
      ))}
    </div>
  );
}

export function PageLoading({ label = 'Loading…', className }) {
  return (
    <div className={cn('demo-col', className)} style={{ alignItems: 'center', padding: '40px 0', gap: '12px' }}>
      <Skeleton width={48} height={48} style={{ borderRadius: '50%' }} />
      <Skeleton width={160} height={16} />
      <Skeleton width={220} height={13} />
      <span className="text-sm muted">{label}</span>
    </div>
  );
}