import {
  ArrowRight,
  Briefcase,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  CheckSquare2,
  ChartColumn,
  Compass,
  FolderKanban,
  FolderPlus,
  NotebookPen,
  Plus,
  Sun,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { usePlanner } from '../hooks/usePlanner.js';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import DashboardCard from '../components/dashboard/DashboardCard.jsx';
import { cn } from '../utils/cn.js';
import { comparatorFor, dueLabel, isDueToday } from '../utils/tasks.js';
import { upcomingDeadlines } from '../utils/planner.js';

const quickActions = [
  { label: 'Add task', icon: Plus, to: '/tasks' },
  { label: 'New project', icon: FolderPlus, soon: true },
  { label: 'Capture note', icon: NotebookPen, soon: true },
  { label: 'Plan week', icon: CalendarRange, soon: true },
];

function greetingFor(hour) {
  if (hour < 5) return 'Good evening';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, status, error, refresh } = useTasks();
  const planner = usePlanner();
  const { subjects, assignments, exams, status: plannerStatus, error: plannerError, refresh: plannerRefresh } = planner;
  const firstName = (user?.name || '').split(/\s+/).filter(Boolean)[0] || 'there';
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  const openTasks = tasks.filter((task) => task.status !== 'completed');
  const doneCount = tasks.length - openTasks.length;
  const dueSoon = openTasks.filter((task) => task.dueDate).sort(comparatorFor('dueDate'));
  const focusTasks = openTasks.filter(isDueToday).sort(comparatorFor('dueDate'));
  const topOpen = [...openTasks].sort(comparatorFor('dueDate')).slice(0, 4);

  const deadlines = upcomingDeadlines(assignments, exams, new Map(subjects.map((s) => [s.id, s])), 5);
  const hasSubjects = subjects.length > 0;

  return (
    <div className="dashboard">
      <header className="dash-greeting">
        <span className="eyebrow">{today}</span>
        <h1>
          {greetingFor(new Date().getHours())}, {firstName}.
        </h1>
        <p className="dash-greeting-sub">Here's what matters today.</p>
      </header>

      <div className="dash-grid">
        <DashboardCard
          id="today-focus"
          icon={Sun}
          title="Today's focus"
          subtitle="What deserves your attention today"
          className="dash-card--wide"
        >
          {status === 'loading' && (
            <div className="dash-task-skeletons" aria-hidden="true">
              {[0, 1].map((index) => (
                <div className="dash-task-skeleton" key={index}>
                  <Skeleton width={16} height={16} style={{ borderRadius: '50%' }} />
                  <Skeleton width={`${70 - index * 15}%`} height={14} />
                </div>
              ))}
            </div>
          )}
          {status === 'error' && (
            <div className="dash-card-inline">
              <p>{error}</p>
              <Button variant="ghost" size="sm" onClick={refresh}>
                Retry
              </Button>
            </div>
          )}
          {status === 'ready' && focusTasks.length === 0 && (
            <EmptyState
              icon={Compass}
              title="Nothing pressing today"
              description="Tasks due today will appear here. Plan a clear day, and show up."
            />
          )}
          {status === 'ready' && focusTasks.length > 0 && (
            <ul className="dash-task-list">
              {focusTasks.slice(0, 4).map((task) => (
                <li key={task.id} className="dash-task-row">
                  <span className="dash-task-check dash-task-check--today" aria-hidden="true" />
                  <span className="dash-task-info">
                    <span className="dash-task-title">{task.title}</span>
                    <span className="dash-task-due">Due today</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard
          id="quick-actions"
          icon={Zap}
          title="Quick actions"
          subtitle="Shortcuts to common starting points"
        >
          <div className="dash-actions">
            {quickActions.map(({ label, icon: Icon, to }) => {
              const content = (
                <>
                  <span className="dash-action-icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="dash-action-label">{label}</span>
                </>
              );
              return to ? (
                <Link to={to} className="dash-action dash-action--link" key={label}>
                  {content}
                </Link>
              ) : (
                <div className="dash-action" key={label}>
                  {content}
                  <Badge variant="neutral" className="dash-action-soon">
                    Soon
                  </Badge>
                </div>
              );
            })}
          </div>
        </DashboardCard>

        <DashboardCard
          id="tasks"
          icon={CheckSquare2}
          title="Task overview"
          subtitle="Your to-do list at a glance"
        >
          {status === 'loading' && (
            <div className="dash-task-skeletons" aria-hidden="true">
              {[0, 1, 2].map((index) => (
                <div className="dash-task-skeleton" key={index}>
                  <Skeleton width={16} height={16} style={{ borderRadius: '50%' }} />
                  <Skeleton width={`${85 - index * 12}%`} height={14} />
                </div>
              ))}
            </div>
          )}
          {status === 'error' && (
            <div className="dash-card-inline">
              <p>{error}</p>
              <Button variant="ghost" size="sm" onClick={refresh}>
                Retry
              </Button>
            </div>
          )}
          {status === 'ready' && tasks.length === 0 && (
            <EmptyState
              icon={CheckSquare2}
              title="Your workspace is ready."
              description="Add your first task and it will appear here."
            />
          )}
          {status === 'ready' && tasks.length > 0 && (
            <>
              <div className="dash-task-summary" aria-label="Task summary">
                <span>
                  <b>{openTasks.length}</b> open
                </span>
                <span>
                  <b>{dueSoon.length}</b> upcoming
                </span>
                <span>
                  <b>{doneCount}</b> done
                </span>
                <Link className="dash-card-link" to="/tasks">
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
              <ul className="dash-task-list">
                {topOpen.map((task) => {
                  const due = dueLabel(task);
                  return (
                    <li key={task.id} className="dash-task-row">
                      <span
                        className={cn(
                          'dash-task-check',
                          task.status === 'in-progress' && 'dash-task-check--progress'
                        )}
                        aria-hidden="true"
                      />
                      <span className="dash-task-info">
                        <span className="dash-task-title">{task.title}</span>
                        {due && (
                          <span
                            className={cn('dash-task-due', due.overdue && 'dash-task-due--overdue')}
                          >
                            {due.overdue ? `Overdue · ${due.text}` : due.text}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </DashboardCard>

        <DashboardCard
          id="deadlines"
          icon={CalendarClock}
          title="Upcoming deadlines"
          subtitle="From your university planner"
        >
          {plannerStatus === 'loading' && (
            <div className="dash-task-skeletons" aria-hidden="true">
              {[0, 1].map((index) => (
                <div className="dash-task-skeleton" key={index}>
                  <Skeleton width={18} height={18} />
                  <Skeleton width={`${65 - index * 15}%`} height={14} />
                </div>
              ))}
            </div>
          )}
          {plannerStatus === 'error' && (
            <div className="dash-card-inline">
              <p>{plannerError}</p>
              <Button variant="ghost" size="sm" onClick={plannerRefresh}>
                Retry
              </Button>
            </div>
          )}
          {plannerStatus === 'ready' && !hasSubjects && (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming deadlines"
              description="Add subjects and assignment or exam dates in your university planner."
              action={
                <Link className="dash-card-link" to="/planner">
                  Open planner <ArrowRight size={14} aria-hidden="true" />
                </Link>
              }
            />
          )}
          {plannerStatus === 'ready' && hasSubjects && deadlines.rows.length === 0 && (
            <EmptyState
              icon={CalendarDays}
              title="Nothing due right now"
              description="Assignment and exam dates from your planner will show up here."
              action={
                <Link className="dash-card-link" to="/planner">
                  Open planner <ArrowRight size={14} aria-hidden="true" />
                </Link>
              }
            />
          )}
          {plannerStatus === 'ready' && deadlines.rows.length > 0 && (
            <>
              <ul className="dash-task-list">
                {deadlines.rows.map((row) => (
                  <li key={`${row.kind}-${row.id}`} className="dash-task-row">
                    <Badge variant={row.kind === 'exam' ? 'accent' : 'neutral'}>
                      {row.kind === 'exam' ? 'Exam' : 'Work'}
                    </Badge>
                    <span className="dash-task-info">
                      <span className="dash-task-title">{row.title}</span>
                      <span className="dash-task-due">
                        {row.subjectName ? `${row.subjectName} · ` : ''}
                        {row.dueText}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="dash-card-link-wrap">
                <Link className="dash-card-link" to="/planner">
                  Open planner <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </>
          )}
        </DashboardCard>

        <DashboardCard
          id="projects"
          icon={FolderKanban}
          title="Project overview"
          subtitle="From first idea to shipped"
        >
          <EmptyState
            icon={FolderKanban}
            title="Your workspace is ready."
            description="Add your first project to track it from idea to shipped."
          />
        </DashboardCard>

        <DashboardCard
          id="internships"
          icon={Briefcase}
          title="Internship follow-ups"
          subtitle="Applications, interviews and offers"
        >
          <EmptyState
            icon={Briefcase}
            title="No follow-ups yet"
            description="Applications, interviews and offers will be tracked here as you start applying."
          />
        </DashboardCard>

        <DashboardCard
          id="productivity"
          icon={ChartColumn}
          title="Productivity overview"
          subtitle="Your week, understood gently"
          className="dash-card--wide"
        >
          <EmptyState
            icon={ChartColumn}
            title="Not enough data yet"
            description="Your weekly rhythm takes shape after a few days of real usage — no streaks, no numbers, just a calmer view of your week."
          />
        </DashboardCard>
      </div>
    </div>
  );
}