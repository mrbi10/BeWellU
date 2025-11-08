import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, ArrowLeft, Heart } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-rose-50 pb-24 px-4 relative overflow-hidden">
      {/* Floating sparkles / hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 opacity-40"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0.8 + Math.random() * 0.6,
            }}
            animate={{
              y: [null, -100],
              opacity: [0.4, 0.9, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {Math.random() > 0.5 ? '💞' : '✨'}
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto pt-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-pink-200/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-rose-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-400 to-purple-400 p-3 rounded-2xl shadow-md">
              <Sparkles className="text-blue-500" size={24} />
            </div>
            <h1 className="text-xl font-semibold text-rose-600">
              Daily Motivation 💖
            </h1>
          </div>
        </div>

        {/* Current quote card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-pink-200 text-center"
        >
          <QuoteWidget text={currentQuote.text} author={currentQuote.author} />
          <Button
            onClick={getRandomQuote}
            variant="outline"
            className="mt-6 gap-2 bg-gradient-to-r from-pink-400 to-purple-400 text-blue-500 border-none hover:scale-105 transition-transform shadow-md"
          >
            <RefreshCw size={18} />
            Inspire Me Again ✨
          </Button>
        </motion.div>

        {/* All quotes section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-4"
        >
          <h3 className="text-rose-600 font-medium">💫 All Quotes</h3>
          <div className="space-y-3">
            {motivationalQuotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setCurrentQuote(quote)}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-pink-100 cursor-pointer hover:border-purple-400 hover:scale-[1.02] transition-all"
              >
                <p className="text-sm italic mb-2 text-rose-600">
                  “{quote.text}”
                </p>
                <p className="text-xs text-rose-400">— {quote.author}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Cute footer */}
        <div className="mt-10 text-center text-sm text-rose-400 italic">
          <Heart className="inline text-pink-400 mr-1" size={14} />
          Stay positive, papu 💕 One quote a day keeps sadness away 🌸
        </div>
      </div>
    </div>
  );
}
