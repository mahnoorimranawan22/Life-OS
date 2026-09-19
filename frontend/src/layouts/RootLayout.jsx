import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import BottomNav from './BottomNav.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { findSection } from './navigation.js';

export default function RootLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const section = findSection(pathname);

  return (
    <div className="shell">
      <Sidebar user={user} />

      <div className="shell-main">
        <Topbar title={section} user={user} />
        <main className="shell-content">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}