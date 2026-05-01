import { useState, useEffect, useRef } from 'react';
import { Plus, FileUp, Sparkles, Clock, Globe, X, Eye, Check, ChevronLeft, ChevronRight, AlertCircle, Hash, Share2, Copy, ExternalLink, PartyPopper, Users, ArrowLeft, Search, History as HistoryIcon, Activity, Trash2, Power, ImageIcon } from 'lucide-react';
import { SessionCard } from '../components/SessionCard';
import { QuestionCard, type Question } from '../components/QuestionCard';
import { generateQuestionsFromAI, generateQuestionsFromImage } from '../services/geminiService';

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  type: 'danger' | 'warning' | 'info';
}

const SessionManager = () => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'create-test' | 'monitor' | 'drafts'>('sessions');
  const [monitoringSessionId, setMonitoringSessionId] = useState<string | null>(null);
  const [sessionFilter, setSessionFilter] = useState<'active' | 'ended'>('active');
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPreviewIdx, setCurrentPreviewIdx] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [syllabusText, setSyllabusText] = useState('');
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [questionCount, setQuestionCount] = useState(5);
  const [error, setError] = useState<string | null>(null);
  
  // Publish state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [testTitle, setTestTitle] = useState('');
  const [duration, setDuration] = useState(60);
  const [publishedSessions, setPublishedSessions] = useState<any[]>([]);
  const [draftSaved, setDraftSaved] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);

  const loadDrafts = () => {
    const saved = localStorage.getItem('eval_drafts');
    setDrafts(saved ? JSON.parse(saved) : []);
  };

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'warning') => {
    setConfirmModal({ isOpen: true, title, message, onConfirm, type });
  };

  const closeConfirm = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  // Load sessions from localStorage on mount and poll for updates
  useEffect(() => {
    const loadSessions = () => {
      const saved = localStorage.getItem('eval_sessions');
      if (saved) {
        setPublishedSessions(JSON.parse(saved));
      }
    };
    
    loadSessions();
    loadDrafts();
    const interval = setInterval(() => { loadSessions(); loadDrafts(); }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAddQuestion = () => {
    const newQ: Question = { id: Date.now(), text: '', type: 'MCQ', options: ['', '', '', ''], answer: '' };
    setEditingQuestion(newQ);
  };

  const handleSaveQuestion = (q: Question) => {
    if (questions.find(existing => existing.id === q.id)) {
      setQuestions(questions.map(existing => existing.id === q.id ? q : existing));
    } else {
      setQuestions([...questions, q]);
    }
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: number) => {
    showConfirm(
      'Delete Question?',
      'This question will be permanently removed from your test configuration.',
      () => {
        setQuestions(questions.filter(q => q.id !== id));
        closeConfirm();
      },
      'danger'
    );
  };

  const handleGenerateAI = async () => {
    if (!syllabusText.trim() && !syllabusFile) {
      setError('Please provide syllabus text or upload a syllabus image.');
      return;
    }

    if (questionCount < 1 || questionCount > 20) {
      setError('Please choose between 1 and 20 questions.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let aiQs;
      if (syllabusFile) {
        aiQs = await generateQuestionsFromImage(syllabusFile, questionCount);
        setSyllabusFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        aiQs = await generateQuestionsFromAI(syllabusText, questionCount);
        setSyllabusText('');
      }
      const formattedQs: Question[] = aiQs.map((q, index) => ({
        ...q,
        id: Date.now() + index,
      }));
      setQuestions([...questions, ...formattedQs]);
    } catch (err: any) {
      setError(err.message || 'Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    const draft = {
      id: Date.now().toString(),
      title: testTitle || 'Untitled Draft',
      questions,
      duration,
      syllabusText,
      savedAt: new Date().toLocaleString(),
    };
    const existing = JSON.parse(localStorage.getItem('eval_drafts') || '[]');
    const updated = [draft, ...existing];
    localStorage.setItem('eval_drafts', JSON.stringify(updated));
    setDrafts(updated);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const handleLoadDraft = (draft: any) => {
    setTestTitle(draft.title);
    setQuestions(draft.questions ?? []);
    setDuration(draft.duration ?? 60);
    setSyllabusText(draft.syllabusText ?? '');
    setActiveTab('create-test');
  };

  const handleDeleteDraft = (id: string) => {
    const updated = drafts.filter(d => d.id !== id);
    setDrafts(updated);
    localStorage.setItem('eval_drafts', JSON.stringify(updated));
  };

  const handlePublish = () => {
    if (!testTitle.trim()) {
      setError('Please enter a test title before publishing.');
      return;
    }
    setIsPublishing(true);
    
    setTimeout(() => {
      const quizId = Math.random().toString(36).substring(2, 8).toUpperCase();
      const url = `${window.location.origin}/quiz/${quizId}/join`;
      
      const newSession = {
        id: quizId,
        name: testTitle,
        questions: questions,
        participants: [], // Real participant tracking
        duration: duration, // Timed session
        studentCount: 0,
        startedAt: new Date().toLocaleString(),
        url: url,
        status: 'active'
      };

      const updatedSessions = [newSession, ...publishedSessions];
      setPublishedSessions(updatedSessions);
      localStorage.setItem('eval_sessions', JSON.stringify(updatedSessions));
      
      setPublishedUrl(url);
      setIsPublishing(false);
      setTestTitle('');
      setQuestions([]);
    }, 1500);
  };

  const handleEndSession = (id: string) => {
    showConfirm(
      'End Evaluation Session?',
      'The session link will become inactive for all students. The session will be moved to history.',
      () => {
        const updated = publishedSessions.map(s => 
          s.id === id ? { ...s, status: 'ended', endedAt: new Date().toLocaleString() } : s
        );
        setPublishedSessions(updated);
        localStorage.setItem('eval_sessions', JSON.stringify(updated));
        
        if (activeTab === 'monitor') {
          setActiveTab('sessions');
          setSessionFilter('ended');
        }
        closeConfirm();
      },
      'warning'
    );
  };

  const handleDeleteFromHistory = (id: string) => {
    showConfirm(
      'Permanent Deletion?',
      'This will completely remove the session record and all related data from your history. This action cannot be undone.',
      () => {
        const updated = publishedSessions.filter(s => s.id !== id);
        setPublishedSessions(updated);
        localStorage.setItem('eval_sessions', JSON.stringify(updated));
        closeConfirm();
      },
      'danger'
    );
  };

  const handleMonitorSession = (id: string) => {
    setMonitoringSessionId(id);
    setActiveTab('monitor');
  };

  const monitoringSession = publishedSessions.find(s => s.id === monitoringSessionId);

  const filteredSessions = publishedSessions.filter(s => 
    sessionFilter === 'active' ? s.status === 'active' : s.status === 'ended'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {activeTab === 'monitor' && (
            <button 
              onClick={() => setActiveTab('sessions')}
              className="p-2 hover:bg-bg-secondary rounded-xl text-text-secondary hover:text-text-primary transition-all"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">
              {activeTab === 'monitor' ? 'Live Monitoring' : 'Session Manager'}
            </h1>
            <p className="text-text-secondary mt-1">
              {activeTab === 'monitor' ? `Tracking performance for "${monitoringSession?.name}"` : 'Create new tests, generate AI questions, and manage live sessions.'}
            </p>
          </div>
        </div>
        
        {activeTab !== 'monitor' && (
          <div className="flex bg-bg-secondary p-1 rounded-xl border border-border-subtle">
            <button 
              onClick={() => setActiveTab('sessions')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sessions' ? 'bg-btn-bg text-btn-text shadow-md' : 'text-text-secondary hover:text-text-primary'}`}
            >
              All Sessions
            </button>
            <button 
              onClick={() => { setActiveTab('drafts'); loadDrafts(); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${activeTab === 'drafts' ? 'bg-btn-bg text-btn-text shadow-md' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Drafts
              {drafts.length > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === 'drafts' ? 'bg-white/20' : 'bg-btn-bg/10 text-btn-bg'}`}>
                  {drafts.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('create-test')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'create-test' ? 'bg-btn-bg text-btn-text shadow-md' : 'text-text-secondary hover:text-text-primary'}`}
            >
              Create New Test
            </button>
          </div>
        )}
      </div>

      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 bg-bg-secondary p-1 w-fit rounded-xl border border-border-subtle">
            <button 
              onClick={() => setSessionFilter('active')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center transition-all ${sessionFilter === 'active' ? 'bg-bg-primary text-btn-bg shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Activity size={14} className="mr-2" />
              Active
            </button>
            <button 
              onClick={() => setSessionFilter('ended')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center transition-all ${sessionFilter === 'ended' ? 'bg-bg-primary text-purple-500 shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <HistoryIcon size={14} className="mr-2" />
              History
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-bg-secondary/30 rounded-[40px] border-2 border-dashed border-border-strong">
                <div className="p-6 bg-bg-primary w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-text-secondary/20">
                  {sessionFilter === 'active' ? <Globe size={40} /> : <HistoryIcon size={40} />}
                </div>
                <h3 className="text-xl font-bold text-text-primary">
                  {sessionFilter === 'active' ? 'No active sessions' : 'No session history'}
                </h3>
                <p className="text-text-secondary mt-2 mb-8">
                  {sessionFilter === 'active' ? 'Publish your first test to start seeing sessions here.' : 'Your ended sessions will appear here.'}
                </p>
                {sessionFilter === 'active' && (
                  <button 
                    onClick={() => setActiveTab('create-test')}
                    className="px-8 py-3 bg-btn-bg text-btn-text rounded-xl font-bold hover:bg-btn-hover transition-all shadow-lg shadow-btn-bg/10"
                  >
                    Create Test Now
                  </button>
                )}
              </div>
            ) : (
              filteredSessions.map((session) => (
                <SessionCard 
                  key={session.id} 
                  {...session} 
                  studentCount={session.participants?.length || 0}
                  onEnd={handleEndSession}
                  onMonitor={handleMonitorSession}
                  onDelete={sessionFilter === 'ended' ? handleDeleteFromHistory : undefined}
                />
              ))
            )}

            {sessionFilter === 'active' && filteredSessions.length > 0 && (
              <button 
                onClick={() => setActiveTab('create-test')}
                className="bg-bg-primary p-6 rounded-2xl border-2 border-dashed border-border-strong flex flex-col items-center justify-center text-text-secondary hover:border-btn-bg hover:text-btn-bg transition-all group min-h-[200px]"
              >
                <div className="p-4 bg-bg-secondary rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Plus size={32} />
                </div>
                <p className="font-bold">New Session</p>
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'drafts' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary font-medium">
              {drafts.length === 0 ? 'No drafts saved yet.' : `${drafts.length} draft${drafts.length > 1 ? 's' : ''} saved`}
            </p>
          </div>

          {drafts.length === 0 ? (
            <div className="py-28 flex flex-col items-center text-center bg-bg-secondary/30 rounded-[40px] border-2 border-dashed border-border-strong">
              <div className="p-5 bg-bg-primary rounded-full text-text-secondary/20 mb-6">
                <FileUp size={40} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No Drafts Yet</h3>
              <p className="text-text-secondary text-sm max-w-xs">
                Click <span className="font-bold text-btn-bg">Save Draft</span> while building a test to save it here for later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {drafts.map((draft) => (
                <div key={draft.id} className="bg-bg-secondary rounded-2xl border border-border-subtle p-5 flex flex-col gap-4 hover:border-border-strong transition-all group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-black text-text-primary truncate">{draft.title}</h3>
                      <p className="text-[11px] text-text-secondary mt-0.5">{draft.savedAt}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteDraft(draft.id)}
                      className="p-1.5 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0 opacity-0 group-hover:opacity-100"
                      title="Delete draft"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-text-secondary font-medium">
                    <span className="flex items-center gap-1">
                      <Hash size={12} />
                      {(draft.questions ?? []).length} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {draft.duration} min
                    </span>
                  </div>

                  <button
                    onClick={() => handleLoadDraft(draft)}
                    className="w-full py-2.5 bg-btn-bg/10 text-btn-bg border border-btn-bg/20 rounded-xl text-sm font-bold hover:bg-btn-bg hover:text-btn-text transition-all"
                  >
                    Load & Edit
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create-test' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="bg-bg-secondary p-6 rounded-2xl border border-border-subtle shadow-sm">
              <h2 className="text-lg font-bold text-text-primary mb-4">Test Configuration</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Test Title</label>
                  <input 
                    type="text" 
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="e.g. Mid-term Exam" 
                    className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-btn-bg/20 transition-all" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Duration (Min)</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input 
                        type="number" 
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                        className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-border-subtle rounded-xl text-sm" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Expiry</label>
                    <div className="relative">
                      <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input type="text" placeholder="Auto" className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-border-subtle rounded-xl text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-bg-secondary p-6 rounded-2xl border border-border-subtle shadow-sm overflow-hidden relative">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center">
                <Sparkles size={20} className="mr-2 text-purple-500" />
                AI Content Generator
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Syllabus Content</label>
                  <textarea 
                    value={syllabusText}
                    onChange={(e) => setSyllabusText(e.target.value)}
                    placeholder="Paste syllabus text or key topics here..."
                    className="w-full bg-bg-primary border border-border-subtle rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-btn-bg/20 resize-none h-32 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">No. of Questions</label>
                    <div className="relative">
                      <Hash size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                      <input 
                        type="number" 
                        min="1" 
                        max="20"
                        value={questionCount}
                        onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                        className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-border-subtle rounded-xl text-sm font-bold text-text-primary focus:ring-2 focus:ring-btn-bg/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Upload Image</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-2 text-center hover:border-btn-bg transition-all cursor-pointer bg-bg-primary/30 h-[46px] flex items-center justify-center gap-2 ${
                        syllabusFile ? 'border-green-500/60 bg-green-500/5' : 'border-border-strong'
                      }`}
                      title={syllabusFile ? syllabusFile.name : 'Upload syllabus image'}
                    >
                      {syllabusFile ? (
                        <>
                          <ImageIcon size={15} className="text-green-500 flex-shrink-0" />
                          <span className="text-[11px] font-bold text-green-500 truncate max-w-[80px]">{syllabusFile.name}</span>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setSyllabusFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                            className="ml-auto text-text-secondary hover:text-red-500 flex-shrink-0"
                          >
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <>
                          <FileUp size={18} className="text-text-secondary" />
                          <span className="text-[11px] font-bold text-text-secondary">Image</span>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setSyllabusFile(file);
                          if (file) setSyllabusText('');
                        }}
                      />
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-2 text-red-500 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <p className="text-xs font-medium">{error}</p>
                  </div>
                )}
                <button 
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative"
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Gemini is Thinking...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles size={18} className="mr-2" />
                      Generate Questions
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-secondary rounded-2xl border border-border-subtle shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-bg-primary/30">
                <div className="flex items-center space-x-3">
                  <h2 className="text-lg font-bold text-text-primary">Questions Preview</h2>
                  <span className="bg-btn-bg/10 text-btn-bg border border-btn-bg/20 px-3 py-1 rounded-full text-xs font-bold">
                    {questions.length} total
                  </span>
                </div>
                <button 
                  onClick={() => { setIsPreviewOpen(true); setCurrentPreviewIdx(0); }}
                  className="flex items-center text-sm font-bold text-text-secondary hover:text-text-primary transition-colors bg-bg-primary px-4 py-2 rounded-lg border border-border-subtle shadow-sm"
                >
                  <Eye size={18} className="mr-2" />
                  Full Screen Preview
                </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto max-h-[800px] custom-scrollbar">
                {questions.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-16 h-16 bg-bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-text-secondary/20">
                      <Sparkles size={32} />
                    </div>
                    <p className="text-text-secondary font-medium">Use AI or add questions manually to start</p>
                  </div>
                ) : (
                  questions.map((q, i) => (
                    <QuestionCard 
                      key={q.id} 
                      question={q} 
                      index={i} 
                      onEdit={setEditingQuestion}
                      onDelete={() => handleDeleteQuestion(q.id)}
                      onPreview={(q) => { 
                        const idx = questions.findIndex(item => item.id === q.id);
                        setCurrentPreviewIdx(idx);
                        setIsPreviewOpen(true);
                      }}
                    />
                  ))
                )}
                <button 
                  onClick={handleAddQuestion}
                  className="w-full py-6 border-2 border-dashed border-border-strong rounded-2xl text-text-secondary hover:text-btn-bg hover:border-btn-bg transition-all flex flex-col items-center justify-center font-bold bg-bg-primary/30 group"
                >
                  <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                  Add Question Manually
                </button>
              </div>
              <div className="p-6 bg-bg-primary border-t border-border-subtle flex justify-end gap-4 mt-auto">
                <button
                  onClick={handleSaveDraft}
                  disabled={questions.length === 0 && !testTitle.trim()}
                  className="px-6 py-3 border border-border-strong rounded-xl font-bold text-text-primary hover:bg-bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {draftSaved ? <><Check size={15} className="text-green-500" /> Saved!</> : 'Save Draft'}
                </button>
                <button 
                  onClick={handlePublish}
                  disabled={isPublishing || questions.length === 0}
                  className="px-8 py-3 bg-btn-bg text-btn-text rounded-xl font-bold hover:bg-btn-hover transition-all shadow-lg shadow-btn-bg/10 disabled:opacity-50 flex items-center"
                >
                  {isPublishing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Publishing...
                    </>
                  ) : (
                    'Publish & Create Session'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'monitor' && monitoringSession && (
        <div className="animate-in slide-in-from-right-8 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-bg-secondary border border-border-strong rounded-[32px] overflow-hidden">
                <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-bg-primary/30">
                  <h3 className="text-lg font-bold text-text-primary flex items-center">
                    <Users size={20} className="mr-2 text-btn-bg" />
                    Joined Students
                  </h3>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input type="text" placeholder="Search student..." className="pl-10 pr-4 py-2 bg-bg-primary border border-border-subtle rounded-xl text-xs focus:ring-2 focus:ring-btn-bg/20" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-bg-primary/50 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Roll Number</th>
                        <th className="px-6 py-4">Progress</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {(monitoringSession.participants || []).length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-text-secondary font-medium">
                            Waiting for students to join...
                          </td>
                        </tr>
                      ) : (
                        monitoringSession.participants.map((student: any, i: number) => (
                          <tr key={i} className="hover:bg-bg-primary/30 transition-colors group">
                            <td className="px-6 py-4 font-bold text-text-primary text-sm">{student.name}</td>
                            <td className="px-6 py-4 text-text-secondary text-sm font-medium">{student.rollNumber}</td>
                            <td className="px-6 py-4">
                              <div className="w-24 h-1.5 bg-bg-primary rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${student.status === 'submitted' ? 'bg-green-500' : 'bg-btn-bg'} transition-all`} 
                                  style={{ width: `${(student.answeredCount / monitoringSession.questions.length) * 100}%` }} 
                                />
                              </div>
                              <span className="text-[10px] font-bold text-text-secondary mt-1 block">
                                {student.answeredCount}/{monitoringSession.questions.length} answered
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${student.status === 'submitted' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                                {student.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-xs font-bold text-btn-bg hover:underline opacity-0 group-hover:opacity-100 transition-all">View Response</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-bg-secondary p-6 rounded-[32px] border border-border-strong shadow-sm">
                <h4 className="text-sm font-black text-text-secondary uppercase tracking-[0.2em] mb-4">Session Stats</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-bg-primary rounded-2xl border border-border-subtle">
                    <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Total Joined</p>
                    <p className="text-2xl font-black text-text-primary">{(monitoringSession.participants || []).length.toString().padStart(2, '0')}</p>
                  </div>
                  <div className="p-4 bg-bg-primary rounded-2xl border border-border-subtle">
                    <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Duration</p>
                    <p className="text-2xl font-black text-text-primary">{monitoringSession.duration}m</p>
                  </div>
                  <div className="p-4 bg-bg-primary rounded-2xl border border-border-subtle">
                    <p className="text-[10px] font-bold text-text-secondary uppercase mb-1">Status</p>
                    <p className="text-2xl font-black text-btn-bg uppercase">{monitoringSession.status}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleEndSession(monitoringSession.id)}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center"
              >
                End Session for All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={closeConfirm} />
          <div className="relative w-full max-w-sm bg-bg-secondary border border-border-strong rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${
                confirmModal.type === 'danger' ? 'bg-red-500/10 text-red-500' : 
                confirmModal.type === 'warning' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-btn-bg/10 text-btn-bg'
              }`}>
                {confirmModal.type === 'danger' ? <Trash2 size={32} /> : 
                 confirmModal.type === 'warning' ? <Power size={32} /> : <AlertCircle size={32} />}
              </div>
              <h3 className="text-xl font-black text-text-primary tracking-tight mb-2">{confirmModal.title}</h3>
              <p className="text-sm text-text-secondary font-medium leading-relaxed mb-8">{confirmModal.message}</p>
              
              <div className="flex space-x-3">
                <button 
                  onClick={closeConfirm}
                  className="flex-1 py-3 bg-bg-primary border border-border-subtle rounded-2xl text-sm font-bold text-text-primary hover:bg-bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    confirmModal.onConfirm();
                  }}
                  className={`flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all shadow-lg ${
                    confirmModal.type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 
                    confirmModal.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-600/20' : 'bg-btn-bg hover:bg-btn-hover shadow-btn-bg/20'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setEditingQuestion(null)} />
          <div className="relative w-full max-w-2xl bg-bg-secondary border border-border-strong rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-bg-primary/50">
              <h3 className="text-xl font-bold text-text-primary">
                {questions.find(q => q.id === editingQuestion.id) ? 'Edit Question' : 'Create Question'}
              </h3>
              <button onClick={() => setEditingQuestion(null)} className="p-2 text-text-secondary hover:text-text-primary rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase">Question Type</label>
                <div className="flex space-x-2">
                  {['MCQ', 'Subjective'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setEditingQuestion({ ...editingQuestion, type: type as any, options: type === 'MCQ' ? ['', '', '', ''] : undefined })}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${editingQuestion.type === type ? 'bg-btn-bg border-btn-bg text-btn-text' : 'border-border-subtle text-text-secondary'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase">Question Text</label>
                <textarea 
                  value={editingQuestion.text}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, text: e.target.value })}
                  rows={3} 
                  className="w-full bg-bg-primary border border-border-subtle rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-btn-bg/20 resize-none transition-all" 
                  placeholder="Type your question here..."
                />
              </div>
              {editingQuestion.type === 'MCQ' && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <label className="text-xs font-bold text-text-secondary uppercase">Options</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {editingQuestion.options?.map((opt, i) => (
                      <div key={i} className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-secondary">{String.fromCharCode(65 + i)}</span>
                        <input 
                          type="text" 
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...(editingQuestion.options || [])];
                            newOpts[i] = e.target.value;
                            setEditingQuestion({ ...editingQuestion, options: newOpts });
                          }}
                          className="w-full pl-10 pr-12 py-3 bg-bg-primary border border-border-subtle rounded-xl text-sm font-medium" 
                          placeholder={`Option ${i+1}`}
                        />
                        <button 
                          onClick={() => setEditingQuestion({ ...editingQuestion, answer: opt })}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${editingQuestion.answer === opt ? 'bg-green-500 text-white' : 'bg-bg-secondary text-text-secondary hover:text-text-primary'}`}
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-border-subtle flex justify-end space-x-3 bg-bg-primary/30">
              <button onClick={() => setEditingQuestion(null)} className="px-6 py-2.5 border border-border-strong rounded-xl text-sm font-bold text-text-primary hover:bg-bg-secondary">Cancel</button>
              <button onClick={() => handleSaveQuestion(editingQuestion)} className="px-8 py-2.5 bg-btn-bg text-btn-text rounded-xl text-sm font-bold hover:bg-btn-hover shadow-lg shadow-btn-bg/10">Save Question</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal remains same */}
      {publishedUrl && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in" onClick={() => setPublishedUrl(null)} />
          <div className="relative w-full max-w-lg bg-bg-secondary border border-border-strong rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <PartyPopper size={48} />
              </div>
              <h2 className="text-3xl font-black text-text-primary tracking-tight mb-2">Test Published!</h2>
              <p className="text-text-secondary font-medium mb-10">Your assessment is live. Share the link below with your students to start the session.</p>
              
              <div className="relative mb-8 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-btn-bg to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <div className="relative flex items-center bg-bg-primary border border-border-strong rounded-2xl p-2 pl-4">
                  <Share2 size={18} className="text-text-secondary mr-3" />
                  <input 
                    readOnly 
                    value={publishedUrl} 
                    className="flex-1 bg-transparent border-none text-sm font-bold text-text-primary focus:ring-0 truncate" 
                  />
                  <button 
                    onClick={() => navigator.clipboard.writeText(publishedUrl)}
                    className="p-3 bg-bg-secondary text-text-primary hover:bg-border-subtle rounded-xl transition-all ml-2"
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setPublishedUrl(null)} className="py-4 border border-border-strong rounded-2xl font-bold text-text-primary hover:bg-bg-primary transition-all">Done</button>
                <a href={publishedUrl} target="_blank" rel="noopener noreferrer" className="py-4 bg-btn-bg text-btn-text rounded-2xl font-bold hover:bg-btn-hover transition-all flex items-center justify-center shadow-xl shadow-btn-bg/20">
                  View as Student
                  <ExternalLink size={18} className="ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Preview Modal remains same */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-bg-primary animate-in fade-in duration-300">
          <header className="h-20 border-b border-border-subtle px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-btn-bg font-bold text-xl tracking-tighter">PREVIEW</span>
              <div className="h-6 w-px bg-border-subtle" />
              <p className="text-text-primary font-bold">{testTitle || 'Untitled Test'}</p>
            </div>
            <button onClick={() => setIsPreviewOpen(false)} className="p-3 bg-bg-secondary hover:bg-border-subtle rounded-full text-text-secondary hover:text-text-primary transition-all">
              <X size={24} />
            </button>
          </header>
          <main className="flex-1 overflow-y-auto p-12 flex items-center justify-center relative">
            <button 
              onClick={() => setCurrentPreviewIdx(Math.max(0, currentPreviewIdx - 1))}
              disabled={currentPreviewIdx === 0}
              className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-bg-secondary rounded-full text-text-secondary hover:text-text-primary border border-border-subtle shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={32} />
            </button>
            <button 
              onClick={() => setCurrentPreviewIdx(Math.min(questions.length - 1, currentPreviewIdx + 1))}
              disabled={currentPreviewIdx === questions.length - 1}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-bg-secondary rounded-full text-text-secondary hover:text-text-primary border border-border-subtle shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={32} />
            </button>
            <div className="w-full max-w-4xl">
              <div className="mb-12 text-center">
                <span className="inline-block px-4 py-1.5 bg-btn-bg/10 text-btn-bg text-xs font-extrabold uppercase tracking-[0.2em] rounded-full mb-4">
                  Question {currentPreviewIdx + 1} of {questions.length}
                </span>
                <h2 className="text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
                  {questions[currentPreviewIdx]?.text}
                </h2>
              </div>
              {questions[currentPreviewIdx]?.type === 'MCQ' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {questions[currentPreviewIdx].options?.map((opt, i) => (
                    <div key={i} className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 ${opt === questions[currentPreviewIdx].answer ? 'bg-btn-bg border-btn-bg text-btn-text shadow-2xl shadow-btn-bg/20' : 'bg-bg-secondary/50 border-border-subtle text-text-primary'}`}>
                      <span className={`absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg ${opt === questions[currentPreviewIdx].answer ? 'bg-white/20 text-white' : 'bg-bg-primary text-text-secondary'}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <p className="pl-12 font-bold text-xl">{opt}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-bg-secondary/50 border-2 border-dashed border-border-strong rounded-[40px] p-20 text-center text-text-secondary italic">
                  Subjective response
                </div>
              )}
            </div>
          </main>
          <footer className="h-20 border-t border-border-subtle px-12 flex items-center justify-between bg-bg-secondary/30">
            <p className="text-sm font-bold text-text-secondary">Viewing Mode: Evaluation Preview</p>
            <button onClick={() => setIsPreviewOpen(false)} className="px-8 py-2.5 bg-text-primary text-bg-primary rounded-xl font-bold hover:opacity-90 transition-all">
              Exit Preview
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default SessionManager;
