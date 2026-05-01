import { useState } from 'react';
import { CheckCircle2, Plus, Trash2, X, Calendar } from 'lucide-react';

interface Task {
  id: string;
  task: string;
  time: string;
  done: boolean;
}

interface TaskChecklistProps {
  initialTasks?: Task[];
}

export const TaskChecklist = ({ initialTasks = [] }: TaskChecklistProps) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      task: newTaskText,
      time: 'Just now',
      done: false,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskText('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="bg-bg-secondary rounded-2xl border border-border-subtle p-6 flex flex-col h-full shadow-sm relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-text-primary">Upcoming Tasks</h2>
        <span className="text-xs font-bold text-text-secondary bg-bg-primary/50 px-2 py-1 rounded-lg border border-border-subtle">
          {tasks.filter(t => !t.done).length} pending
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-12 w-12 bg-bg-primary/50 rounded-full flex items-center justify-center mx-auto mb-3 text-text-secondary/30">
              <CheckCircle2 size={24} />
            </div>
            <p className="text-sm text-text-secondary font-medium">All caught up!</p>
          </div>
        ) : (
          tasks.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between group p-1 -m-1"
            >
              <div 
                onClick={() => toggleTask(item.id)}
                className="flex items-start space-x-3 cursor-pointer flex-1 min-w-0"
              >
                <div className={`mt-0.5 rounded-md border-2 p-0.5 transition-all duration-200 flex-shrink-0 ${
                  item.done 
                    ? 'bg-green-500 border-green-500 text-white scale-110 shadow-lg shadow-green-500/20' 
                    : 'border-border-strong text-transparent group-hover:border-text-primary'
                }`}>
                  <CheckCircle2 size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold truncate transition-all duration-300 ${
                    item.done ? 'text-text-secondary/50 line-through' : 'text-text-primary'
                  }`}>
                    {item.task}
                  </p>
                  <p className="text-[10px] text-text-secondary font-medium">{item.time}</p>
                </div>
              </div>
              <button 
                onClick={() => deleteTask(item.id)}
                className="p-2 text-text-secondary opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={() => setIsAdding(true)}
        className="w-full mt-6 py-3 border border-border-strong rounded-xl text-sm font-bold text-text-primary hover:bg-bg-primary hover:border-btn-bg hover:text-btn-bg transition-all flex items-center justify-center group"
      >
        <Plus size={18} className="mr-2 transition-transform group-hover:rotate-90" />
        Add New Task
      </button>

      {/* Modal Popup */}
      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsAdding(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-bg-secondary border border-border-strong rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            <div className="p-6 border-b border-border-subtle flex items-center justify-between bg-bg-primary/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-btn-bg/10 text-btn-bg rounded-xl">
                  <Plus size={20} />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Create New Task</h3>
              </div>
              <button 
                onClick={() => setIsAdding(false)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-border-subtle rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addTask} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Task Description</label>
                <textarea
                  autoFocus
                  rows={3}
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="What are you planning to do?"
                  className="w-full bg-bg-primary border border-border-strong rounded-2xl p-4 text-sm font-medium text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-btn-bg/20 focus:border-btn-bg transition-all resize-none"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Deadline</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input 
                      type="text" 
                      placeholder="Today" 
                      className="w-full pl-12 pr-4 py-3 bg-bg-primary border border-border-strong rounded-2xl text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-btn-bg/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-3.5 border border-border-strong text-text-primary font-bold rounded-2xl hover:bg-bg-primary transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTaskText.trim()}
                  className="flex-1 py-3.5 bg-btn-bg text-btn-text font-bold rounded-2xl hover:bg-btn-hover transition-all shadow-lg shadow-btn-bg/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
