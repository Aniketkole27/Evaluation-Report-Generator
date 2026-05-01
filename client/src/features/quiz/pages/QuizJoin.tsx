import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Hash, ArrowRight, ClipboardCheck, AlertCircle } from 'lucide-react';

const QuizJoin = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', rollNumber: '' });
  const [error, setError] = useState<string | null>(null);
  const [sessionName, setSessionName] = useState<string | null>(null);

  useEffect(() => {
    const sessions = JSON.parse(localStorage.getItem('eval_sessions') || '[]');
    const session = sessions.find((s: any) => s.id === quizId);
    
    if (!session) {
      setError('Invalid or expired Session ID. Please check the link and try again.');
    } else if (session.status === 'ended') {
      setError('This assessment session has already ended.');
    } else {
      setSessionName(session.name);
    }
  }, [quizId]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.rollNumber) return;
    if (error) return;
    
    // Add student to participants in localStorage
    const sessions = JSON.parse(localStorage.getItem('eval_sessions') || '[]');
    const sessionIndex = sessions.findIndex((s: any) => s.id === quizId);
    
    if (sessionIndex !== -1) {
      const studentId = formData.rollNumber + '_' + Date.now();
      const newParticipant = {
        id: studentId,
        name: formData.name,
        rollNumber: formData.rollNumber,
        status: 'active',
        answeredCount: 0,
        lastUpdated: Date.now()
      };

      // Check if student already joined (by roll number)
      const existingIdx = sessions[sessionIndex].participants.findIndex((p: any) => p.rollNumber === formData.rollNumber);
      if (existingIdx !== -1) {
        sessions[sessionIndex].participants[existingIdx].status = 'active'; // Re-joining
      } else {
        sessions[sessionIndex].participants.push(newParticipant);
      }

      localStorage.setItem('eval_sessions', JSON.stringify(sessions));
      sessionStorage.setItem('studentInfo', JSON.stringify({ ...formData, id: studentId }));
      navigate(`/quiz/${quizId}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 transition-colors duration-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-btn-bg/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-md relative animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-bg-secondary border border-border-strong rounded-[32px] p-8 shadow-2xl shadow-btn-bg/5">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-btn-bg/10 text-btn-bg rounded-2xl mb-4">
              <ClipboardCheck size={32} />
            </div>
            <h1 className="text-2xl font-black text-text-primary tracking-tight">Join Evaluation</h1>
            <p className="text-text-secondary mt-2">
              {sessionName ? `Session: ${sessionName}` : 'Enter your details to start the assessment'}
            </p>
          </div>

          {error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center space-y-4">
              <AlertCircle size={40} className="text-red-500 mx-auto" />
              <p className="text-sm font-bold text-red-500 leading-relaxed">{error}</p>
              <button onClick={() => navigate('/')} className="w-full py-3 bg-bg-primary border border-border-strong rounded-xl text-xs font-bold text-text-primary hover:bg-bg-secondary transition-all">Return to Home</button>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-btn-bg transition-colors" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-bg-primary border border-border-strong rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-btn-bg/20 focus:border-btn-bg transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-widest ml-1">Roll Number</label>
                <div className="relative group">
                  <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-btn-bg transition-colors" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. 2024CS01"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-bg-primary border border-border-strong rounded-2xl text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-btn-bg/20 focus:border-btn-bg transition-all"
                  />
                </div>
              </div>

              <div className="p-4 bg-bg-primary/50 border border-border-subtle rounded-2xl mb-2">
                <div className="flex items-center space-x-3 text-xs text-text-secondary">
                  <div className="h-2 w-2 rounded-full bg-btn-bg animate-pulse" />
                  <span>Session ID: <span className="text-text-primary font-bold uppercase">{quizId}</span></span>
                </div>
              </div>

              <button type="submit" className="w-full bg-btn-bg text-btn-text py-4 rounded-2xl font-bold text-lg hover:bg-btn-hover transition-all shadow-lg shadow-btn-bg/20 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center group">
                Enter Room
                <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizJoin;
