import { cn } from '../../utils/cn.js';

export function Card({ className, hover = false, flat = false, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn('card', hover && 'card--hover', flat && 'card--flat', className)}
      {...props}
    />
  );
}

export function CardHeader({ title, subtitle, icon: Icon, actions, className, ...props }) {
  return (
    <div className={cn('card-header', className)} {...props}>
      <div className="card-header-titles">
        {title && <h3 className="card-title">{title}</h3>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      {(Icon || actions) && (
        <div className="card-actions">
          {Icon && <Icon size={20} className="muted" aria-hidden="true" />}
          {actions}
        </div>
      )}
    </div>
  );
}

export function CardBody({ className, ...props }) {
  return <div className={cn('card-body', className)} {...props} />;
}

export function CardFooter({ className, ...props }) {
  return <div className={cn('card-footer', className)} {...props} />;
}