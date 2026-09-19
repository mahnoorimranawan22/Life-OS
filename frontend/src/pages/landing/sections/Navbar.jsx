import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Logo from '../Logo.jsx';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Overview', href: '#overview' },
  { label: 'AI preview', href: '#ai' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <header className="lk-nav">
      <div className="lk-nav-inner">
        <Logo />

        <nav className="lk-nav-links" aria-label="Primary">
          {links.map(({ label, href }) => (
            <a key={href} className="lk-nav-link" href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="lk-nav-cta">
          <Link to="/login" className="lk-nav-link--btn">
            <Button variant="outline" size="sm">
              Log in
            </Button>
          </Link>
          <Link to="/register" className="lk-nav-link--btn">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>

        <button
          type="button"
          className="lk-nav-toggle"
          aria-expanded={open}
          aria-controls="lk-mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div id="lk-mobile-menu" className="lk-mobile-menu" ref={menuRef}>
          <nav aria-label="Mobile">
            {links.map(({ label, href }) => (
              <a key={href} className="lk-mobile-link" href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <div className="lk-mobile-cta">
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}