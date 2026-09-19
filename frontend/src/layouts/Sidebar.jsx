import { NavLink } from 'react-router-dom';
import Badge from '../components/ui/Badge.jsx';
import Avatar from '../components/ui/Avatar.jsx';
import { brand, navigation } from './navigation.js';

export default function Sidebar({ user }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-row">
          <span className="brand-mark">
            <Avatar name={brand.name} size="sm" />
          </span>
          <span className="brand-name">{brand.name}</span>
        </div>
        <p className="brand-tagline">{brand.tagline}</p>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        {navigation.map((item) => {
          const Icon = item.icon;

          if (item.soon) {
            return (
              <span key={item.id} className="nav-item nav-item--disabled">
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
                <span className="nav-item-suffix">
                  <Badge variant="neutral">Soon</Badge>
                </span>
              </span>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Avatar name={user?.name || 'Guest'} />
        <div>
          <div className="sidebar-footer-name">{user?.name || 'Guest'}</div>
          <div className="sidebar-footer-role">Local workspace</div>
        </div>
      </div>
    </aside>
  );
}