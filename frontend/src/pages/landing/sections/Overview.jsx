import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import Reveal from '../Reveal.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const points = [
  'Everything relevant in one glance — today\u2019s priorities, deadlines and open work from all modules.',
  'See the shape of your week ahead of time, with focus blocks and a lightweight evening review.',
  'Calm by default: no streaks, no pressure, no guilt built into the interface.',
];

const lanes = [
  { label: 'Today', items: [{ text: 'Essay outline — due 9:00', tag: 'Planner' }, { text: 'Internship follow-up', tag: 'Career' }] },
  {
    label: 'This week',
    items: [
      { text: 'Project milestone draft', tag: 'Projects' },
      { text: 'Intro to Organic Chemistry', tag: 'Planner' },
      { text: 'Tidy notes into topic folder', tag: 'Notes' },
    ],
  },
  {
    label: 'Later',
    items: [
      { text: 'Card sorting for handoff', tag: 'Projects' },
      { text: 'Summer internship shortlist', tag: 'Career' },
    ],
  },
];

export default function Overview() {
  return (
    <section id="overview" className="lk-section" aria-labelledby="overview-heading">
      <div className="lk-inner lk-split">
        <Reveal className="lk-split-copy">
          <span className="eyebrow">Productivity overview</span>
          <h2 id="overview-heading">A dashboard for the day — not a pile of spreadsheets</h2>
          <p className="lk-split-lead">
            Every module stays organised in the background, while one overview keeps you pointed
            at what actually matters today.
          </p>
          <ul className="lk-point-list">
            {points.map((point) => (
              <li key={point}>
                <span className="lk-point-check">
                  <Check size={14} strokeWidth={3} aria-hidden="true" />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link to="/home" className="lk-text-link">
            See the workspace <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal className="lk-overview-visual" delay={120} aria-hidden="true">
          <div className="lk-window">
            <div className="lk-window-bar">
              <span className="lk-window-title">Priority overview</span>
              <Badge variant="accent">Preview</Badge>
            </div>
            <div className="lk-window-body lk-lanes">
              {lanes.map((lane) => (
                <div className="lk-lane" key={lane.label}>
                  <span className="lk-lane-label">{lane.label}</span>
                  <ul className="lk-lane-list">
                    {lane.items.map((item) => (
                      <li className="lk-lane-item" key={item.text}>
                        <span className="lk-lane-text">{item.text}</span>
                        <Badge variant="neutral">{item.tag}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}