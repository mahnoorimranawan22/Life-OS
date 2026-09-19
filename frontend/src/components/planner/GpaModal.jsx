import { useEffect, useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { computeGpa, GRADE_POINTS, pointsForGrade } from '../../utils/planner.js';

const GRADE_OPTIONS = [
  { value: 'A', label: 'A · 4.0' },
  { value: 'A−', label: 'A− · 3.7' },
  { value: 'B+', label: 'B+ · 3.3' },
  { value: 'B', label: 'B · 3.0' },
  { value: 'B−', label: 'B− · 2.7' },
  { value: 'C+', label: 'C+ · 2.3' },
  { value: 'C', label: 'C · 2.0' },
  { value: 'C−', label: 'C− · 1.7' },
  { value: 'D+', label: 'D+ · 1.3' },
  { value: 'D', label: 'D · 1.0' },
  { value: 'F', label: 'F · 0.0' },
];

export default function GpaModal({ open, subjects, value, onDone, onClose }) {
  const [grades, setGrades] = useState({});

  useEffect(() => {
    if (open) setGrades(value);
  }, [open, value]);

  const entries = useMemo(
    () =>
      subjects
        .filter((subject) => grades[subject.id])
        .map((subject) => ({
          subject,
          credits: Number(subject.creditHours) || 0,
          grade: grades[subject.id],
          points: pointsForGrade(grades[subject.id]),
        })),
    [subjects, grades]
  );

  const result = useMemo(() => computeGpa(entries), [entries]);
  const gradedCount = entries.length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="GPA calculator"
      icon={Calculator}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => {
              setGrades({});
              onDone({});
            }}
            disabled={gradedCount === 0}
          >
            Clear all
          </Button>
          <Button type="submit" form="gpa-form">
            Done
          </Button>
        </>
      }
    >
      {subjects.length === 0 ? (
        <p className="confirm-copy">Add subjects first — the calculator works from their credit hours.</p>
      ) : (
        <>
          <form
            id="gpa-form"
            onSubmit={(event) => {
              event.preventDefault();
              onDone(grades);
              onClose();
            }}
          >
            <div className="gpa-list">
              {subjects.map((subject) => (
                <div className="gpa-row" key={subject.id}>
                  <div className="gpa-subject">
                    <div className="gpa-subject-name">{subject.name}</div>
                    <div className="gpa-subject-credits">
                      {Number(subject.creditHours) || 0} credit{Number(subject.creditHours) === 1 ? '' : 's'}
                      {subject.code ? ` · ${subject.code}` : ''}
                    </div>
                  </div>
                  <Select
                    name={`grade-${subject.id}`}
                    aria-label={`Grade for ${subject.name}`}
                    value={grades[subject.id] || ''}
                    onChange={(event) =>
                      setGrades((prev) => ({ ...prev, [subject.id]: event.target.value }))
                    }
                    className="gpa-select"
                  >
                    <option value="">Not graded yet</option>
                    {GRADE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>

            <div className="gpa-result">
              <div>
                <span className="gpa-result-label">Estimated GPA</span>
                <span className="gpa-result-value">{result.gpa.toFixed(2)}</span>
              </div>
              <div className="gpa-result-meta">
                <Badge variant="soft">
                  {gradedCount} of {subjects.length} graded
                </Badge>
                <span className="gpa-result-detail">
                  {result.credits} credits · {result.points.toFixed(1)} points
                </span>
              </div>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}