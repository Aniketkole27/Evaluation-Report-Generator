import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../shared/components/Sidebar';
import ThemeToggle from '../landing/components/ThemeToggle';
import { Bell, Search, LayoutDashboard, Users, LineChart, Video, Settings } from 'lucide-react';
import { ROUTES } from '../../app/routes/paths';
import { useMemo } from 'react';

const TeacherLayout = () => {
  // Read logged-in user from localStorage
  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        const name: string = parsed.name ?? 'Prof. Anderson';
        const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
        return { name, initials, role: 'Senior Educator' };
      }
    } catch { }
    return { name: 'Prof. Anderson', initials: 'PA', role: 'Senior Educator' };
  }, []);
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.APP.TEACHER.DASHBOARD },
    { label: 'Students', icon: Users, path: ROUTES.APP.TEACHER.STUDENTS },
    { label: 'Progress', icon: LineChart, path: ROUTES.APP.TEACHER.PROGRESS },
    { label: 'Sessions', icon: Video, path: ROUTES.APP.TEACHER.SESSIONS },
    { label: 'Settings', icon: Settings, path: ROUTES.APP.TEACHER.SETTINGS },
  ];

  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('auth_user');
    navigate(ROUTES.PUBLIC.LOGIN);
  };

  return (
    <div className="flex min-h-screen bg-bg-primary transition-colors duration-300">
      <Sidebar
        portalName="Teacher Portal"
        navItems={navItems}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input
                type="text"
                placeholder="Search students, reports, sessions..."
                className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-subtle rounded-xl focus:outline-none focus:ring-2 focus:ring-text-primary/10 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4 ml-4">
            <ThemeToggle />
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-border-subtle rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-primary"></span>
            </button>
            <div className="h-8 w-px bg-border-subtle mx-2" />
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-text-primary leading-tight">{user.name}</p>
                <p className="text-xs text-text-secondary uppercase tracking-tighter">{user.role}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-btn-bg text-btn-text flex items-center justify-center font-bold text-sm border-2 border-border-subtle group-hover:border-text-primary transition-all">
                {user.initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;
