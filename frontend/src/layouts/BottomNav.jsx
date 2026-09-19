import { NavLink } from 'react-router-dom';
import { bottomNavigation } from './navigation.js';

export default function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Primary">
      <div className="bottomnav-inner">
        {bottomNavigation.map((item) => {
          const Icon = item.icon;

          if (item.soon) {
            return (
              <span key={item.id} className="bottomnav-item bottomnav-item--disabled">
                <span className="bottomnav-dot" aria-hidden="true" />
                <span className="bottomnav-icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span>{item.label}</span>
              </span>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `bottomnav-item bottomnav-item--link${isActive ? ' active' : ''}`}
            >
              <span className="bottomnav-icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}