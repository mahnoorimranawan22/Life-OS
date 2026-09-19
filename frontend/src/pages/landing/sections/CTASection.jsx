import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Reveal from '../Reveal.jsx';

export default function CTASection() {
  return (
    <section className="lk-section" aria-labelledby="cta-heading">
      <div className="lk-inner">
        <Reveal className="lk-cta">
          <span className="lk-cta-icon" aria-hidden="true">
            <Sparkles size={22} />
          </span>
          <h2 id="cta-heading">Put your life in one place</h2>
          <p>
            Start with a calm list of today's priorities — the workspace grows with you, module by
            module.
          </p>
          <div className="lk-cta-row">
            <Link to="/register">
              <Button variant="accent" size="lg" rightIcon={ArrowRight}>
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="lk-cta-ghost">
                Log in
              </Button>
            </Link>
          </div>
          <span className="lk-cta-note">Free while it ships — sign up in under a minute.</span>
        </Reveal>
      </div>
    </section>
  );
}