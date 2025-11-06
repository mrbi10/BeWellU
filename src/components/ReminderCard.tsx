import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ReminderCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
  onClick?: () => void;
}

export function ReminderCard({ 
  icon: Icon, 
  title, 
  description, 
  color = 'bg-blue-500',
  onClick 
}: ReminderCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`${color} p-2.5 rounded-xl`}>
          <Icon className="text-white" size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground mb-1">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
