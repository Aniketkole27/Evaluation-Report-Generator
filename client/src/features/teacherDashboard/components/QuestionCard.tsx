import { Pencil, Trash2, Eye } from 'lucide-react';

export interface Question {
  id: number;
  text: string;
  type: string;
  options?: string[];
  answer?: string;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  onEdit?: (q: Question) => void;
  onDelete?: (id: number) => void;
  onPreview?: (q: Question) => void;
}

export const QuestionCard = ({ question, index, onEdit, onDelete, onPreview }: QuestionCardProps) => (
  <div className="p-6 bg-bg-primary border border-border-subtle rounded-2xl relative group hover:border-btn-bg/30 transition-all shadow-sm">
    <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
      {onPreview && (
        <button 
          onClick={() => onPreview(question)}
          className="p-2 bg-bg-secondary text-text-secondary hover:text-text-primary rounded-lg border border-border-subtle transition-all"
        >
          <Eye size={14} />
        </button>
      )}
      {onEdit && (
        <button 
          onClick={() => onEdit(question)}
          className="p-2 bg-bg-secondary text-text-secondary hover:text-text-primary rounded-lg border border-border-subtle transition-all"
        >
          <Pencil size={14} />
        </button>
      )}
      {onDelete && (
        <button 
          onClick={() => onDelete(question.id)}
          className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
    <span className="text-[10px] font-extrabold text-btn-bg uppercase tracking-widest mb-2 block">
      Question {index + 1} • {question.type}
    </span>
    <p className="text-text-primary font-bold pr-20 leading-relaxed">{question.text}</p>
    {question.options && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {question.options.map((opt, idx) => (
          <div key={idx} className={`p-3 rounded-xl border text-sm font-medium transition-all ${opt === question.answer ? 'bg-btn-bg/5 border-btn-bg text-btn-bg' : 'border-border-subtle text-text-secondary bg-bg-secondary/30'}`}>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-bg-primary border border-border-subtle text-[10px] mr-2 text-text-secondary">
              {String.fromCharCode(65 + idx)}
            </span>
            {opt}
          </div>
        ))}
      </div>
    )}
  </div>
);
