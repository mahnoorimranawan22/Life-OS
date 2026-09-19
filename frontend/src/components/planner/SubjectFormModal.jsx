import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import Button from '../ui/Button.jsx';
import { DEFAULT_SUBJECT_COLOR, PLANNER_COLORS } from '../../utils/planner.js';
import { cn } from '../../utils/cn.js';

export default function SubjectFormModal({ open, initial, onClose, onSubmit }) {
  const editing = Boolean(initial);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [instructor, setInstructor] = useState('');
  const [creditHours, setCreditHours] = useState('3');
  const [semester, setSemester] = useState('');
  const [color, setColor] = useState(DEFAULT_SUBJECT_COLOR);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setName(initial?.name || '');
    setCode(initial?.code || '');
    setInstructor(initial?.instructor || '');
    setCreditHours(initial?.creditHours != null ? String(initial.creditHours) : '3');
    setSemester(initial?.semester || '');
    setColor(initial?.color || DEFAULT_SUBJECT_COLOR);
    setErrors({});
    setSubmitting(false);
    return undefined;
  }, [open, initial]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'Please enter a subject name.';
    const credits = Number(creditHours);
    if (Number.isNaN(credits) || credits < 0 || credits > 30) {
      nextErrors.creditHours = 'Credit hours must be between 0 and 30.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        code: code.trim() || null,
        instructor: instructor.trim() || null,
        creditHours: credits,
        semester: semester.trim() || null,
        color,
      });
      onClose();
    } catch (error) {
      setErrors({ form: error?.response?.data?.error || 'Unable to save this subject.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit subject' : 'Add subject'}
      icon={BookOpen}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="subject-form" loading={submitting}>
            {editing ? 'Save changes' : 'Add subject'}
          </Button>
        </>
      }
    >
      <form id="subject-form" className="planner-form" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p className="auth-alert" role="alert">
            {errors.form}
          </p>
        )}

        <Input
          label="Name"
          name="name"
          placeholder="e.g. Discrete Mathematics"
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
        />

        <div className="field-row">
          <Input
            label="Code"
            name="code"
            optional
            placeholder="e.g. MATH301"
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <Input
            label="Credit hours"
            name="creditHours"
            type="number"
            min="0"
            max="30"
            step="0.5"
            value={creditHours}
            onChange={(event) => setCreditHours(event.target.value)}
            error={errors.creditHours}
          />
        </div>

        <Input
          label="Instructor"
          name="instructor"
          optional
          placeholder="Who teaches it?"
          value={instructor}
          onChange={(event) => setInstructor(event.target.value)}
        />

        <Input
          label="Semester"
          name="semester"
          optional
          placeholder="e.g. Fall 2026"
          value={semester}
          onChange={(event) => setSemester(event.target.value)}
          maxLength={60}
        />

        <fieldset className="planner-fieldset">
          <legend>Color</legend>
          <div className="planner-swatches">
            {PLANNER_COLORS.map((swatch) => (
              <button
                key={swatch}
                type="button"
                className={cn('planner-swatch', color === swatch && 'planner-swatch--active')}
                style={{ ['--swatch' ]: swatch }}
                aria-label={`Use color ${swatch}`}
                aria-pressed={color === swatch}
                onClick={() => setColor(swatch)}
              />
            ))}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}