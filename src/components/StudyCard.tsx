import { motion } from 'motion/react';
import { BookOpen, Trash2 } from 'lucide-react';
import { getDaysUntil, formatDate } from '../utils/calculations';

interface StudyCardProps {
  exam: {
    id: number;
    subject: string;
    exam_date: string;
  };
  onDelete: (id: number) => void;
}

export function StudyCard({ exam, onDelete }: StudyCardProps) {
  const daysUntil = getDaysUntil(exam.exam_date);
  
  const getUrgencyColor = (days: number) => {
    if (days < 0) return 'text-muted-foreground';
    if (days <= 2) return 'text-red-500';
    if (days <= 7) return 'text-orange-500';
    return 'text-blue-500';
  };

  const getUrgencyBg = (days: number) => {
    if (days < 0) return 'bg-muted';
    if (days <= 2) return 'bg-red-500';
    if (days <= 7) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border"
    >
      <div className="flex items-start gap-3">
        <div className={`${getUrgencyBg(daysUntil)} p-2.5 rounded-xl`}>
          <BookOpen className="text-white" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground mb-1">{exam.subject}</h3>
          <p className="text-muted-foreground text-sm mb-2">
            {formatDate(exam.exam_date)}
          </p>
          <p className={`${getUrgencyColor(daysUntil)}`}>
            {daysUntil < 0 
              ? 'Exam passed' 
              : daysUntil === 0 
              ? 'Exam today!' 
              : daysUntil === 1 
              ? 'Tomorrow' 
              : `${daysUntil} days left`}
          </p>
        </div>
        <button
          onClick={() => onDelete(exam.id)}
          className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
        >
          <Trash2 size={18} className="text-destructive" />
        </button>
      </div>
    </motion.div>
  );
}
