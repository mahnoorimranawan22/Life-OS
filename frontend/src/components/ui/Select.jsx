import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn.js';

export default function Select({
  label,
  hint,
  error,
  id,
  className,
  wrapperClassName,
  optional,
  children,
  ...props
}) {
  const selectId = id || props.name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('field', wrapperClassName, error && 'field--error')}>
      {label && (
        <label className="field-label" htmlFor={selectId}>
          {label}
          {optional && <span className="field-optional"> · optional</span>}
        </label>
      )}
      <div className="field-control">
        <select id={selectId} className={cn('field-input', className)} {...props}>
          {children}
        </select>
        <ChevronDown className="field-icon--end" size={18} aria-hidden="true" />
      </div>
      {error ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
}