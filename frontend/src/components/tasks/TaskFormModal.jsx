import { useEffect, useState } from 'react';
import { CalendarDays, FolderOpen, ListTodo } from 'lucide-react';
import Modal from '../ui/Modal.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '../../utils/tasks.js';

function toDateInputValue(iso) {
  return iso ? String(iso).slice(0, 10) : '';
}

export default function TaskFormModal({ open, initial, onClose, onSubmit }) {
  const editing = Boolean(initial);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setCategory(initial?.category || '');
    setPriority(initial?.priority || 'medium');
    setStatus(initial?.status || 'todo');
    setDueDate(toDateInputValue(initial?.dueDate));
    setErrors({});
    setSubmitting(false);
    return undefined;
  }, [open, initial]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Please enter a task title.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        category: category.trim() || null,
        priority,
        status,
        dueDate: dueDate || null,
      });
      onClose();
    } catch (error) {
      setErrors({ form: error?.response?.data?.error || 'Unable to save this task.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit task' : 'Add task'}
      icon={ListTodo}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" form="task-form" loading={submitting}>
            {editing ? 'Save changes' : 'Add task'}
          </Button>
        </>
      }
    >
      <form id="task-form" className="task-form" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <p className="auth-alert" role="alert">
            {errors.form}
          </p>
        )}

        <Input
          label="Title"
          name="title"
          placeholder="What needs to be done?"
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
          placeholder="Add a little context…"
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
          <Input
            label="Category"
            name="category"
            optional
            placeholder="e.g. University"
            icon={FolderOpen}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />
        </div>

        <div className="field-row">
          <Select label="Status" name="status" value={status} onChange={(event) => setStatus(event.target.value)}>
            {TASK_STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
          <Select label="Priority" name="priority" value={priority} onChange={(event) => setPriority(event.target.value)}>
            {TASK_PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {PRIORITY_LABELS[value]}
              </option>
            ))}
          </Select>
        </div>
      </form>
    </Modal>
  );
}