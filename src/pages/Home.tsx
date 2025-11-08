import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Droplet, Calendar, BookOpen, Settings as SettingsIcon, User, Heart } from 'lucide-react';
import { profileAPI, waterAPI, periodAPI, examsAPI } from '../utils/api';
import { calculateWaterTarget, getPeriodPhase, getDaysUntil } from '../utils/calculations';
import { getDailyQuote } from '../utils/quotes';
import { ReminderCard } from '../components/ReminderCard';
import { QuoteWidget } from '../components/QuoteWidget';
import { ProgressRing } from '../components/ProgressRing';
import { toast } from 'sonner';

const GLASS_SIZE_ML = 250;

export function Home() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [waterLogs, setWaterLogs] = useState<any[]>([]);
  const [periodData, setPeriodData] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const [p, w, e] = await Promise.all([
          profileAPI.get(),
          waterAPI.getToday(today),
          examsAPI.list(),
        ]);


        setProfile(p);

        const normalizedWaterLogs = Array.isArray(w)
          ? [
            {
              glasses: w.reduce((sum, item) => sum + (Number(item["Glasses"]) || 0), 0),
              target_ml: w[0]?.["Target_ml"] || 2000,
              date: w[0]?.["Date (DD-MM-YYYY)"] || today,
            },
          ]
          : [];
        setWaterLogs(normalizedWaterLogs);

        const normalizedExams = Array.isArray(e)
          ? e.map(item => ({
            id: item["id (numeric)"],
            subject: item["Subject"],
            examDate: item["ExamDate (DD-MM-YYYY)"],
            notes: item["Notes"] || '',
          }))
          : [];
        setExams(normalizedExams);

        const gender = (p?.gender ?? p?.Gender ?? '').toLowerCase();
        if (gender === 'female') {
          try {
            const pd = await periodAPI.get();
            setPeriodData(pd);
          } catch {
            console.warn('No period data found yet');
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        toast.error('Failed to load your data 😢');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-blue-100">
        <div className="animate-pulse text-4xl">💞</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-blue-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-10 shadow-xl text-center border border-pink-200"
        >
          <h1 className="text-3xl font-semibold text-rose-600 mb-3">Welcome Sweetu 💖</h1>
          <p className="text-rose-500 mb-6">
            Let’s start by creating your profile, okay papu? 😚
            It’ll help me take care of your hydration and study tracking 💦📚
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-pink-400 to-blue-400 text-blue-500 px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
          >
            Create Profile 💞
          </button>
        </motion.div>
      </div>
    );
  }

  // ----- Derived info -----
  const genderRaw = (profile.gender ?? profile.Gender ?? '').toLowerCase();
  const isFemale = genderRaw === 'female';

  const todayWaterLog = waterLogs[0] || { glasses: 0 };
  const targetMl = todayWaterLog.target_ml || calculateWaterTarget(Number(profile.weight_kg || profile.weight || 60));
  const currentMl = todayWaterLog.glasses * GLASS_SIZE_ML;
  const waterProgress = Math.min((currentMl / targetMl) * 100, 100);

  const lastPeriod =
    periodData?.last_period_date ||
    periodData?.Last_Period_Date ||
    '';
  const cycleLength =
    Number(periodData?.cycle_length || 28);
  const periodInfo = isFemale && lastPeriod
    ? getPeriodPhase(lastPeriod, cycleLength)
    : null;

  const dailyQuote = getDailyQuote();
  const currentUser = localStorage.getItem('currentUser');

  const upcomingExams = exams
    .filter(exam => getDaysUntil(exam.examDate) >= 0)
    .sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())
    .slice(0, 3);



  // ----- UI -----
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-blue-100 pb-24 relative overflow-y-auto">
      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -50],
              opacity: [0.2, 0.7, 0],
            }}
            transition={{
              duration: 12 + Math.random() * 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            💞
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-semibold text-rose-600">
              {currentUser === 'Mrbi'
                ? 'Hi Mrbi 😎💙'
                : currentUser === 'Nilaaaa'
                  ? 'Hi Nilaaaa 💖✨'
                  : 'Hi Sweethearts 💞'}
            </h1>
            <p className="text-rose-500 text-sm">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-pink-200/60 rounded-lg transition-colors"
          >
            <SettingsIcon size={24} className="text-rose-500" />
          </button>
        </motion.div>

        {/* Quote */}
        <QuoteWidget text={`"${dailyQuote.text}"`} author={dailyQuote.author} />

        <br />

        {/* Water */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div
            onClick={() => navigate('/water')}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-pink-200 cursor-pointer hover:border-pink-400 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-pink-400 to-blue-400 p-2.5 rounded-xl">
                  <Droplet className="text-blue-500" size={20} />
                </div>
                <div>
                  <h3 className="text-rose-600">Water Intake 💧</h3>
                  <p className="text-sm text-rose-400">Stay hydrated ammu 😚</p>
                </div>
              </div>
              <ProgressRing
                progress={waterProgress}
                size={80}
                strokeWidth={6}
                color="rgb(236, 72, 153)"
              >
                <div className="text-center text-rose-600 text-sm">
                  {Math.round(waterProgress)}%
                </div>
              </ProgressRing>
            </div>
            <div className="flex items-center justify-between text-sm text-rose-500">
              <span>{todayWaterLog.glasses || 0} glasses ({currentMl}ml)</span>
              <span>Target: {targetMl}ml</span>
            </div>
          </div>
        </motion.div>

        {/* Period (only female) */}
        {isFemale && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            {periodInfo ? (
              <ReminderCard
                icon={Calendar}
                title="Cycle Tracker 🌸"
                description={
                  periodInfo.phase === 'period'
                    ? 'It’s your period time, take rest and stay cozy 🩷'
                    : periodInfo.phase === 'upcoming'
                      ? `Period coming in ${periodInfo.daysUntilNext} days 💫`
                      : periodInfo.phase === 'ovulation'
                        ? 'Ovulation phase – body at peak energy! 💪'
                        : `${periodInfo.daysUntilNext} days until next cycle 🌷`
                }
                color={
                  periodInfo.phase === 'period'
                    ? 'bg-rose-400'
                    : periodInfo.phase === 'ovulation'
                      ? 'bg-green-400'
                      : 'bg-pink-400'
                }
                onClick={() => navigate('/period')}
              />
            ) : (
              <ReminderCard
                icon={Calendar}
                title="Cycle Tracker"
                description="Set your dates to start tracking 🩷"
                color="bg-pink-500"
                onClick={() => navigate('/period')}
              />
            )}
          </motion.div>
        )}

        {/* Study */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          {upcomingExams.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-rose-600">Upcoming Exams 📘</h3>
              {upcomingExams.map((exam, i) => {
                const daysUntil = getDaysUntil(exam.examDate);
                return (
                  <ReminderCard
                    key={i}
                    icon={BookOpen}
                    title={exam.subject}
                    description={
                      daysUntil === 0
                        ? 'Exam today! Good luck papu! 🍀'
                        : daysUntil === 1
                          ? 'Exam tomorrow – final push sweetu 💪'
                          : `Exam in ${daysUntil} days – steady and calm 🌸`
                    }
                    color={
                      daysUntil <= 2
                        ? 'bg-rose-500'
                        : daysUntil <= 7
                          ? 'bg-orange-400'
                          : 'bg-blue-400'
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
              description="No exams yet da papu 💕 plan your studies ✍️"
              color="bg-pink-400"
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
            className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-md border border-pink-200 hover:border-rose-400 transition-colors text-left"
          >
            <User className="mb-2 text-rose-500" size={24} />
            <h4 className="text-rose-600">Profile</h4>
            <p className="text-sm text-rose-400">Edit & View</p>
          </button>

          <button
            onClick={() => navigate('/motivation')}
            className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-4 shadow-lg text-white text-left hover:scale-[1.02] transition-transform"
          >
            <Heart className="mb-2" size={22} />
            <h4 className="text-white">Motivation</h4>
            <p className="text-sm text-white/80">Stay inspired 💞</p>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
