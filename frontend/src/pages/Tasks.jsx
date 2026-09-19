import { useMemo, useState } from 'react';
import { Plus, Search, SearchX, Trash2, ListTodo } from 'lucide-react';
import { useTasks } from '../hooks/useTasks.js';
import TaskRow from '../components/tasks/TaskRow.jsx';
import TaskFormModal from '../components/tasks/TaskFormModal.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Modal from '../components/ui/Modal.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import {
  comparatorFor,
  isDueToday,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from '../utils/tasks.js';

const sortOptions = [
  { value: 'dueDate', label: 'Due date' },
  { value: 'title', label: 'Title' },
  { value: 'priority', label: 'Priority' },
  { value: 'createdAt', label: 'Created' },
];

export default function Tasks() {
  const { tasks, status, error, refresh, addTask, updateTask, removeTask } = useTasks();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [form, setForm] = useState(null); // { mode: 'add'|'edit', task? }
  const [confirmTask, setConfirmTask] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openTasks = useMemo(
    () => tasks.filter((task) => task.status !== 'completed'),
    [tasks]
  );
  const dueToday = useMemo(() => openTasks.filter(isDueToday), [openTasks]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = tasks.filter((task) => {
      if (query) {
        const haystack = [task.title, task.description, task.category].filter(Boolean).join(' ');
        if (!haystack.toLowerCase().includes(query)) return false;
      }
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
      return true;
    });
    return [...list].sort(comparatorFor(sortBy));
  }, [tasks, search, statusFilter, priorityFilter, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const handleToggle = (task) => {
    updateTask(task.id, {
      status: task.status === 'completed' ? 'todo' : 'completed',
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await removeTask(confirmTask.id);
      setConfirmTask(null);
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSubmit = (data) => {
    if (form.mode === 'edit') return updateTask(form.task.id, data);
    return addTask(data);
  };

  return (
    <div className="tasks-page">
      <header className="tasks-head">
        <div className="tasks-head-titles">
          <span className="eyebrow">Workspace</span>
          <h1>Tasks</h1>
          <p className="tasks-head-sub">Keep today small and the week clear.</p>
        </div>
        <Button leftIcon={Plus} onClick={() => setForm({ mode: 'add' })}>
          Add task
        </Button>
      </header>

      {status === 'ready' && tasks.length > 0 && (
        <div className="tasks-summary" aria-label="Task summary">
          <span>
            <b>{openTasks.length}</b> open
          </span>
          <span>
            <b>{dueToday.length}</b> due today
          </span>
          <span>
            <b>{tasks.length - openTasks.length}</b> completed
          </span>
        </div>
      )}

      <div className="tasks-toolbar">
        <Input
          type="search"
          name="search"
          icon={Search}
          placeholder="Search tasks…"
          aria-label="Search tasks"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          wrapperClassName="tasks-search"
        />
        <Select
          name="status-filter"
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="tasks-filter"
        >
          <option value="all">All statuses</option>
          {TASK_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </Select>
        <Select
          name="priority-filter"
          aria-label="Filter by priority"
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
          className="tasks-filter"
        >
          <option value="all">All priorities</option>
          {TASK_PRIORITIES.map((value) => (
            <option key={value} value={value}>
              {PRIORITY_LABELS[value]}
            </option>
          ))}
        </Select>
        <Select
          name="sort"
          aria-label="Sort tasks"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="tasks-filter"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Sort: {option.label}
            </option>
          ))}
        </Select>
      </div>

      {status === 'loading' && (
        <div className="task-list-skeletons" aria-hidden="true">
          {[0, 1, 2].map((index) => (
            <div className="task-skeleton card" key={index}>
              <Skeleton width={22} height={22} style={{ borderRadius: '50%' }} />
              <div className="task-skeleton-body">
                <Skeleton width={`${62 - index * 8}%`} height={14} />
                <Skeleton width="38%" height={12} />
              </div>
            </div>
          ))}
        </div>
      )}

      {status === 'error' && <ErrorState message={error} onRetry={refresh} />}

      {status === 'ready' && tasks.length === 0 && (
        <div className="tasks-empty">
          <EmptyState
            icon={ListTodo}
            title="Your workspace is ready."
            description="Add your first task and it will appear here."
            action={
              <Button leftIcon={Plus} onClick={() => setForm({ mode: 'add' })}>
                Add your first task
              </Button>
            }
          />
        </div>
      )}

      {status === 'ready' && tasks.length > 0 && filtered.length === 0 && (
        <EmptyState
          icon={SearchX}
          title="No tasks match"
          description="Try adjusting your search or filters."
          action={
            <Button variant="ghost" onClick={clearFilters}>
              Clear filters
            </Button>
          }
        />
      )}

      {status === 'ready' && filtered.length > 0 && (
        <>
          <ul className="task-list">
            {filtered.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={(task) => setForm({ mode: 'edit', task })}
                onDelete={setConfirmTask}
              />
            ))}
          </ul>
          <p className="tasks-count" role="status">
            {filtered.length} of {tasks.length} task{filtered.length === 1 ? '' : 's'}
          </p>
        </>
      )}

      <TaskFormModal
        open={form !== null}
        initial={(form?.mode === 'edit' && form.task) || null}
        onClose={() => setForm(null)}
        onSubmit={handleFormSubmit}
      />

      <Modal
        open={confirmTask !== null}
        onClose={() => setConfirmTask(null)}
        title="Delete task"
        icon={Trash2}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmTask(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete task
            </Button>
          </>
        }
      >
        <p className="confirm-copy">
          Delete “{confirmTask?.title}”? This can’t be undone.
        </p>
      </Modal>
    </div>
  );
}