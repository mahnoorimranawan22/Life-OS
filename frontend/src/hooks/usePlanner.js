import { useCallback, useEffect, useState } from 'react';
import { plannerApi } from '../services/planner.js';

export function usePlanner() {
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const [subjectList, assignmentList, examList, attendanceList] = await Promise.all([
        plannerApi.subjects.list(),
        plannerApi.assignments.list(),
        plannerApi.exams.list(),
        plannerApi.attendance.list(),
      ]);
      setSubjects(subjectList);
      setAssignments(assignmentList);
      setExams(examList);
      setAttendance(attendanceList);
      setStatus('ready');
    } catch (loadError) {
      setError(loadError?.response?.data?.error || 'Unable to load your planner data.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // ---- subjects ----
  const addSubject = useCallback(async (data) => {
    const subject = await plannerApi.subjects.create(data);
    setSubjects((prev) => [...prev, subject]);
    return subject;
  }, []);

  const updateSubject = useCallback(async (id, data) => {
    const subject = await plannerApi.subjects.update(id, data);
    setSubjects((prev) => prev.map((item) => (item.id === id ? subject : item)));
    return subject;
  }, []);

  const removeSubject = useCallback(async (id) => {
    await plannerApi.subjects.remove(id); // backend cascades its planner items
    setSubjects((prev) => prev.filter((item) => item.id !== id));
    setAssignments((prev) => prev.filter((item) => item.subject !== id));
    setExams((prev) => prev.filter((item) => item.subject !== id));
    setAttendance((prev) => prev.filter((item) => item.subject !== id));
  }, []);

  // ---- assignments ----
  const addAssignment = useCallback(async (data) => {
    const assignment = await plannerApi.assignments.create(data);
    setAssignments((prev) => [...prev, assignment]);
    return assignment;
  }, []);

  const updateAssignment = useCallback(async (id, data) => {
    const assignment = await plannerApi.assignments.update(id, data);
    setAssignments((prev) => prev.map((item) => (item.id === id ? assignment : item)));
    return assignment;
  }, []);

  const removeAssignment = useCallback(async (id) => {
    await plannerApi.assignments.remove(id);
    setAssignments((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ---- exams ----
  const addExam = useCallback(async (data) => {
    const exam = await plannerApi.exams.create(data);
    setExams((prev) => [...prev, exam]);
    return exam;
  }, []);

  const updateExam = useCallback(async (id, data) => {
    const exam = await plannerApi.exams.update(id, data);
    setExams((prev) => prev.map((item) => (item.id === id ? exam : item)));
    return exam;
  }, []);

  const removeExam = useCallback(async (id) => {
    await plannerApi.exams.remove(id);
    setExams((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // ---- attendance ----
  const addAttendance = useCallback(async (subjectId) => {
    const record = await plannerApi.attendance.create({ subject: subjectId });
    setAttendance((prev) => {
      const existing = prev.some((item) => item.subject === subjectId);
      return existing
        ? prev.map((item) => (item.subject === subjectId ? record : item))
        : [...prev, record];
    });
    return record;
  }, []);

  const recordAttendance = useCallback(async (id, present) => {
    const record = await plannerApi.attendance.record(id, present);
    setAttendance((prev) => prev.map((item) => (item.id === id ? record : item)));
    return record;
  }, []);

  // ---- helpers ----
  const subjectById = useCallback(() => {
    const map = new Map();
    subjects.forEach((subject) => map.set(subject.id, subject));
    return map;
  }, [subjects]);

  return {
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
    subjectById: subjectById(),
  };
}