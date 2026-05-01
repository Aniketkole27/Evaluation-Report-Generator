import { Video, Copy, Check, Power, Activity, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';

interface SessionCardProps {
  id: string;
  name: string;
  startedAt: string;
  endedAt?: string;
  studentCount: number;
  url: string;
  status: 'active' | 'ended';
  onEnd?: (id: string) => void;
  onMonitor?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const SessionCard = ({ id, name, startedAt, endedAt, studentCount, url, status, onEnd, onMonitor, onDelete }: SessionCardProps) => {
  const [copied, setCopied] = useState(false);
  const isActive = status === 'active';

  const copyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`p-6 rounded-2xl border-2 relative overflow-hidden group shadow-lg transition-all hover:scale-[1.02] ${isActive ? 'bg-bg-secondary border-green-500/30 shadow-green-500/5 hover:shadow-green-500/10' : 'bg-bg-secondary/40 border-border-subtle opacity-90'}`}>
      {isActive ? (
        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-extrabold px-4 py-1 rounded-bl-xl uppercase tracking-widest animate-pulse">
          Live Now
        </div>
      ) : (
        <div className="absolute top-0 right-0 bg-text-secondary text-white text-[10px] font-extrabold px-4 py-1 rounded-bl-xl uppercase tracking-widest">
          Ended
        </div>
      )}

      <div className={`p-3 rounded-xl w-fit mb-4 ${isActive ? 'bg-green-500/10 text-green-500' : 'bg-text-secondary/10 text-text-secondary'}`}>
        {isActive ? <Video size={24} /> : <Calendar size={24} />}
      </div>

      <h3 className={`text-lg font-bold truncate pr-16 ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{name}</h3>
      <p className="text-sm text-text-secondary mt-1">
        {isActive ? startedAt : `Ended ${endedAt}`} • {studentCount} Students
      </p>
      
      {isActive ? (
        <div className="mt-6 p-3 bg-bg-primary/50 border border-border-subtle rounded-xl flex items-center justify-between">
          <code className="text-xs text-text-primary font-medium truncate mr-2">{url.replace(/^https?:\/\//, '')}</code>
          <button onClick={copyUrl} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
          </button>
        </div>
      ) : (
        <div className="mt-6 p-4 bg-bg-primary/20 rounded-xl border border-border-subtle border-dashed">
          <p className="text-xs font-bold text-text-secondary text-center italic">Session Link Inactive</p>
        </div>
      )}
      
      <div className="mt-6 flex gap-3">
        {isActive ? (
          <>
            <button 
              onClick={() => onEnd?.(id)}
              className="flex-1 flex items-center justify-center py-2.5 bg-red-500/10 text-red-500 text-sm font-bold rounded-lg hover:bg-red-500/20 transition-all group/end"
            >
              <Power size={14} className="mr-2 group-hover/end:scale-110 transition-transform" />
              End Session
            </button>
            <button 
              onClick={() => onMonitor?.(id)}
              className="flex-1 flex items-center justify-center py-2.5 bg-btn-bg text-btn-text text-sm font-bold rounded-lg hover:bg-btn-hover transition-all group/mon"
            >
              <Activity size={14} className="mr-2 group-hover/mon:scale-110 transition-transform" />
              Monitor
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => onMonitor?.(id)}
              className="flex-1 flex items-center justify-center py-2.5 bg-bg-primary text-text-primary text-sm font-bold rounded-lg hover:bg-bg-secondary border border-border-subtle transition-all"
            >
              View Report
            </button>
            <button 
              onClick={() => onDelete?.(id)}
              className="px-3 flex items-center justify-center bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
              title="Delete from history"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
