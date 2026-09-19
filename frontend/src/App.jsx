import { Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';
import Landing from './pages/landing/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Planner from './pages/Planner.jsx';
import UIKit from './pages/UIKit.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import RequireAuth from './components/auth/RequireAuth.jsx';

export default function App() {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route element={<RequireAuth />}>
        <Route element={<RootLayout />}>
          <Route path="home" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="planner" element={<Planner />} />
          <Route path="ui" element={<UIKit />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}