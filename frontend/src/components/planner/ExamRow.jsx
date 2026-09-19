import { MapPin, Pencil, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import { whenText, formatFullDate } from '../../utils/planner.js';
import { cn } from '../../utils/cn.js';

export default function ExamRow({ exam, subject, onEdit, onDelete }) {
  const when = exam.examDate ? whenText(exam.examDate) : null;
  const styles = subject?.color ? { ['--subject' ]: subject.color } : undefined;

  return (
    <li className="exam-row" style={styles}>
      <div className="exam-date">
        <span className="exam-date-day">{when ? new Date(exam.examDate).getDate() : '–'}</span>
        <span className="exam-date-month">
          {when
            ? new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(exam.examDate))
            : 'no date'}
        </span>
      </div>

      <div className="exam-main">
        <div className="exam-title">{exam.title}</div>
        <div className="exam-meta">
          {subject && (
            <span className="assignment-subject">
              <span className="assignment-subject-dot" aria-hidden="true" />
              {subject.name}
            </span>
          )}
          {exam.examDate && (
            <span
              className={cn(
                'assignment-due',
                when?.overdue && 'assignment-due--overdue',
                !when?.overdue && when?.isToday && 'assignment-due--today'
              )}
            >
              {when?.isToday || when?.overdue ? when.text : formatFullDate(exam.examDate)}
            </span>
          )}
        </div>
        {(exam.location || exam.notes) && (
          <p className="exam-details">
            {exam.location && (
              <span className="exam-detail">
                <MapPin size={13} aria-hidden="true" />
                {exam.location}
              </span>
            )}
            {exam.notes && <span className="exam-detail">{exam.notes}</span>}
          </p>
        )}
      </div>

      <div className="exam-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label={`Edit exam: ${exam.title}`}
          onClick={() => onEdit(exam)}
        >
          <Pencil size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          aria-label={`Delete exam: ${exam.title}`}
          onClick={() => onDelete(exam)}
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}