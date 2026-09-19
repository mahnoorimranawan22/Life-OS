import { useEffect, useState } from 'react';
import { CalendarRange, CalendarDays } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

function toDateInputValue(iso) {
  return iso ? String(iso).slice(0, 10) : '';
}

export default function ExamFormModal({ open, initial, subjects, onClose, onSubmit }) {
  const editing = Boolean(initial);

  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setSubject(initial?.subject || subjects[0]?.id || '');
    setTitle(initial?.title || '');
    setExamDate(toDateInputValue(initial?.examDate));
    setLocation(initial?.location || '');
    setNotes(initial?.notes || '');
    setErrors({});
    setSubmitting(false);
    return undefined;
  }, [open, initial, subjects]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Please enter an exam title.';
    if (!subject) nextErrors.subject = 'Choose a subject.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        subject,
        title: title.trim(),
        examDate: examDate || null,
        location: location.trim() || null,
        notes: notes.trim() || null,
      });
      onClose();
    } catch (error) {
      setErrors({ form: error?.response?.data?.error || 'Unable to save this exam.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit exam' : 'Add exam'}
      icon={CalendarRange}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="exam-form" loading={submitting}>
            {editing ? 'Save changes' : 'Add exam'}
          </Button>
        </>
      }
    >
      <form id="exam-form" className="planner-form" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p className="auth-alert" role="alert">
            {errors.form}
          </p>
        )}

        <Select label="Subject" name="subject" value={subject} onChange={(event) => setSubject(event.target.value)} error={errors.subject}>
          <option value="">Choose a subject…</option>
          {subjects.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>

        <Input
          label="Title"
          name="title"
          placeholder="e.g. Midterm, Final, Quiz 2…"
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />

        <div className="field-row">
          <Input
            label="Exam date"
            type="date"
            name="examDate"
            optional
            icon={CalendarDays}
            value={examDate}
            onChange={(event) => setExamDate(event.target.value)}
          />
          <Input
            label="Location"
            name="location"
            optional
            placeholder="e.g. Hall B-204"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>

        <Textarea
          label="Notes"
          name="notes"
          optional
          rows={3}
          placeholder="Format, materials, room details…"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </form>
    </Modal>
  );
}