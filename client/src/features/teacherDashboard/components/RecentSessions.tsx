import { Clock } from 'lucide-react';

interface Session {
  name: string;
  date: string;
  students: number;
  status: string;
}

interface RecentSessionsProps {
  sessions: Session[];
}

export const RecentSessions = ({ sessions }: RecentSessionsProps) => (
  <div className="bg-bg-secondary rounded-2xl border border-border-subtle overflow-hidden">
    <div className="p-6 border-b border-border-subtle flex items-center justify-between">
      <h2 className="text-lg font-bold text-text-primary">Recent Sessions</h2>
      <button className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors">View All</button>
    </div>
    <div className="divide-y divide-border-subtle">
      {sessions.map((session) => (
        <div key={session.name} className="p-6 flex items-center justify-between hover:bg-bg-primary/50 transition-colors">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full ${session.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-text-secondary/10 text-text-secondary'}`}>
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-text-primary font-bold">{session.name}</h4>
              <p className="text-text-secondary text-sm">{session.date} • {session.students} Students</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            session.status === 'Active' ? 'bg-green-500 text-white' : 
            session.status === 'Completed' ? 'bg-bg-primary text-text-secondary' : 'bg-btn-bg text-btn-text'
          }`}>
            {session.status}
          </span>
        </div>
      ))}
    </div>
  </div>
);
