import { Users, Video, FileText, TrendingUp } from 'lucide-react';
import { DashboardStats } from '../components/DashboardStats';
import { RecentSessions } from '../components/RecentSessions';
import { TaskChecklist } from '../components/TaskChecklist';
import rawStudents from '../../../utils/data.json';
import { useMemo } from 'react';

const DashboardHome = () => {
  const displayName = useMemo(() => {
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw) return JSON.parse(raw).name ?? 'Prof. Anderson';
    } catch {}
    return 'Prof. Anderson';
  }, []);
  // ── Compute stats from data.json ──────────────────────────────────────
  const totalStudents = rawStudents.length;

  const avgScore = Math.round(
    rawStudents.reduce((sum, s) => sum + s.percentage, 0) / totalStudents
  );

  const avgAttendance = Math.round(
    rawStudents.reduce((sum, s) => sum + s.attendance, 0) / totalStudents
  );

  const topPerformers = rawStudents.filter(
    (s) => s.grade === 'A+' || s.grade === 'A'
  ).length;

  // ── Static / session-based data ───────────────────────────────────────
  const stats = [
    {
      label: 'Total Students',
      value: String(totalStudents),
      change: `${totalStudents} enrolled`,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Avg. Score',
      value: `${avgScore}%`,
      change: avgScore >= 75 ? '+Good' : 'Needs Work',
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Avg. Attendance',
      value: `${avgAttendance}%`,
      change: avgAttendance >= 85 ? '+On Track' : 'Low',
      icon: Video,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Top Performers',
      value: String(topPerformers),
      change: `Grade A / A+`,
      icon: FileText,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
  ];

  // ── Build recent sessions from student class groups ───────────────────
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  const classGroups = rawStudents.reduce<Record<string, typeof rawStudents>>((acc, s) => {
    const key = `Class ${s.class} — ${s.division}`;
    acc[key] = acc[key] ? [...acc[key], s] : [s];
    return acc;
  }, {});

  const sessions = Object.entries(classGroups).map(([name, group], idx) => ({
    name,
    date: today,
    students: group.length,
    status: idx === 0 ? 'Active' : idx === 1 ? 'Completed' : 'Upcoming',
  }));

  const tasks = [
    { id: '1', task: 'Review Physics reports', time: 'Today', done: false },
    { id: '2', task: 'Create Math Quiz questions', time: 'Tomorrow', done: true },
    { id: '3', task: 'Setup Chemistry Session', time: 'Oct 20', done: false },
    { id: '4', task: 'Grade student submissions', time: 'Oct 21', done: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Teacher Dashboard</h1>
          <p className="text-text-secondary mt-1">Welcome back, {displayName}. Here's what's happening today.</p>
        </div>
        <button className="bg-btn-bg text-btn-text px-6 py-3 rounded-xl font-bold hover:bg-btn-hover transition-all shadow-lg shadow-btn-bg/10 flex items-center justify-center">
          <Video className="mr-2" size={20} />
          Start New Session
        </button>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentSessions sessions={sessions} />
        </div>
        <TaskChecklist initialTasks={tasks} />
      </div>
    </div>
  );
};

export default DashboardHome;
