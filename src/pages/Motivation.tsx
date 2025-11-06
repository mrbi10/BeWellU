import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, ArrowLeft } from 'lucide-react';
import { QuoteWidget } from '../components/QuoteWidget';
import { motivationalQuotes, getDailyQuote } from '../utils/quotes';
import { Button } from '../components/ui/button';

export function Motivation() {
  const navigate = useNavigate();
  const [currentQuote, setCurrentQuote] = useState(getDailyQuote());

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4">
      <div className="max-w-2xl mx-auto pt-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1>Daily Motivation</h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <QuoteWidget text={currentQuote.text} author={currentQuote.author} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            onClick={getRandomQuote}
            variant="outline"
            className="w-full gap-2"
          >
            <RefreshCw size={20} />
            Get Another Quote
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-4"
        >
          <h3>All Quotes</h3>
          <div className="space-y-3">
            {motivationalQuotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setCurrentQuote(quote)}
                className="bg-card rounded-xl p-4 shadow-sm border border-border cursor-pointer hover:border-purple-500 transition-colors"
              >
                <p className="text-sm italic mb-2 text-foreground">"{quote.text}"</p>
                <p className="text-xs text-muted-foreground">— {quote.author}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
