import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Send, HelpCircle, CheckCircle, User, Award, Clock } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  type: 'MCQ' | 'Subjective';
  options?: string[];
}

const QuizInterface = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState<{ name: string; rollNumber: string; id: string } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sessionName, setSessionName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const info = sessionStorage.getItem('studentInfo');
    if (!info) {
      navigate(`/quiz/${quizId}/join`);
      return;
    }
    const parsedInfo = JSON.parse(info);
    setStudentInfo(parsedInfo);

    // Load quiz data
    const sessions = JSON.parse(localStorage.getItem('eval_sessions') || '[]');
    const session = sessions.find((s: any) => s.id === quizId);

    if (session) {
      if (session.status === 'ended') {
        alert('This session has ended.');
        navigate('/');
        return;
      }
      setQuestions(session.questions);
      setSessionName(session.name);

      // Initialize Timer (Mocking start time as "now" for simplicity in local demo)
      // In a real app, you'd calculate time left based on session start time
      const sessionDurationSeconds = (session.duration || 60) * 60;
      setTimeLeft(sessionDurationSeconds);
    } else {
      navigate(`/quiz/${quizId}/join`);
    }
    setIsLoading(false);
  }, [quizId, navigate]);

  // Timer Effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, isSubmitted]);

  // Update progress in localStorage
  useEffect(() => {
    if (studentInfo && questions.length > 0) {
      const sessions = JSON.parse(localStorage.getItem('eval_sessions') || '[]');
      const sIdx = sessions.findIndex((s: any) => s.id === quizId);
      if (sIdx !== -1) {
        const pIdx = sessions[sIdx].participants.findIndex((p: any) => p.rollNumber === studentInfo.rollNumber);
        if (pIdx !== -1) {
          sessions[sIdx].participants[pIdx].answeredCount = Object.keys(answers).length;
          sessions[sIdx].participants[pIdx].lastUpdated = Date.now();
          if (isSubmitted) sessions[sIdx].participants[pIdx].status = 'submitted';
          localStorage.setItem('eval_sessions', JSON.stringify(sessions));
        }
      }
    }
  }, [answers, isSubmitted, studentInfo, quizId, questions.length]);

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: answer });
  };

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    sessionStorage.removeItem('studentInfo');
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit your assessment?')) {
      handleAutoSubmit();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-btn-bg/20 border-t-btn-bg rounded-full animate-spin" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center animate-in zoom-in-95 duration-500">
          <div className="bg-bg-secondary border border-border-strong rounded-[40px] p-12 shadow-2xl">
            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Well Done!</h1>
            <p className="text-text-secondary mt-4 mb-8">Your responses for <span className="text-text-primary font-bold">"{sessionName}"</span> have been submitted successfully.</p>
            <div className="p-6 bg-bg-primary rounded-3xl border border-border-subtle text-left space-y-3 mb-8">
              <div className="flex justify-between text-sm"><span className="text-text-secondary font-bold">Student Name</span><span className="text-text-primary font-bold">{studentInfo?.name}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary font-bold">Roll Number</span><span className="text-text-primary font-bold">{studentInfo?.rollNumber}</span></div>
              <div className="flex justify-between text-sm"><span className="text-text-secondary font-bold">Status</span><span className="text-green-500 font-bold">Submitted</span></div>
            </div>
            <button onClick={() => navigate('/')} className="w-full py-4 bg-btn-bg text-btn-text rounded-2xl font-bold hover:bg-btn-hover transition-all">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  if (!studentInfo || questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const attemptedCount = Object.keys(answers).length;
  const remainingCount = questions.length - attemptedCount;

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-80 bg-bg-secondary border-b md:border-b-0 md:border-r border-border-strong flex flex-col p-6 md:sticky md:top-0 md:h-screen">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-btn-bg rounded-xl flex items-center justify-center text-btn-text"><Award size={24} /></div>
          <div className="min-w-0">
            <h2 className="text-sm font-black text-text-primary uppercase tracking-wider truncate">{sessionName}</h2>
            <p className="text-[10px] font-bold text-text-secondary">ID: {quizId}</p>
          </div>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
          <div className="p-4 bg-bg-primary rounded-2xl border border-border-subtle shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-btn-bg/10 text-btn-bg rounded-lg"><User size={16} /></div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-text-secondary uppercase">Active Student</p>
                <p className="text-sm font-bold text-text-primary truncate">{studentInfo.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-subtle">
              <div className="text-center">
                <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Attempted</p>
                <p className="text-xl font-black text-btn-bg">{attemptedCount}</p>
              </div>
              <div className="text-center border-l border-border-subtle">
                <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Remaining</p>
                <p className="text-xl font-black text-text-secondary/50">{remainingCount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Question Navigator</h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`aspect-square rounded-xl text-xs font-bold transition-all border ${i === currentIndex
                    ? 'bg-btn-bg border-btn-bg text-btn-text shadow-lg shadow-btn-bg/20 scale-105 z-10'
                    : answers[q.id]
                      ? 'bg-btn-bg/10 border-btn-bg text-btn-bg'
                      : 'bg-bg-primary border-border-subtle text-text-secondary hover:border-btn-bg/50'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} className="mt-8 w-full bg-btn-bg text-btn-text py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-btn-hover transition-all shadow-xl shadow-btn-bg/10">
          <Send size={18} />
          <span>Submit Assessment</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 md:p-12 max-w-5xl mx-auto w-full">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-bg-secondary border border-border-strong rounded-2xl text-text-secondary"><HelpCircle size={24} /></div>
            <div>
              <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em]">Question {currentIndex + 1} of {questions.length}</p>
              <h1 className="text-lg font-bold text-text-primary">Evaluation in Progress</h1>
            </div>
          </div>
          <div className={`flex items-center space-x-3 px-6 py-3 border-2 rounded-2xl transition-all duration-500 ${timeLeft < 60 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-bg-secondary border-border-strong text-text-primary'}`}>
            <Clock size={20} className={timeLeft < 60 ? 'animate-spin-slow' : 'text-btn-bg'} />
            <span className="text-xl font-black tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
          </div>
        </header>

        <div className="flex-1">
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary leading-tight mb-12">{currentQuestion.text}</h2>
            {currentQuestion.type === 'MCQ' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options?.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    className={`group relative p-6 rounded-3xl border-2 text-left transition-all duration-300 ${answers[currentQuestion.id] === option
                      ? 'bg-btn-bg border-btn-bg text-btn-text shadow-2xl shadow-btn-bg/20 translate-y-[-4px]'
                      : 'bg-bg-secondary border-border-subtle hover:border-btn-bg/30 text-text-primary hover:bg-bg-primary'
                      }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${answers[currentQuestion.id] === option ? 'bg-white/20 text-white' : 'bg-bg-primary text-text-secondary group-hover:text-btn-bg'
                        }`}>{String.fromCharCode(65 + i)}</span>
                      <p className="font-bold text-lg">{option}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Type your detailed response here..."
                  className="w-full min-h-[300px] bg-bg-secondary border-2 border-border-subtle rounded-[40px] p-8 text-lg font-medium text-text-primary focus:outline-none focus:border-btn-bg focus:ring-4 focus:ring-btn-bg/5 transition-all resize-none"
                />
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-border-subtle flex items-center justify-between">
          <button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0} className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-text-secondary hover:text-text-primary hover:bg-bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-all">
            <ChevronLeft size={20} />
            <span>Previous</span>
          </button>
          <div className="flex space-x-2">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-btn-bg w-6' : 'bg-border-strong'}`} />
            ))}
          </div>
          <button onClick={() => { if (currentIndex < questions.length - 1) { setCurrentIndex(currentIndex + 1); } else { handleSubmit(); } }} className="flex items-center space-x-2 px-8 py-3 bg-text-primary text-bg-primary rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg">
            <span>{currentIndex === questions.length - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight size={20} />
          </button>
        </footer>
      </main>
    </div>
  );
};

export default QuizInterface;
