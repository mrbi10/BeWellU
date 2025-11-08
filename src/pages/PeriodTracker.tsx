import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Heart, ArrowLeft, Save } from 'lucide-react';
import { profileAPI, periodAPI } from '../utils/api';
import { getPeriodPhase, formatDate } from '../utils/calculations';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function PeriodTracker() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileGender, setProfileGender] = useState<string | null>(null);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState(28);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profile, periodData] = await Promise.all([
        profileAPI.get(),
        periodAPI.get(),
      ]);

      setProfileGender(profile?.gender || null);

      if (periodData) {
        setLastPeriodDate(periodData.Last_Period_Date || '');
        setCycleLength(Number(periodData.Cycle_Length) || 28);
      }
    } catch (error) {
      console.error('Failed to load period data:', error);
      toast.error('Failed to load period data 😢');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lastPeriodDate) {
      toast.error('Please enter your last period date 💕');
      return;
    }

    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await periodAPI.upsert({
        name: user.Name || user.name || '',
        last_period_date: lastPeriodDate,
        cycle_length: cycleLength,
      });
      toast.success('Saved perfectly 💖 Take care, okay?');
    } catch (error) {
      console.error('Failed to save period data:', error);
      toast.error('Could not save data 😔');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-red-100">
        <div className="animate-pulse text-4xl">💞</div>
      </div>
    );
  }

  if (!profileGender || profileGender !== 'female') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 pb-24 px-4">
        <div className="max-w-2xl mx-auto pt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-pink-200/60 rounded-lg transition-colors mb-4"
          >
            <ArrowLeft size={24} className="text-rose-500" />
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-pink-200"
          >
            <Heart className="mx-auto mb-4 text-rose-400" size={48} />
            <h2 className="text-xl text-rose-600 mb-2 font-semibold">
              Period Tracker 💖
            </h2>
            <p className="text-rose-400 text-sm mb-4">
              This feature is only for female profiles.
              Update your profile if you want to access this section 🌸
            </p>
            <Button onClick={() => navigate('/profile')} className="bg-gradient-to-r from-pink-400 to-rose-400 text-red-500 hover:scale-105">
              Go to Profile
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const phaseInfo = lastPeriodDate ? getPeriodPhase(lastPeriodDate, cycleLength) : null;

  const getPhaseInfo = () => {
    if (!phaseInfo) return null;

    switch (phaseInfo.phase) {
      case 'period':
        return {
          color: 'from-red-400 to-pink-400',
          emoji: '🩸',
          title: 'Period Time 💕',
          message: 'Rest well and stay hydrated sweetu 💦 Take it easy 💖',
        };
      case 'ovulation':
        return {
          color: 'from-green-400 to-teal-400',
          emoji: '🌸',
          title: 'Ovulation Phase 🌼',
          message: 'You’ll feel more energetic — perfect time for light walks 🌞',
        };
      case 'upcoming':
        return {
          color: 'from-orange-400 to-red-400',
          emoji: '⚠️',
          title: 'Period Coming Soon',
          message: `Your period might start in ${phaseInfo.daysUntilNext} days — get ready 💕`,
        };
      default:
        return {
          color: 'from-blue-400 to-purple-400',
          emoji: '✨',
          title: 'Normal Days 🌙',
          message: 'Relax, eat well, and keep smiling 😚',
        };
    }
  };

  const phase = getPhaseInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-red-100 px-4 pb-24 relative overflow-hidden">
      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 opacity-40"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -60],
              opacity: [0.3, 0.9, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            💞
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto pt-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-pink-200/60 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-rose-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-400 to-rose-400 p-3 rounded-2xl shadow-md">
              <Calendar className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-semibold text-rose-600">
              Period Tracker 💗
            </h1>
          </div>
        </div>

        {/* Input form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-pink-200 mb-6"
        >
          <h3 className="text-rose-600 mb-4 font-medium">Cycle Information 🌷</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lastPeriod" className="text-rose-500">
                Last Period Start Date
              </Label>
              <Input
                id="lastPeriod"
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="mt-2 border-pink-200 focus:ring-rose-400"
              />
            </div>
            <div>
              <Label htmlFor="cycleLength" className="text-rose-500">
                Average Cycle Length (days)
              </Label>
              <Input
                id="cycleLength"
                type="number"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                min="21"
                max="35"
                className="mt-2 border-pink-200 focus:ring-rose-400"
              />
              <p className="text-xs text-rose-400 mt-1">
                Typical length is around 28 days
              </p>
            </div>
            <Button
              onClick={handleSave}
              className="w-full gap-2 bg-gradient-to-r from-pink-400 to-red-400 text-white hover:scale-105 transition-transform"
              disabled={saving}
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Cycle Data 💕'}
            </Button>
          </div>
        </motion.div>

        {/* Display current phase */}
        {phase && phaseInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-gradient-to-br ${phase.color} text-white rounded-2xl p-6 shadow-lg mb-6`}
          >
            <div className="text-4xl mb-3">{phase.emoji}</div>
            <h2 className="mb-1 font-semibold">{phase.title}</h2>
            <p className="opacity-90 mb-4">{phase.message}</p>

            <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span>Next Period</span>
                <span>{formatDate(phaseInfo.nextPeriodDate)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span>Days Until</span>
                <span>
                  {phaseInfo.daysUntilNext < 0
                    ? 'Overdue 💧'
                    : phaseInfo.daysUntilNext === 0
                      ? 'Today 💕'
                      : `${phaseInfo.daysUntilNext} days`}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
