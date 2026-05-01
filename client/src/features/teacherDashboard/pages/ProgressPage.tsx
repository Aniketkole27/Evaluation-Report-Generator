import { useState, useEffect } from 'react';
import { Users, BookOpen, Award, ChevronDown, Clock, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import rawStudents from '../../../utils/data.json';

// ── Types ──────────────────────────────────────────────────────────────────
interface Participant {
  name: string;
  rollNumber: string;
  answeredCount: number;
  status: 'in-progress' | 'submitted';
}

interface EvalSession {
  id: string;
  name: string;
  questions: any[];
  participants: Participant[];
  duration: number;
  startedAt: string;
  status: 'active' | 'ended';
}

// ── Helpers ────────────────────────────────────────────────────────────────
const barColor = (pct: number) =>
  pct >= 85 ? 'bg-green-500' : pct >= 70 ? 'bg-blue-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';

const gradeColor = (grade: string) => {
  if (grade === 'A+') return 'bg-green-500/15 text-green-500 border border-green-500/30';
  if (grade === 'A')  return 'bg-blue-500/15 text-blue-500 border border-blue-500/30';
  if (grade === 'B+') return 'bg-indigo-500/15 text-indigo-500 border border-indigo-500/30';
  if (grade === 'B')  return 'bg-yellow-500/15 text-yellow-600 border border-yellow-500/30';
  return 'bg-red-500/15 text-red-500 border border-red-500/30';
};

// ── Component ──────────────────────────────────────────────────────────────
const ProgressPage = () => {
  const [sessions, setSessions] = useState<EvalSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem('eval_sessions');
      if (raw) {
        const parsed: EvalSession[] = JSON.parse(raw);
        setSessions(parsed);
        setActiveSessionId(prev => prev ?? (parsed[0]?.id ?? null));
      }
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? null;
  const participants = activeSession?.participants ?? [];
  const totalQ = activeSession?.questions?.length ?? 0;
  const submittedCount = participants.filter(p => p.status === 'submitted').length;
  const avgAnswered = participants.length
    ? Math.round(participants.reduce((sum, p) => sum + p.answeredCount, 0) / participants.length)
    : 0;

  const getStudentInfo = (rollNumber: string) =>
    rawStudents.find(s => s.rollNumber === rollNumber) ?? null;

  // ── Empty State ────────────────────────────────────────────────────────
  if (sessions.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div>
          <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Progress Analytics</h1>
          <p className="text-text-secondary mt-1">Individual student progress tracked per evaluation session.</p>
        </div>
        <div className="py-32 flex flex-col items-center justify-center text-center bg-bg-secondary/30 rounded-[40px] border-2 border-dashed border-border-strong">
          <div className="p-5 bg-bg-primary rounded-full text-text-secondary/20 mb-6">
            <BookOpen size={48} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">No Sessions Yet</h3>
          <p className="text-text-secondary max-w-sm">
            Publish a test from the <span className="font-bold text-btn-bg">Sessions</span> tab to start tracking student progress here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Progress Analytics</h1>
        <p className="text-text-secondary mt-1">Real-time student progress per evaluation session.</p>
      </div>

      {/* Session Tabs */}
      <div className="flex flex-wrap gap-2">
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => { setActiveSessionId(session.id); setExpandedParticipant(null); }}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border flex items-center gap-2 ${
              activeSessionId === session.id
                ? 'bg-btn-bg text-btn-text border-btn-bg shadow-lg shadow-btn-bg/20'
                : 'bg-bg-secondary text-text-secondary border-border-subtle hover:border-border-strong hover:text-text-primary'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${session.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            {session.name}
            <span className="text-[10px] font-black opacity-60 ml-1">#{session.id}</span>
          </button>
        ))}
      </div>

      {activeSession && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Questions', value: totalQ, icon: <BookOpen size={18} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: 'Participants', value: participants.length, icon: <Users size={18} />, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Submitted', value: submittedCount, icon: <CheckCircle size={18} />, color: 'text-green-500', bg: 'bg-green-500/10' },
              { label: 'Avg. Answered', value: `${avgAnswered}/${totalQ}`, icon: <Award size={18} />, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            ].map(({ label, value, icon, color, bg }) => (
              <div key={label} className="bg-bg-secondary rounded-2xl border border-border-subtle p-4 flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${bg} ${color} flex-shrink-0`}>{icon}</div>
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">{label}</p>
                  <p className="text-xl font-black text-text-primary">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Session Meta */}
          <div className="flex items-center gap-4 text-xs text-text-secondary font-medium">
            <span className="flex items-center gap-1.5"><Clock size={12} /> Started: {activeSession.startedAt}</span>
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeSession.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              {activeSession.status === 'active' ? 'Live' : 'Ended'}
            </span>
            <span>{activeSession.duration} min duration</span>
          </div>

          {/* Participants Table */}
          <div className="bg-bg-secondary rounded-2xl border border-border-subtle overflow-hidden">
            <div className="grid grid-cols-12 px-6 py-3 border-b border-border-subtle bg-bg-primary/40 text-[10px] font-black text-text-secondary uppercase tracking-widest">
              <div className="col-span-3">Student</div>
              <div className="col-span-3">Progress</div>
              <div className="col-span-2 text-center">Answered</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-right">Details</div>
            </div>

            <div className="divide-y divide-border-subtle">
              {participants.length === 0 ? (
                <div className="py-16 flex flex-col items-center text-center text-text-secondary">
                  <Loader size={28} className="mb-3 animate-spin opacity-40" />
                  <p className="font-bold">Waiting for students to join...</p>
                  <p className="text-xs mt-1">Share the session link with your students.</p>
                </div>
              ) : (
                participants.map((participant) => {
                  const progress = totalQ > 0 ? Math.round((participant.answeredCount / totalQ) * 100) : 0;
                  const isExpanded = expandedParticipant === participant.rollNumber;
                  const extraInfo = getStudentInfo(participant.rollNumber);
                  const initials = participant.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                  return (
                    <div key={participant.rollNumber}>
                      <div className="grid grid-cols-12 items-center px-6 py-4 hover:bg-bg-primary/30 transition-colors">
                        <div className="col-span-3 flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-xl bg-btn-bg/10 text-btn-bg flex items-center justify-center font-black text-sm border border-btn-bg/20 flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-text-primary truncate">{participant.name}</p>
                            <p className="text-[10px] text-text-secondary">{participant.rollNumber}</p>
                          </div>
                        </div>

                        <div className="col-span-3 pr-4">
                          <div className="w-full h-2 bg-bg-primary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${participant.status === 'submitted' ? 'bg-green-500' : barColor(progress)}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-text-secondary mt-1 block">{progress}% complete</span>
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="text-sm font-black text-text-primary">
                            {participant.answeredCount}
                            <span className="text-text-secondary font-normal">/{totalQ}</span>
                          </span>
                        </div>

                        <div className="col-span-2 flex justify-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            participant.status === 'submitted'
                              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                              : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          }`}>
                            {participant.status === 'submitted'
                              ? <><CheckCircle size={10} /> Submitted</>
                              : <><Loader size={10} className="animate-spin" /> In Progress</>
                            }
                          </span>
                        </div>

                        <div className="col-span-2 flex justify-end">
                          {extraInfo ? (
                            <button
                              onClick={() => setExpandedParticipant(isExpanded ? null : participant.rollNumber)}
                              className={`p-1.5 rounded-lg transition-all text-text-secondary hover:text-text-primary hover:bg-border-subtle ${isExpanded ? 'rotate-180' : ''}`}
                            >
                              <ChevronDown size={16} />
                            </button>
                          ) : (
                            <span className="text-[10px] text-text-secondary italic px-2">—</span>
                          )}
                        </div>
                      </div>

                      {/* Expanded academic info from data.json */}
                      {isExpanded && extraInfo && (
                        <div className="px-6 pb-5 pt-2 bg-bg-primary/20 border-t border-border-subtle animate-in slide-in-from-top-2 duration-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-2">
                            <div className="space-y-3">
                              <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest flex items-center gap-1.5">
                                <BookOpen size={10} /> Academic Records
                              </p>
                              {Object.entries(extraInfo.subjects).map(([subject, marks]) => (
                                <div key={subject}>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-xs font-bold text-text-primary">{subject}</span>
                                    <span className="text-xs font-black text-text-secondary">{marks}/100</span>
                                  </div>
                                  <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${barColor(marks)}`} style={{ width: `${marks}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3 content-start">
                              {[
                                { label: 'Overall %', value: `${extraInfo.percentage}%` },
                                { label: 'Grade', value: extraInfo.grade },
                                { label: 'Attendance', value: `${extraInfo.attendance}%` },
                                { label: 'Class', value: `${extraInfo.class}${extraInfo.section}` },
                                { label: 'Total Marks', value: extraInfo.totalMarks },
                                { label: 'Division', value: extraInfo.division },
                              ].map(({ label, value }) => (
                                <div key={label} className="bg-bg-secondary rounded-xl p-3 border border-border-subtle">
                                  <p className="text-[9px] font-bold text-text-secondary uppercase tracking-wider mb-0.5">{label}</p>
                                  <p className={`text-sm font-black ${label === 'Grade' ? gradeColor(String(value)).split(' ')[1] : 'text-text-primary'}`}>
                                    {value}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-6 py-3 bg-bg-primary/20 border-t border-border-subtle flex items-center justify-between">
              <p className="text-xs text-text-secondary font-medium">
                {participants.length} participants · {submittedCount} submitted
              </p>
              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                <AlertCircle size={11} /> Live · updates every 2s
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressPage;
