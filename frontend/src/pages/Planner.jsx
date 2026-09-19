import { useMemo, useState } from 'react';
import {
  BookOpen,
  Calculator,
  CalendarRange,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Plus,
  Search,
  SearchX,
  Trash2,
} from 'lucide-react';
import { usePlanner } from '../hooks/usePlanner.js';
import SubjectCard from '../components/planner/SubjectCard.jsx';
import AssignmentRow from '../components/planner/AssignmentRow.jsx';
import ExamRow from '../components/planner/ExamRow.jsx';
import SubjectFormModal from '../components/planner/SubjectFormModal.jsx';
import AssignmentFormModal from '../components/planner/AssignmentFormModal.jsx';
import ExamFormModal from '../components/planner/ExamFormModal.jsx';
import GpaModal from '../components/planner/GpaModal.jsx';
import Button from '../components/ui/Button.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Modal from '../components/ui/Modal.jsx';
import Badge from '../components/ui/Badge.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { parseDueDate } from '../utils/tasks.js';
import {
  ASSIGNMENT_STATUSES,
  ASSIGNMENT_STATUS_LABELS,
  assignmentProgress,
  computeGpa,
  pointsForGrade,
  semestersFor,
  upcomingDeadlines,
} from '../utils/planner.js';
import { cn } from '../utils/cn.js';

const TABS = [
  { id: 'overview', label: 'Overview', icon: GraduationCap },
  { id: 'subjects', label: 'Subjects', icon: BookOpen },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'exams', label: 'Exams', icon: CalendarRange },
];

const assignmentSortOptions = [
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
  { value: 'createdAt', label: 'Created' },
];

const examSortOptions = [
  { value: 'examDate', label: 'Exam date' },
  { value: 'title', label: 'Title' },
  { value: 'createdAt', label: 'Created' },
];

function whenForAssignment(assignment) {
  const due = parseDueDate(assignment.dueDate);
  return due ? due.getTime() : Infinity;
}

