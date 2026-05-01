import type { RouteObject } from 'react-router-dom';
import AppLayout from '../../layouts/AppLayout';
import ProtectedRoute from '../../features/auth/components/ProtectedRoute';
import { ROUTES } from './paths';

import DashboardHome from '../../features/teacherDashboard/pages/DashboardHome';
import StudentList from '../../features/teacherDashboard/pages/StudentList';
import SessionManager from '../../features/teacherDashboard/pages/SessionManager';
import ProgressPage from '../../features/teacherDashboard/pages/ProgressPage';
import TeacherLayout from '../../features/teacherDashboard/TeacherLayout';

// Placeholder components for demonstration
const AdminPanel = () => <div className="p-8"><h1 className="text-2xl font-bold text-red-600">Admin Control Panel</h1></div>;
const StudentDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold text-blue-600">Student Learning Dashboard</h1></div>;

export const appRoutes: RouteObject = {
  element: <ProtectedRoute />, // All routes under this will require authentication
  children: [
    {
      element: <AppLayout />,
      children: [
        {
          path: ROUTES.APP.TEACHER.ROOT,
          element: <TeacherLayout />,
          children: [
            { index: true, element: <DashboardHome /> },
            { path: ROUTES.APP.TEACHER.DASHBOARD, element: <DashboardHome /> },
            { path: ROUTES.APP.TEACHER.STUDENTS, element: <StudentList /> },
            { path: ROUTES.APP.TEACHER.SESSIONS, element: <SessionManager /> },
            { path: ROUTES.APP.TEACHER.PROGRESS, element: <ProgressPage /> },
            { path: ROUTES.APP.TEACHER.SETTINGS, element: <div className="p-8 animate-in fade-in"><h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Teacher Settings</h1><p className="text-text-secondary mt-1">Manage your account and notification preferences.</p></div> },
          ]
        },
        // Role-based routes example
        {
          path: '/admin',
          element: <ProtectedRoute allowedRoles={['ADMIN']} />,
          children: [
            { path: '', element: <AdminPanel /> }
          ]
        },
        {
          path: '/student',
          element: <ProtectedRoute allowedRoles={['STUDENT']} />,
          children: [
            { path: '', element: <StudentDashboard /> }
          ]
        },
        // Feature routes
        {
          path: ROUTES.APP.REPORTS,
          element: <div className="p-8">Reports Feature (Coming Soon)</div>,
        },
      ],
    },
  ],
};
