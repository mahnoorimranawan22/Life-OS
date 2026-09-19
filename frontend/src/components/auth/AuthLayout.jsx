import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardBody } from '../ui/Card.jsx';
import Logo from '../../pages/landing/Logo.jsx';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-glow" aria-hidden="true" />
      <main className="auth-main">
        <div className="auth-logo">
          <Logo to="/" />
        </div>

        <Card className="auth-sheet">
          <CardBody className="auth-body">
            <header className="auth-head">
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </header>
            {children}
            {footer && <div className="auth-foot">{footer}</div>}
          </CardBody>
        </Card>

        <Link to="/" className="auth-back">
          <ArrowLeft size={15} aria-hidden="true" />
          Back to home
        </Link>
      </main>
    </div>
  );
}