function compareAssignments(sortBy) {
  if (sortBy === 'priority') {
    const rank = { high: 0, medium: 1, low: 2 };
    return (a, b) =>
      (rank[a.priority] ?? 1) - (rank[b.priority] ?? 1) || whenForAssignment(a) - whenForAssignment(b);
  }
  if (sortBy === 'title') {
    return (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase());
  }
  if (sortBy === 'createdAt') {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
  return (a, b) => whenForAssignment(a) - whenForAssignment(b) || String(a.title).localeCompare(String(b.title));
}

function compareExams(sortBy) {
  if (sortBy === 'title') {
    return (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase());
  }
  if (sortBy === 'createdAt') {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
  return (a, b) => {
    const aTime = a.examDate ? new Date(a.examDate).getTime() : Infinity;
    const bTime = b.examDate ? new Date(b.examDate).getTime() : Infinity;
    return aTime - bTime;
  };
}

export default function Planner() {
  const {
    subjects,
    assignments,
    exams,
    attendance,
    status,
    error,
    refresh,
    addSubject,
    updateSubject,
    removeSubject,
    addAssignment,
    updateAssignment,
    removeAssignment,
    addExam,
    updateExam,
    removeExam,
    addAttendance,
    recordAttendance,
    subjectById,
  } = usePlanner();

  const [tab, setTab] = useState('overview');
  const [subjectSemester, setSubjectSemester] = useState('all');

  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [assignmentSubject, setAssignmentSubject] = useState('all');
  const [assignmentStatus, setAssignmentStatus] = useState('all');
  const [assignmentSort, setAssignmentSort] = useState('dueDate');

  const [examSubject, setExamSubject] = useState('all');
  const [examSort, setExamSort] = useState('examDate');

  const [subjectForm, setSubjectForm] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState(null);
  const [examForm, setExamForm] = useState(null);
  const [gpaOpen, setGpaOpen] = useState(false);
  const [gpaGrades, setGpaGrades] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null); // { kind, item }
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState(null);

  const semesters = useMemo(() => semestersFor(subjects), [subjects]);

  const filteredSubjects = useMemo(() => {
    if (subjectSemester === 'all') return subjects;
    return subjects.filter((subject) => (subject.semester || 'No semester') === subjectSemester);
  }, [subjects, subjectSemester]);

  const filteredAssignments = useMemo(() => {
    const query = assignmentSearch.trim().toLowerCase();
    const list = assignments.filter((assignment) => {
      if (query) {
        const haystack = [assignment.title, assignment.description].filter(Boolean).join(' ');
        if (!haystack.toLowerCase().includes(query)) return false;
      }
      if (assignmentSubject !== 'all' && assignment.subject !== assignmentSubject) return false;
      if (assignmentStatus !== 'all' && assignment.status !== assignmentStatus) return false;
      return true;
    });
    return [...list].sort(compareAssignments(assignmentSort));
  }, [assignments, assignmentSearch, assignmentSubject, assignmentStatus, assignmentSort]);

  const filteredExams = useMemo(() => {
    const list = examSubject === 'all' ? exams : exams.filter((exam) => exam.subject === examSubject);
    return [...list].sort(compareExams(examSort));
  }, [exams, examSubject, examSort]);

  const openAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.status !== 'completed'),
    [assignments]
  );
  const completedAssignments = assignments.length - openAssignments.length;

  const gradeEntries = useMemo(
    () => ({
      entries: subjects
        .filter((subject) => gpaGrades[subject.id])
        .map((subject) => ({
          subject,
          credits: Number(subject.creditHours) || 0,
          grade: gpaGrades[subject.id],
          points: pointsForGrade(gpaGrades[subject.id]),
        })),
      result: computeGpa(
        subjects
          .filter((subject) => gpaGrades[subject.id])
          .map((subject) => ({
            credits: Number(subject.creditHours) || 0,
            points: pointsForGrade(gpaGrades[subject.id]),
          }))
      ),
    }),
    [subjects, gpaGrades]
  );

  const deadlines = useMemo(
    () => upcomingDeadlines(assignments, exams, subjectById, 5),
    [assignments, exams, subjectById]
  );

  const semesterSummaries = useMemo(
    () =>
      semesters.map((semester) => {
        const inSemester = subjects.filter((s) => (s.semester || 'No semester') === semester);
        const ids = new Set(inSemester.map((s) => s.id));
        const credits = inSemester.reduce((sum, s) => sum + (Number(s.creditHours) || 0), 0);
        const progress = assignmentProgress(assignments.filter((a) => ids.has(a.subject)));
        return { semester, count: inSemester.length, credits, progress };
      }),
    [semesters, subjects, assignments]
  );

  const openTab = (id) => setTab(id);

  const handleAssignmentToggle = (assignment) => {
    updateAssignment(assignment.id, {
      status: assignment.status === 'completed' ? 'todo' : 'completed',
    });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (confirmDelete.kind === 'subject') await removeSubject(confirmDelete.item.id);
      if (confirmDelete.kind === 'assignment') await removeAssignment(confirmDelete.item.id);
      if (confirmDelete.kind === 'exam') await removeExam(confirmDelete.item.id);
      setConfirmDelete(null);
    } catch (deleteError) {
      setNotice(deleteError?.response?.data?.error || 'Unable to delete that item.');
    } finally {
      setDeleting(false);
    }
  };

  const runAction = async (action, fallback) => {
    try {
      await action();
    } catch (actionError) {
      setNotice(actionError?.response?.data?.error || fallback);
    }
  };

  const clearAssignmentFilters = () => {
    setAssignmentSearch('');
    setAssignmentSubject('all');
    setAssignmentStatus('all');
  };

  const loadingSkeleton = (
    <div className="planner-skeletons">
      {[0, 1, 2].map((index) => (
        <div className="card planner-skeleton" key={index}>
          <Skeleton width={`${64 - index * 10}%`} height={16} />
          <Skeleton width="40%" height={12} />
          <Skeleton width="55%" height={12} />
        </div>
      ))}
    </div>
  );

  return (
    <div className="planner-page">
      <header className="planner-head">
        <div className="planner-head-titles">
          <span className="eyebrow">University</span>
          <h1>University Planner</h1>
          <p className="planner-head-sub">Subjects, deadlines and attendance in one calm place.</p>
        </div>
        {status === 'ready' && (
          <div className="planner-actions">
            {tab === 'overview' && (
              <Button leftIcon={BookOpen} onClick={() => setSubjectForm({ mode: 'add' })}>
                Add subject
              </Button>
            )}
            {tab === 'subjects' && (
              <Button leftIcon={Plus} onClick={() => setSubjectForm({ mode: 'add' })}>
                Add subject
              </Button>
            )}
            {tab === 'assignments' && (
              <Button leftIcon={Plus} onClick={() => setAssignmentForm({ mode: 'add' })}>
                Add assignment
              </Button>
            )}
            {tab === 'exams' && (
              <Button leftIcon={Plus} onClick={() => setExamForm({ mode: 'add' })}>
                Add exam
              </Button>
            )}
          </div>
        )}
      </header>

      <div className="planner-tabs" role="tablist" aria-label="Planner sections">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={cn('planner-tab', tab === id && 'planner-tab--active')}
            onClick={() => openTab(id)}
          >
            <Icon size={16} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {notice && (
        <div className="planner-notice" role="alert">
          <span>{notice}</span>
          <button type="button" className="planner-notice-close" aria-label="Dismiss" onClick={() => setNotice(null)}>
            ×
          </button>
        </div>
      )}

      {status === 'loading' && loadingSkeleton}
      {status === 'error' && <ErrorState message={error} onRetry={refresh} />}

      {status === 'ready' && (
        <>
          {tab === 'overview' && (
            <div className="planner-overview">
              {subjects.length === 0 ? (
                <EmptyState
                  icon={GraduationCap}
                  title="Start your study plan."
                  description="Add your first subject and the planner will build an overview from it."
                  action={
                    <Button leftIcon={Plus} onClick={() => setSubjectForm({ mode: 'add' })}>
                      Add your first subject
                    </Button>
                  }
                />
              ) : (
                <>
                  <section className="planner-section" aria-labelledby="overview-semesters">
                    <h2 id="overview-semesters" className="planner-section-title">
                      Semesters
                    </h2>
                    <ul className="semester-grid">
                      {semesterSummaries.map((summary) => (
                        <li key={summary.semester}>
                          <button
                            type="button"
                            className="semester-card"
                            onClick={() => {
                              setSubjectSemester(summary.semester);
                              openTab('subjects');
                            }}
                          >
                            <div className="semester-card-top">
                              <Badge variant="soft">{summary.semester}</Badge>
                              <ChevronRight size={16} aria-hidden="true" />
                            </div>
                            <div className="semester-card-num">
                              {summary.count} subject{summary.count === 1 ? '' : 's'}
                            </div>
                            <div className="semester-card-sub">
                              {summary.credits} credit{summary.credits === 1 ? '' : 's'}
                              {summary.progress && ` · ${summary.progress.completed}/${summary.progress.total} assignments done`}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <div className="planner-overview-grid">
                    <section className="planner-section" aria-labelledby="overview-deadlines">
                      <h2 id="overview-deadlines" className="planner-section-title">
                        Next up
                      </h2>
                      {deadlines.rows.length === 0 ? (
                        <EmptyState
                          icon={CalendarRange}
                          title="Nothing due right now."
                          description="Assignments and exams with dates will show up here."
                          action={
                            <div className="planner-empty-actions">
                              {subjects.length > 0 && (
                                <Button variant="outline" leftIcon={Plus} onClick={() => setAssignmentForm({ mode: 'add' })}>
                                  Add assignment
                                </Button>
                              )}
                              {subjects.length > 0 && (
                                <Button variant="ghost" leftIcon={Plus} onClick={() => setExamForm({ mode: 'add' })}>
                                  Add exam
                                </Button>
                              )}
                            </div>
                          }
                        />
                      ) : (
                        <ul className="deadline-list">
                          {deadlines.rows.map((row) => (
                            <li className="deadline-row" key={`${row.kind}-${row.id}`}>
                              <Badge variant={row.kind === 'exam' ? 'accent' : 'neutral'}>
                                {row.kind === 'exam' ? 'Exam' : 'Assignment'}
                              </Badge>
                              <div className="deadline-main">
                                <div className="deadline-title">{row.title}</div>
                                {row.subjectName && <div className="deadline-subject">{row.subjectName}</div>}
                              </div>
                              <span className="deadline-when">{row.dueText}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>

                    <section className="planner-section" aria-labelledby="overview-gpa">
                      <h2 id="overview-gpa" className="planner-section-title">
                        GPA
                      </h2>
                      <div className="gpa-panel">
                        {gradeEntries.entries.length > 0 ? (
                          <>
                            <div className="gpa-panel-value">{gradeEntries.result.gpa.toFixed(2)}</div>
                            <p className="gpa-panel-meta">
                              {gradeEntries.entries.length} of {subjects.length} subjects graded
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="gpa-panel-value gpa-panel-value--muted">–</div>
                            <p className="gpa-panel-meta">Grade your subjects to see an estimate.</p>
                          </>
                        )}
                        <Button variant="outline" leftIcon={Calculator} onClick={() => setGpaOpen(true)}>
                          {gradeEntries.entries.length > 0 ? 'Adjust grades' : 'Calculate GPA'}
                        </Button>
                      </div>
                    </section>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === 'subjects' && (
            <div className="planner-subjects">
              <div className="planner-toolbar">
                <Select
                  name="semester-filter"
                  aria-label="Filter subjects by semester"
                  value={subjectSemester}
                  onChange={(event) => setSubjectSemester(event.target.value)}
                  className="planner-filter"
                >
                  <option value="all">All semesters</option>
                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </Select>
                <span className="planner-count" role="status">
                  {filteredSubjects.length} of {subjects.length} subject{filteredSubjects.length === 1 ? '' : 's'}
                </span>
              </div>

              {subjects.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="No subjects yet."
                  description="Add a subject to start tracking assignments, exams and attendance."
                  action={
                    <Button leftIcon={Plus} onClick={() => setSubjectForm({ mode: 'add' })}>
                      Add your first subject
                    </Button>
                  }
                />
              ) : filteredSubjects.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title="No subjects in this semester"
                  description="Switch the filter or add a subject to this semester."
                  action={
                    <Button variant="ghost" onClick={() => setSubjectSemester('all')}>
                      Show all subjects
                    </Button>
                  }
                />
              ) : (
                <ul className="subject-grid">
                  {filteredSubjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={subject}
                      assignments={assignments.filter((a) => a.subject === subject.id)}
                      attendance={attendance.find((record) => record.subject === subject.id)}
                      onEdit={(item) => setSubjectForm({ mode: 'edit', item })}
                      onDelete={(item) => setConfirmDelete({ kind: 'subject', item })}
                      onStartAttendance={(item) => runAction(() => addAttendance(item.id), 'Unable to start tracking.')}
                      onRecordAttendance={(record, present) =>
                        runAction(() => recordAttendance(record.id, present), 'Unable to record that class.')
                      }
                    />
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'assignments' && (
            <div className="planner-assignments">
              <div className="planner-toolbar planner-toolbar--wrap">
                <Input
                  type="search"
                  name="assignment-search"
                  icon={Search}
                  placeholder="Search assignments…"
                  aria-label="Search assignments"
                  value={assignmentSearch}
                  onChange={(event) => setAssignmentSearch(event.target.value)}
                  wrapperClassName="planner-search"
                />
                <Select
                  name="assignment-subject-filter"
                  aria-label="Filter assignments by subject"
                  value={assignmentSubject}
                  onChange={(event) => setAssignmentSubject(event.target.value)}
                  className="planner-filter"
                >
                  <option value="all">All subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </Select>
                <Select
                  name="assignment-status-filter"
                  aria-label="Filter assignments by status"
                  value={assignmentStatus}
                  onChange={(event) => setAssignmentStatus(event.target.value)}
                  className="planner-filter"
                >
                  <option value="all">All statuses</option>
                  {ASSIGNMENT_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {ASSIGNMENT_STATUS_LABELS[value]}
                    </option>
                  ))}
                </Select>
                <Select
                  name="assignment-sort"
                  aria-label="Sort assignments"
                  value={assignmentSort}
                  onChange={(event) => setAssignmentSort(event.target.value)}
                  className="planner-filter"
                >
                  {assignmentSortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort: {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              {status === 'ready' && assignments.length > 0 && (
                <div className="tasks-summary" aria-label="Assignment summary">
                  <span>
                    <b>{openAssignments.length}</b> open
                  </span>
                  <span>
                    <b>{completedAssignments}</b> completed
                  </span>
                </div>
              )}

              {subjects.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="Add a subject first."
                  description="Assignments belong to a subject, so add one before creating assignments."
                  action={
                    <Button leftIcon={Plus} onClick={() => setSubjectForm({ mode: 'add' })}>
                      Add subject
                    </Button>
                  }
                />
              ) : assignments.length === 0 ? (
                <EmptyState
                  icon={ClipboardList}
                  title="No assignments yet."
                  description="Track homework, projects and labs with due dates and priorities."
                  action={
                    <Button leftIcon={Plus} onClick={() => setAssignmentForm({ mode: 'add' })}>
                      Add your first assignment
                    </Button>
                  }
                />
              ) : filteredAssignments.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title="No assignments match"
                  description="Try adjusting your search or filters."
                  action={
                    <Button variant="ghost" onClick={clearAssignmentFilters}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <>
                  <ul className="assignment-list">
                    {filteredAssignments.map((assignment) => (
                      <AssignmentRow
                        key={assignment.id}
                        assignment={assignment}
                        subject={subjectById.get(assignment.subject)}
                        onToggle={handleAssignmentToggle}
                        onEdit={(item) => setAssignmentForm({ mode: 'edit', item })}
                        onDelete={(item) => setConfirmDelete({ kind: 'assignment', item })}
                      />
                    ))}
                  </ul>
                  <p className="tasks-count" role="status">
                    {filteredAssignments.length} of {assignments.length} assignment{filteredAssignments.length === 1 ? '' : 's'}
                  </p>
                </>
              )}
            </div>
          )}

          {tab === 'exams' && (
            <div className="planner-exams">
              <div className="planner-toolbar">
                <Select
                  name="exam-subject-filter"
                  aria-label="Filter exams by subject"
                  value={examSubject}
                  onChange={(event) => setExamSubject(event.target.value)}
                  className="planner-filter"
                >
                  <option value="all">All subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </Select>
                <Select
                  name="exam-sort"
                  aria-label="Sort exams"
                  value={examSort}
                  onChange={(event) => setExamSort(event.target.value)}
                  className="planner-filter"
                >
                  {examSortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      Sort: {option.label}
                    </option>
                  ))}
                </Select>
                <span className="planner-count" role="status">
                  {filteredExams.length} exam{filteredExams.length === 1 ? '' : 's'}
                </span>
              </div>

              {subjects.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="Add a subject first."
                  description="Exams belong to a subject, so add one before scheduling exams."
                  action={
                    <Button leftIcon={Plus} onClick={() => setSubjectForm({ mode: 'add' })}>
                      Add subject
                    </Button>
                  }
                />
              ) : exams.length === 0 ? (
                <EmptyState
                  icon={CalendarRange}
                  title="No exams scheduled."
                  description="Add midterms, finals and quizzes so nothing catches you off guard."
                  action={
                    <Button leftIcon={Plus} onClick={() => setExamForm({ mode: 'add' })}>
                      Add your first exam
                    </Button>
                  }
                />
              ) : filteredExams.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title="No exams for this subject."
                  description="Switch the filter to see other exams."
                  action={
                    <Button variant="ghost" onClick={() => setExamSubject('all')}>
                      Show all exams
                    </Button>
                  }
                />
              ) : (
                <ul className="exam-list">
                  {filteredExams.map((exam) => (
                    <ExamRow
                      key={exam.id}
                      exam={exam}
                      subject={subjectById.get(exam.subject)}
                      onEdit={(item) => setExamForm({ mode: 'edit', item })}
                      onDelete={(item) => setConfirmDelete({ kind: 'exam', item })}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}

      <SubjectFormModal
        open={subjectForm !== null}
        initial={(subjectForm?.mode === 'edit' && subjectForm.item) || null}
        onClose={() => setSubjectForm(null)}
        onSubmit={(data) =>
          subjectForm.mode === 'edit'
            ? updateSubject(subjectForm.item.id, data)
            : addSubject(data)
        }
      />

      <AssignmentFormModal
        open={assignmentForm !== null}
        initial={(assignmentForm?.mode === 'edit' && assignmentForm.item) || null}
        subjects={subjects}
        onClose={() => setAssignmentForm(null)}
        onSubmit={(data) =>
          assignmentForm.mode === 'edit'
            ? updateAssignment(assignmentForm.item.id, data)
            : addAssignment(data)
        }
      />

      <ExamFormModal
        open={examForm !== null}
        initial={(examForm?.mode === 'edit' && examForm.item) || null}
        subjects={subjects}
        onClose={() => setExamForm(null)}
        onSubmit={(data) =>
          examForm.mode === 'edit'
            ? updateExam(examForm.item.id, data)
            : addExam(data)
        }
      />

      <GpaModal
        open={gpaOpen}
        subjects={subjects}
        value={gpaGrades}
        onDone={(grades) => setGpaGrades(grades)}
        onClose={() => setGpaOpen(false)}
      />

      <Modal
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        title={`Delete ${confirmDelete?.kind || 'item'}`}
        icon={Trash2}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={handleDelete}>
              Delete {confirmDelete?.kind || 'item'}
            </Button>
          </>
        }
      >
        <p className="confirm-copy">
          Delete “{confirmDelete?.item?.title || confirmDelete?.item?.name}”? This can’t be undone.
          {confirmDelete?.kind === 'subject' &&
            ' Its assignments, exams and attendance will be removed too.'}
        </p>
      </Modal>
    </div>
  );
}