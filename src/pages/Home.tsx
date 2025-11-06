import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Droplet, Calendar, BookOpen, Settings as SettingsIcon, User } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { UserProfile, WaterLog, PeriodData, Exam } from '../types';
import { calculateWaterTarget, getPeriodPhase, getDaysUntil } from '../utils/calculations';
import { getDailyQuote } from '../utils/quotes';
import { ReminderCard } from '../components/ReminderCard';
import { QuoteWidget } from '../components/QuoteWidget';
import { ProgressRing } from '../components/ProgressRing';

const GLASS_SIZE_ML = 250;

export function Home() {
  const navigate = useNavigate();
  const [profile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [waterLogs] = useLocalStorage<WaterLog[]>('waterLogs', []);
  const [periodData] = useLocalStorage<PeriodData | null>('periodData', null);
  const [exams] = useLocalStorage<Exam[]>('exams', []);

  const today = new Date().toISOString().split('T')[0];
  const todayWaterLog = waterLogs.find(log => log.date === today);
  const dailyQuote = getDailyQuote();

  // Water progress
  const targetMl = profile ? calculateWaterTarget(profile.weight) : 2000;
  const currentMl = todayWaterLog ? todayWaterLog.glasses * GLASS_SIZE_ML : 0;
  const waterProgress = Math.min((currentMl / targetMl) * 100, 100);

  // Period info
  const periodInfo = periodData && profile?.gender === 'female' 
    ? getPeriodPhase(periodData.lastPeriodDate, periodData.cycleLength)
    : null;

  // Upcoming exams
  const upcomingExams = exams
    .filter(exam => getDaysUntil(exam.examDate) >= 0)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
    .slice(0, 3);

  // Check if profile is complete
  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4">
        <div className="max-w-2xl mx-auto pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-8 shadow-lg text-white text-center"
          >
            <h1 className="mb-4 text-white">Welcome! 👋</h1>
            <p className="mb-6 text-white/90">
              Let's get started by setting up your profile. This will help us personalize 
              your wellness and study experience.
            </p>
            <button
              onClick={() => navigate('/profile')}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
            >
              Create Profile
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1>Hello, {profile.name}! 👋</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <SettingsIcon size={24} />
          </button>
        </motion.div>

        {/* Daily Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <QuoteWidget text={dailyQuote.text} author={dailyQuote.author} />
        </motion.div>

        {/* Water Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div 
            onClick={() => navigate('/water')}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2.5 rounded-xl">
                  <Droplet className="text-white" size={20} />
                </div>
                <div>
                  <h3>Water Intake</h3>
                  <p className="text-sm text-muted-foreground">Today's hydration</p>
                </div>
              </div>
              <ProgressRing progress={waterProgress} size={80} strokeWidth={6} color="rgb(59, 130, 246)">
                <div className="text-center">
                  <div className="text-sm">{Math.round(waterProgress)}%</div>
                </div>
              </ProgressRing>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {todayWaterLog?.glasses || 0} glasses ({currentMl}ml)
              </span>
              <span className="text-muted-foreground">
                Target: {targetMl}ml
              </span>
            </div>
          </div>
        </motion.div>

        {/* Period Tracker (Female only) */}
        {profile.gender === 'female' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            {periodInfo ? (
              <ReminderCard
                icon={Calendar}
                title="Period Tracker"
                description={
                  periodInfo.phase === 'period'
                    ? 'Period phase - Take care of yourself'
                    : periodInfo.phase === 'upcoming'
                    ? `Period in ${periodInfo.daysUntilNext} days - Be prepared!`
                    : periodInfo.phase === 'ovulation'
                    ? 'Ovulation phase'
                    : `${periodInfo.daysUntilNext} days until next period`
                }
                color={
                  periodInfo.phase === 'period' || periodInfo.phase === 'upcoming'
                    ? 'bg-red-500'
                    : periodInfo.phase === 'ovulation'
                    ? 'bg-green-500'
                    : 'bg-blue-500'
                }
                onClick={() => navigate('/period')}
              />
            ) : (
              <ReminderCard
                icon={Calendar}
                title="Period Tracker"
                description="Set up your cycle to get predictions"
                color="bg-pink-500"
                onClick={() => navigate('/period')}
              />
            )}
          </motion.div>
        )}

        {/* Study Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          {upcomingExams.length > 0 ? (
            <div className="space-y-3">
              <h3>Upcoming Exams</h3>
              {upcomingExams.map((exam, index) => {
                const daysUntil = getDaysUntil(exam.examDate);
                return (
                  <ReminderCard
                    key={exam.id}
                    icon={BookOpen}
                    title={exam.subject}
                    description={
                      daysUntil === 0
                        ? 'Exam today! Good luck! 🍀'
                        : daysUntil === 1
                        ? 'Exam tomorrow - Final review!'
                        : `Exam in ${daysUntil} days - Keep studying!`
                    }
                    color={
                      daysUntil <= 2
                        ? 'bg-red-500'
                        : daysUntil <= 7
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                    }
                    onClick={() => navigate('/study')}
                  />
                );
              })}
            </div>
          ) : (
            <ReminderCard
              icon={BookOpen}
              title="Study Planner"
              description="Add your upcoming exams to stay organized"
              color="bg-orange-500"
              onClick={() => navigate('/study')}
            />
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <button
            onClick={() => navigate('/profile')}
            className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:border-primary transition-colors text-left"
          >
            <User className="mb-2 text-muted-foreground" size={24} />
            <h4>Profile</h4>
            <p className="text-sm text-muted-foreground">View & edit</p>
          </button>
          <button
            onClick={() => navigate('/motivation')}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 shadow-lg text-white text-left"
          >
            <span className="text-2xl mb-2 block">✨</span>
            <h4 className="text-white">Motivation</h4>
            <p className="text-sm text-white/80">Daily quotes</p>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
