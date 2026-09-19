import { useEffect, useState } from 'react';
import { ClipboardList, CalendarDays } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import {
  ASSIGNMENT_PRIORITIES,
  ASSIGNMENT_PRIORITY_LABELS,
  ASSIGNMENT_STATUSES,
  ASSIGNMENT_STATUS_LABELS,
} from '../../utils/planner.js';

function toDateInputValue(iso) {
  return iso ? String(iso).slice(0, 10) : '';
}

export default function AssignmentFormModal({ open, initial, subjects, onClose, onSubmit }) {
  const editing = Boolean(initial);

  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setSubject(initial?.subject || subjects[0]?.id || '');
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setDueDate(toDateInputValue(initial?.dueDate));
    setPriority(initial?.priority || 'medium');
    setStatus(initial?.status || 'todo');
    setErrors({});
    setSubmitting(false);
    return undefined;
  }, [open, initial, subjects]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Please enter an assignment title.';
    if (!subject) nextErrors.subject = 'Choose a subject.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        subject,
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate || null,
        priority,
        status,
      });
      onClose();
    } catch (error) {
      setErrors({ form: error?.response?.data?.error || 'Unable to save this assignment.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit assignment' : 'Add assignment'}
      icon={ClipboardList}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="assignment-form" loading={submitting}>
            {editing ? 'Save changes' : 'Add assignment'}
          </Button>
        </>
      }
    >
      <form id="assignment-form" className="planner-form" onSubmit={handleSubmit} noValidate>
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
          placeholder="What needs to be submitted?"
          autoFocus
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
        />

        <Textarea
          label="Description"
          name="description"
          optional
          rows={3}
          placeholder="Requirements, hints, expectations…"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <div className="field-row">
          <Input
            label="Due date"
            type="date"
            name="dueDate"
            optional
            icon={CalendarDays}
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
          <Select label="Priority" name="priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
            {ASSIGNMENT_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {ASSIGNMENT_PRIORITY_LABELS[value]}
              </option>
            ))}
          </Select>
        </div>

        <Select label="Status" name="status" value={status} onChange={(event) => setStatus(event.target.value)}>
          {ASSIGNMENT_STATUSES.map((value) => (
            <option key={value} value={value}>
              {ASSIGNMENT_STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
      </form>
    </Modal>
  );
}