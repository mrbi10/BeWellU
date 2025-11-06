import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

interface QuoteWidgetProps {
  text: string;
  author: string;
}

export function QuoteWidget({ text, author }: QuoteWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-lg text-white"
    >
      <Quote className="mb-4 opacity-50" size={24} />
      <p className="mb-4 text-lg italic leading-relaxed">
        "{text}"
      </p>
      <p className="opacity-90">— {author}</p>
    </motion.div>
  );
}
