import Logo from '../Logo.jsx';
import { brand } from '../../../layouts/navigation.js';

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Overview', href: '#overview' },
  { label: 'AI preview', href: '#ai' },
];

const workspaceLinks = ['Tasks', 'Planner', 'Projects', 'Internships', 'Notes'];

export default function Footer() {
  return (
    <footer className="lk-footer">
      <div className="lk-inner">
        <div className="lk-footer-grid">
          <div className="lk-footer-brand">
            <Logo />
            <p>{brand.tagline}</p>
            <p className="lk-footer-muted">
              A personal workspace for studies, work and the things that matter most.
            </p>
          </div>

          <nav className="lk-footer-col" aria-label="Product">
            <h4>Product</h4>
            <ul>
              {productLinks.map(({ label, href }) => (
                <li key={href}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lk-footer-col" aria-label="Workspaces">
            <h4>Workspaces</h4>
            <ul>
              {workspaceLinks.map((label) => (
                <li key={label}>
                  <a href="/home">{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lk-footer-col">
            <h4>Status</h4>
            <ul>
              <li>
                <span className="lk-status">
                  <span className="lk-status-dot" aria-hidden="true" />
                  Workspace preview
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="lk-footer-bottom">
          <span>© 2026 LifeOS</span>
          <span>Built with the LifeOS design system.</span>
        </div>
      </div>
    </footer>
  );
}