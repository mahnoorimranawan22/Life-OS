import { Check, Pencil, Trash2 } from 'lucide-react';
import Progress from '../ui/Progress.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { attendanceProgress } from '../../utils/planner.js';

export default function SubjectCard({
  subject,
  assignments,
  attendance,
  onEdit,
  onDelete,
  onStartAttendance,
  onRecordAttendance,
}) {
  const styles = { ['--subject' ]: subject.color };
  const tracking = attendanceProgress(attendance);
  const assignmentCount = assignments.length;

  return (
    <li className="subject-card" style={styles}>
      <div className="subject-card-head">
        <div className="subject-card-title">
          <span className="subject-flag" aria-hidden="true" />
          <div>
            <div className="subject-card-name">{subject.name}</div>
            {(subject.code || subject.instructor) && (
              <p className="subject-card-sub">
                {[subject.code, subject.instructor].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </div>
        <div className="subject-card-actions">
          <button
            type="button"
            className="icon-btn"
            aria-label={`Edit subject: ${subject.name}`}
            onClick={() => onEdit(subject)}
          >
            <Pencil size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-btn icon-btn--danger"
            aria-label={`Delete subject: ${subject.name}`}
            onClick={() => onDelete(subject)}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="subject-card-meta">
        {subject.semester && <Badge variant="soft">{subject.semester}</Badge>}
        <Badge variant="outline">
          {subject.creditHours != null
            ? `${Number(subject.creditHours) % 1 === 0 ? Number(subject.creditHours) : subject.creditHours} credit${Number(subject.creditHours) === 1 ? '' : 's'}`
            : 'Credits'}
        </Badge>
        {assignmentCount > 0 && (
          <Badge variant="neutral">
            {assignmentCount} assignment{assignmentCount === 1 ? '' : 's'}
          </Badge>
        )}
      </div>

      {tracking && (
        <Progress
          label="Attendance"
          value={tracking.attendedClasses}
          max={Math.max(1, tracking.totalClasses)}
          size="sm"
          className="subject-attendance-progress"
        />
      )}

      <div className="subject-card-foot">
        {tracking ? (
          <>
            <span className="subject-attendance-note">
              {tracking.attendedClasses} of {tracking.totalClasses} classes
            </span>
            <div className="subject-record">
              <Button variant="success" size="sm" leftIcon={Check} onClick={() => onRecordAttendance(tracking, true)}>
                Present
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onRecordAttendance(tracking, false)}>
                Absent
              </Button>
            </div>
          </>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onStartAttendance(subject)}>
            Track attendance
          </Button>
        )}
      </div>
    </li>
  );
}