import { cn } from '../../utils/cn.js';

export default function DashboardCard({ id, icon: Icon, title, subtitle, className, children }) {
  return (
    <section className={cn('dash-card card', className)} aria-labelledby={`${id}-title`}>
      <header className="dash-card-head">
        {Icon && (
          <span className="dash-card-icon">
            <Icon size={18} aria-hidden="true" />
          </span>
        )}
        <div className="dash-card-titles">
          <h2 id={`${id}-title`}>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </header>
      <div className="dash-card-body">{children}</div>
    </section>
  );
}