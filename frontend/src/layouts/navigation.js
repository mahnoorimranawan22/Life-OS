import {
  LayoutDashboard,
  CheckSquare2,
  GraduationCap,
  FolderKanban,
  Briefcase,
  NotebookPen,
  SwatchBook,
} from 'lucide-react';

export const brand = {
  name: 'LifeOS',
  tagline: 'Your personal operating system.',
};

// Sidebar navigation — `to` items are live routes; `soon` items are upcoming modules.
export const navigation = [
  { id: 'home', label: 'Home', icon: LayoutDashboard, to: '/home' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare2, to: '/tasks' },
  { id: 'planner', label: 'Planner', icon: GraduationCap, to: '/planner' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, soon: true },
  { id: 'internships', label: 'Internships', icon: Briefcase, soon: true },
  { id: 'notes', label: 'Notes', icon: NotebookPen, soon: true },
  { id: 'uikit', label: 'UI Kit', icon: SwatchBook, to: '/ui' },
];

// Compact set for the mobile bottom navigation.
export const bottomNavigation = [
  { id: 'home', label: 'Home', icon: LayoutDashboard, to: '/home' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare2, to: '/tasks' },
  { id: 'planner', label: 'Planner', icon: GraduationCap, to: '/planner' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, soon: true },
  { id: 'uikit', label: 'UI Kit', icon: SwatchBook, to: '/ui' },
];

export function findSection(pathname) {
  return navigation.find((item) => item.to && item.to === pathname)?.label || brand.name;
}