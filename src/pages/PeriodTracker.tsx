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
        setLastPeriodDate(periodData.last_period_date || '');
        setCycleLength(periodData.cycle_length || 28);
      }
    } catch (error) {
      console.error('Failed to load period data:', error);
      toast.error('Failed to load period data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lastPeriodDate) {
      toast.error('Please enter your last period date');
      return;
    }

    setSaving(true);
    try {
      await periodAPI.upsert({
        last_period_date: lastPeriodDate,
        cycle_length: cycleLength,
      });
      toast.success('Period data saved successfully!');
    } catch (error) {
      console.error('Failed to save period data:', error);
      toast.error('Failed to save period data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profileGender || profileGender !== 'female') {
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
            <h1>Period Tracker</h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center"
          >
            <Heart className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h2 className="mb-2">Period Tracker</h2>
            <p className="text-muted-foreground">
              This feature is available for female users. Please update your profile to access it.
            </p>
            <Button onClick={() => navigate('/profile')} className="mt-6">
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
          color: 'from-red-500 to-pink-500',
          icon: '🩸',
          title: 'Period Phase',
          message: 'Take care of yourself. Remember to carry essentials.',
        };
      case 'ovulation':
        return {
          color: 'from-green-500 to-teal-500',
          icon: '🌸',
          title: 'Ovulation Phase',
          message: 'You might feel more energetic during this time.',
        };
      case 'upcoming':
        return {
          color: 'from-orange-500 to-red-500',
          icon: '⚠️',
          title: 'Period Coming Soon',
          message: `Your period is expected in ${phaseInfo.daysUntilNext} days. Be prepared!`,
        };
      default:
        return {
          color: 'from-blue-500 to-purple-500',
          icon: '✨',
          title: 'Safe Phase',
          message: 'Regular phase of your cycle.',
        };
    }
  };

  const phase = getPhaseInfo();

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
            <div className="bg-gradient-to-br from-pink-500 to-red-500 p-3 rounded-2xl">
              <Calendar className="text-white" size={24} />
            </div>
            <h1>Period Tracker</h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6"
        >
          <h3 className="mb-4">Cycle Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lastPeriod">Last Period Start Date</Label>
              <Input
                id="lastPeriod"
                type="date"
                value={lastPeriodDate}
                onChange={(e) => setLastPeriodDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
              <Input
                id="cycleLength"
                type="number"
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                min="21"
                max="35"
                className="mt-2"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Typical cycle length is 28 days
              </p>
            </div>
            <Button onClick={handleSave} className="w-full gap-2" disabled={saving}>
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Cycle Data'}
            </Button>
          </div>
        </motion.div>

        {phaseInfo && phase && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-gradient-to-br ${phase.color} rounded-2xl p-6 shadow-lg text-white mb-6`}
            >
              <div className="text-4xl mb-3">{phase.icon}</div>
              <h2 className="mb-2">{phase.title}</h2>
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
                      ? 'Overdue'
                      : phaseInfo.daysUntilNext === 0
                      ? 'Today'
                      : `${phaseInfo.daysUntilNext} days`}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border"
            >
              <h3 className="mb-4">Cycle Phases</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="text-2xl">🩸</div>
                  <div className="flex-1">
                    <div className="text-sm">Menstrual Phase</div>
                    <div className="text-xs text-muted-foreground">Days 1-5</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="text-2xl">💙</div>
                  <div className="flex-1">
                    <div className="text-sm">Follicular Phase</div>
                    <div className="text-xs text-muted-foreground">Days 6-13</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="text-2xl">🌸</div>
                  <div className="flex-1">
                    <div className="text-sm">Ovulation Phase</div>
                    <div className="text-xs text-muted-foreground">Days 14-16</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="text-2xl">🌙</div>
                  <div className="flex-1">
                    <div className="text-sm">Luteal Phase</div>
                    <div className="text-xs text-muted-foreground">Days 17-28</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
