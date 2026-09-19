import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  CheckSquare2,
  GraduationCap,
  FolderKanban,
  Briefcase,
  Sparkles,
} from 'lucide-react';
import Button from '../../../components/ui/Button.jsx';
import Badge from '../../../components/ui/Badge.jsx';

const todayTasks = [
  { label: 'Essay outline', tag: 'Planner', done: false, priority: true },
  { label: 'Internship follow-up', tag: 'Internships', done: true, priority: false },
  { label: 'Project backlog tidy-up', tag: 'Projects', done: false, priority: false },
];

const weekModules = [
  { label: 'Tasks', note: 'Clear', icon: CheckSquare2 },
  { label: 'Planner', note: 'Due soon', icon: GraduationCap },
  { label: 'Projects', note: 'In progress', icon: FolderKanban },
  { label: 'Internships', note: 'Reviewing', icon: Briefcase },
];

export default function Hero() {
  return (
    <section className="lk-hero" aria-labelledby="hero-heading">
      <div className="lk-hero-glow lk-hero-glow--accent" aria-hidden="true" />
      <div className="lk-hero-glow lk-hero-glow--green" aria-hidden="true" />

      <div className="lk-hero-copy">
        <span className="lk-hero-badge lk-anim lk-d-1">
          <Badge variant="soft" dot>
            Your personal operating system
          </Badge>
        </span>

        <h1 id="hero-heading" className="lk-hero-title lk-anim lk-d-2">
          Your life, organized in <span className="lk-hero-accent">one place</span>.
        </h1>

        <p className="lk-hero-sub lk-anim lk-d-3">
          LifeOS brings your tasks, university, projects, career goals, notes, and daily
          priorities into one personal workspace.
        </p>

        <div className="lk-cta-row lk-anim lk-d-4">
          <Link to="/register">
            <Button size="lg" rightIcon={ArrowRight}>
              Get Started
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" size="lg">
              Explore LifeOS
            </Button>
          </a>
        </div>

        <p className="lk-hero-note lk-anim lk-d-4">
          A calm workspace for today's priorities and the goals — no streaks, no noise.
        </p>
      </div>

      <div className="lk-hero-visual lk-anim lk-d-5" aria-hidden="true">
        <div className="lk-window">
          <div className="lk-window-bar">
            <span className="lk-window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="lk-window-title">LifeOS — Today</span>
            <Badge variant="accent">Preview</Badge>
          </div>

          <div className="lk-window-body">
            <div className="lk-sheet">
              <span className="lk-sheet-label">Today</span>
              <ul className="lk-task-list">
                {todayTasks.map((task) => (
                  <li key={task.label} className={`lk-task${task.done ? ' lk-task--done' : ''}`}>
                    <span className="lk-task-check">
                      {task.done && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="lk-task-label">{task.label}</span>
                    {task.priority && <span className="lk-task-pri" aria-hidden="true" />}
                    <Badge variant="neutral">{task.tag}</Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lk-window-side">
              <span className="lk-sheet-label">This week</span>
              <div className="lk-module-chips">
                {weekModules.map(({ label, note, icon: Icon }) => (
                  <div className="lk-module-chip" key={label}>
                    <span className="lk-module-chip-icon">
                      <Icon size={14} aria-hidden="true" />
                    </span>
                    <span className="lk-module-chip-label">{label}</span>
                    <span className="lk-module-chip-note">{note}</span>
                  </div>
                ))}
              </div>
              <div className="lk-window-ai">
                <span className="lk-window-ai-icon">
                  <Sparkles size={14} aria-hidden="true" />
                </span>
                <span className="lk-window-ai-text">Week plan ready — 3 focus blocks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}