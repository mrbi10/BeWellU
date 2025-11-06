import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Droplet, Plus, Minus, ArrowLeft } from 'lucide-react';
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

 


  const today = new Date().toISOString().split('T')[0];
  const currentMl = glasses * GLASS_SIZE_ML;
  const progress = Math.min((currentMl / targetMl) * 100, 100);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load profile to get weight for water target calculation
      const profile = await profileAPI.get();
      const target = profile?.weight_kg ? calculateWaterTarget(profile.weight_kg) : 2000;
      setTargetMl(target);

      // Load today's water log
      const todayLog = await waterAPI.getToday();
      if (todayLog) {
        setGlasses(todayLog.glasses || 0);
      }
    } catch (error) {
      console.error('Failed to load water data:', error);
      toast.error('Failed to load water data');
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

    } catch (error) {
      console.error('Failed to update water log:', error);
      toast.error('Failed to update water intake');
    }
  };

  const addGlass = () => {
    if (glasses < 20) {
      updateWaterLog(glasses + 1);
    }
  };

  const removeGlass = () => {
    if (glasses > 0) {
      updateWaterLog(glasses - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-2xl">
              <Droplet className="text-white" size={24} />
            </div>
            <h1>Water Tracker</h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center"
        >
          <div className="flex justify-center mb-6">
            <ProgressRing progress={progress} size={180} strokeWidth={12} color="rgb(59, 130, 246)">
              <div className="text-center">
                <div className="text-3xl text-foreground mb-1">{Math.round(progress)}%</div>
                <div className="text-sm text-muted-foreground">
                  {currentMl}ml / {targetMl}ml
                </div>
              </div>
            </ProgressRing>
          </div>

          <div className="flex items-center justify-center gap-6 mb-6">
            <Button
              onClick={removeGlass}
              disabled={glasses === 0}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
            >
              <Minus size={20} />
            </Button>

            <div className="text-center min-w-[100px]">
              <div className="text-4xl text-foreground mb-1">{glasses}</div>
              <div className="text-sm text-muted-foreground">glasses</div>
            </div>

            <Button
              onClick={addGlass}
              disabled={glasses >= 20}
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600"
            >
              <Plus size={20} className="text-white" />
            </Button>
          </div>

          <p className="text-muted-foreground text-sm">
            Each glass = {GLASS_SIZE_ML}ml
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <h3 className="text-blue-700 dark:text-blue-300 mb-2">💧 Stay Hydrated!</h3>
          <p className="text-blue-600 dark:text-blue-400 text-sm">
            Drinking enough water helps improve focus, energy levels, and overall health.
            Try to drink consistently throughout the day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 bg-card rounded-2xl p-4 shadow-sm border border-border"
        >
          <h3 className="mb-3">Recent History</h3>
          <div className="space-y-2">
            {waterLogs
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 7)
              .map((log) => {
                const logProgress = Math.min((log.glasses * GLASS_SIZE_ML / log.targetMl) * 100, 100);
                return (
                  <div key={log.date} className="flex items-center gap-3">
                    <div className="text-sm text-muted-foreground w-24">
                      {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all"
                        style={{ width: `${logProgress}%` }}
                      />
                    </div>
                    <div className="text-sm text-foreground w-16 text-right">
                      {log.glasses} glasses
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
