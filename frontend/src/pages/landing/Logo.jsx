import { Link } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar.jsx';
import { brand } from '../../layouts/navigation.js';

export default function Logo({ to = '/', dark = false, className }) {
  return (
    <Link to={to} className="lk-logo" aria-label={`${brand.name} — ${brand.tagline}`}>
      <span className="lk-logo-mark">
        <Avatar name={brand.name} size="sm" />
      </span>
      <span className="lk-logo-text">
        <span className={dark ? 'brand-name lk-logo-name lk-logo-name--dark' : 'brand-name lk-logo-name'}>
          {brand.name}
        </span>
        <span className="lk-logo-tag">{'Personal operating system'}</span>
      </span>
    </Link>
  );
}