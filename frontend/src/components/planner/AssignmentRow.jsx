import { Check, Clock3, Pencil, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import { cn } from '../../utils/cn.js';
import { whenText, ASSIGNMENT_PRIORITY_BADGE, ASSIGNMENT_PRIORITY_LABELS, ASSIGNMENT_STATUS_BADGE, ASSIGNMENT_STATUS_LABELS } from '../../utils/planner.js';

export default function AssignmentRow({ assignment, subject, onToggle, onEdit, onDelete }) {
  const done = assignment.status === 'completed';
  const when = assignment.dueDate ? whenText(assignment.dueDate) : null;
  const styles = subject?.color ? { ['--subject' ]: subject.color } : undefined;

  return (
    <li className={cn('assignment-row', done && 'assignment-row--done')} style={styles}>
      <button
        type="button"
        className={cn('assignment-check', done && 'assignment-check--done')}
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
        aria-pressed={done}
        onClick={() => onToggle(assignment)}
      >
        {done && <Check size={13} strokeWidth={3} aria-hidden="true" />}
      </button>

      <div className="assignment-main">
        <div className="assignment-title">{assignment.title}</div>
        {assignment.description && <p className="assignment-desc">{assignment.description}</p>}
        <div className="assignment-meta">
          {subject ? (
            <span className="assignment-subject">
              <span className="assignment-subject-dot" aria-hidden="true" />
              {subject.name}
            </span>
          ) : null}
          <Badge variant={ASSIGNMENT_PRIORITY_BADGE[assignment.priority] || 'neutral'}>
            {ASSIGNMENT_PRIORITY_LABELS[assignment.priority] || assignment.priority}
          </Badge>
          <Badge variant={ASSIGNMENT_STATUS_BADGE[assignment.status] || 'neutral'}>
            {ASSIGNMENT_STATUS_LABELS[assignment.status] || assignment.status}
          </Badge>
          {when && (
            <span
              className={cn(
                'assignment-due',
                when.overdue && 'assignment-due--overdue',
                !when.overdue && when.isToday && 'assignment-due--today'
              )}
            >
              <Clock3 size={13} aria-hidden="true" />
              {when.overdue ? `Overdue · ${when.text}` : when.text}
            </span>
          )}
        </div>
      </div>

      <div className="assignment-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label={`Edit assignment: ${assignment.title}`}
          onClick={() => onEdit(assignment)}
        >
          <Pencil size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          aria-label={`Delete assignment: ${assignment.title}`}
          onClick={() => onDelete(assignment)}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}