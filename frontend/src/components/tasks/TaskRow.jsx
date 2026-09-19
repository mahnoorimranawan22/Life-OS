import { Check, Pencil, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import { cn } from '../../utils/cn.js';
import {
  dueLabel,
  PRIORITY_BADGE,
  PRIORITY_LABELS,
  STATUS_BADGE,
  STATUS_LABELS,
} from '../../utils/tasks.js';

export default function TaskRow({ task, onToggle, onEdit, onDelete }) {
  const done = task.status === 'completed';
  const due = dueLabel(task);

  return (
    <li className={cn('task-row', done && 'task-row--done')}>
      <button
        type="button"
        className={cn('task-check', done && 'task-check--done')}
        aria-label={done ? 'Mark as not done' : 'Mark as done'}
        aria-pressed={done}
        onClick={() => onToggle(task)}
      >
        {done && <Check size={13} strokeWidth={3} aria-hidden="true" />}
      </button>

      <div className="task-main">
        <div className="task-title">{task.title}</div>
        {task.description && <p className="task-desc">{task.description}</p>}
        <div className="task-meta">
          {task.category && <Badge variant="soft">{task.category}</Badge>}
          <Badge variant={PRIORITY_BADGE[task.priority] || 'neutral'}>
            {PRIORITY_LABELS[task.priority] || task.priority}
          </Badge>
          <Badge variant={STATUS_BADGE[task.status] || 'neutral'}>
            {STATUS_LABELS[task.status] || task.status}
          </Badge>
          {due && (
            <span
              className={cn(
                'task-due',
                due.overdue && 'task-due--overdue',
                !due.overdue && due.isToday && 'task-due--today'
              )}
            >
              {due.overdue ? `Overdue · ${due.text}` : due.text}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label={`Edit task: ${task.title}`}
          onClick={() => onEdit(task)}
        >
          <Pencil size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          aria-label={`Delete task: ${task.title}`}
          onClick={() => onDelete(task)}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}