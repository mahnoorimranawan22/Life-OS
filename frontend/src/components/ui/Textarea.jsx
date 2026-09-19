import { cn } from '../../utils/cn.js';

export default function Textarea({
  label,
  hint,
  error,
  id,
  className,
  wrapperClassName,
  optional,
  ...props
}) {
  const textareaId =
    id || props.name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('field', wrapperClassName, error && 'field--error')}>
      {label && (
        <label className="field-label" htmlFor={textareaId}>
          {label}
          {optional && <span className="field-optional"> · optional</span>}
        </label>
      )}
      <div className="field-control">
        <textarea id={textareaId} className={cn('field-input', className)} {...props} />
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