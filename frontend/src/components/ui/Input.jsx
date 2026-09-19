import { cn } from '../../utils/cn.js';

export default function Input({
  label,
  hint,
  error,
  icon: Icon,
  id,
  className,
  wrapperClassName,
  optional,
  ...props
}) {
  const inputId = id || props.name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('field', wrapperClassName, error && 'field--error')}>
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
          {optional && <span className="field-optional"> · optional</span>}
        </label>
      )}
      <div className="field-control">
        {Icon && <Icon className="field-icon" size={18} aria-hidden="true" />}
        <input id={inputId} className={cn('field-input', className)} {...props} />
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