import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Droplet, Plus, Minus, ArrowLeft } from 'lucide-react';
import { profileAPI, waterAPI } from '../utils/api';
import { calculateWaterTarget } from '../utils/calculations';
import { ProgressRing } from '../components/ProgressRing';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

const GLASS_SIZE_ML = 250;

export function WaterTracker() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [glasses, setGlasses] = useState(0);
  const [targetMl, setTargetMl] = useState(2000);
  const [waterLogs, setWaterLogs] = useState([]);
  const [cuteMessage, setCuteMessage] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const currentMl = glasses * GLASS_SIZE_ML;
  const progress = Math.min((currentMl / targetMl) * 100, 100);

  useEffect(() => {
    loadData();
  }, []);

  // CUTE COMMENT LOGIC 💬
  const updateCuteMessage = (glassCount: number) => {
    if (glassCount === 0) {
      setCuteMessage("Ammu papu drink water da 💦 don’t be naughty 🥺");
    } else if (glassCount < 4) {
      setCuteMessage("Good start baby 💖 keep going, haan good boy 😚");
    } else if (glassCount < 8) {
      setCuteMessage("Thani kudi da sweetu 💧 proud of you 😍");
    } else if (glassCount < 12) {
      setCuteMessage("Waaah my hydration hero 😘💦");
    } else if (glassCount < 16) {
      setCuteMessage("Ammu becoming aqua queen 👑💧");
    } else {
      setCuteMessage("Super da papu 🥳 full hydrated love 💞");
    }
  };

  const loadData = async () => {
    try {
      const profile = await profileAPI.get();
      const target = profile?.weight_kg
        ? calculateWaterTarget(profile.weight_kg)
        : 2000;
      setTargetMl(target);

      const todayLogs = await waterAPI.getToday();

      if (Array.isArray(todayLogs) && todayLogs.length > 0) {
        const grouped = todayLogs.reduce((acc, entry) => {
          let rawDate = entry['Date (DD-MM-YYYY)'];
          let parsedDate;
          if (typeof rawDate === 'string' && rawDate.includes('-') && rawDate.length === 10) {
            const [d, m, y] = rawDate.split('-');
            parsedDate = `${y}-${m}-${d}`;
          } else {
            parsedDate = new Date(rawDate).toISOString().split('T')[0];
          }

          const key = parsedDate;
          acc[key] = {
            date: key,
            glasses: Number(entry.Glasses || 0), 
            targetMl: Number(entry.Target_ml || 2000),
          };
          return acc;
        }, {});


        const combinedLogs = Object.values(grouped);
        const todayData = combinedLogs.find((log) => log.date === today);
        setGlasses(todayData ? todayData.glasses : 0);
        setWaterLogs(combinedLogs);
        updateCuteMessage(todayData ? todayData.glasses : 0);
      } else {
        setGlasses(0);
        setWaterLogs([]);
        updateCuteMessage(0);
      }
    } catch (error) {
      console.error('Failed to load water data:', error);
      toast.error('Failed to load water data 😢');
    } finally {
      setLoading(false);
    }
  };

  const updateWaterLog = async (newGlasses: number) => {
    try {
      await waterAPI.log({
        date: today,
        glasses: newGlasses,
        target_ml: targetMl,
      });
      setGlasses(newGlasses);
      updateCuteMessage(newGlasses);
    } catch (error) {
      console.error('Failed to update water log:', error);
      toast.error('Failed to update water intake 💧');
    }
  };

  const addGlass = () => {
    if (glasses < 20) updateWaterLog(glasses + 1);
  };

  const removeGlass = () => {
    if (glasses > 0) updateWaterLog(glasses - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-50 to-rose-100">
        <div className="animate-pulse text-4xl">💖💧</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-blue-100 px-4 pb-24 relative overflow-hidden">
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
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-rose-200/60 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-rose-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-pink-400 to-blue-400 p-3 rounded-2xl shadow-md">
              <Droplet className="text-blue-500" size={24} />
            </div>
            <h1 className="text-xl font-semibold text-rose-600">Water Tracker 💕</h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-md border border-pink-200 text-center"
        >
          <div className="flex justify-center mb-6">
            <ProgressRing
              progress={progress}
              size={180}
              strokeWidth={12}
              color="rgb(236, 72, 153)"
            >
              <div className="text-center">
                <div className="text-3xl text-rose-600 mb-1">
                  {Math.round(progress)}%
                </div>
                <div className="text-sm text-rose-400">
                  {currentMl}ml / {targetMl}ml
                </div>
              </div>
            </ProgressRing>
          </div>

          <div className="text-md font-medium text-rose-600 mb-4 animate-pulse">
            {cuteMessage}
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <Button
              onClick={removeGlass}
              disabled={glasses === 0}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-pink-400 text-rose-500 hover:bg-pink-100"
            >
              <Minus size={20} />
            </Button>

            <div className="text-center min-w-[100px]">
              <div className="text-4xl text-rose-600 mb-1">{glasses}</div>
              <div className="text-sm text-rose-400">glasses</div>
            </div>

            <Button
              onClick={addGlass}
              disabled={glasses >= 20}
              size="icon"
              className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-400 to-blue-400 hover:from-rose-400 hover:to-blue-500 text-pink-500"
            >
              <Plus size={20} />
            </Button>
          </div>

          <p className="text-sm text-rose-500">
            Each glass = {GLASS_SIZE_ML}ml 💧
          </p>
        </motion.div>

        {/* Recent History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-gradient-to-br from-pink-50 to-blue-50 rounded-2xl p-6 border border-pink-200 shadow-sm"
        >
          <h3 className="text-rose-600 mb-3">💦 Cute History (Last 7 days)</h3>
          <div className="space-y-2">
            {waterLogs
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 7)
              .map((log) => {
                const logProgress = Math.min(
                  (log.glasses * GLASS_SIZE_ML / log.targetMl) * 100,
                  100
                );
                return (
                  <div key={log.date} className="flex items-center gap-3">
                    <div className="text-sm text-rose-500 w-24">
                      {new Date(log.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="flex-1 bg-rose-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-rose-500 h-full transition-all"
                        style={{ width: `${logProgress}%` }}
                      />
                    </div>
                    <div className="text-sm text-rose-600 w-16 text-right">
                      {log.glasses} 🥤
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
