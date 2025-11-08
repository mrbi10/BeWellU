import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, BookOpen, Plus, ArrowLeft } from 'lucide-react';
import { examsAPI } from '../utils/api';
import { StudyCard } from '../components/StudyCard';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { getDaysUntil } from '../utils/calculations';
import { toast } from 'sonner';

interface Exam {
  id: number;
  subject: string;
  exam_date: string;
  notes?: string;
}

export function StudyPlanner() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadExams();
  }, []);

const loadExams = async () => {
  try {
    const data = await examsAPI.list();
    console.log("Raw exam data:", data);

    const normalized = Array.isArray(data)
      ? data.map((item, i) => {
          const rawDate =
            item.exam_date ||
            item["Exam Date"] ||
            item["ExamDate"] ||
            item["ExamDate (DD-MM-YYYY)"] ||
            "";

          let formattedDate = "";

          if (rawDate) {
            try {
              const dateObj = new Date(rawDate);
              if (!isNaN(dateObj.getTime())) {
                formattedDate = dateObj.toISOString().split("T")[0];
              }
            } catch (e) {
              console.error("Date parse failed for", rawDate);
            }
          }

          return {
            id: Number(item.id || item["id"] || item["id (numeric)"] || i + 1),
            subject: item.subject || item.Subject || "Unknown Subject",
            exam_date: formattedDate,
            notes: item.notes || item.Notes || "",
          };
        })
      : [];

    console.log("✅ Normalized exams:", normalized);
    console.table(normalized);
    setExams(normalized);
  } catch (error) {
    console.error("Failed to load exams:", error);
    toast.error("Failed to load exams 😢");
  } finally {
    setLoading(false);
  }
};


  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newExam = await examsAPI.create({
        subject,
        exam_date: examDate,
      });
      setExams([...exams, newExam]);
      setSubject('');
      setExamDate('');
      setShowForm(false);
      toast.success('Yay! Exam added successfully 💕');
    } catch (error) {
      console.error('Failed to add exam:', error);
      toast.error('Could not add exam 😭');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExam = async (id: number) => {
    try {
      await examsAPI.delete(id);
      setExams(exams.filter(exam => exam.id !== id));
      toast.success('Exam deleted 💔');
    } catch (error) {
      console.error('Failed to delete exam:', error);
      toast.error('Could not delete exam 😿');
    }
  };

  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
  );

   const upcomingExams = sortedExams.filter(exam => getDaysUntil(exam.exam_date) >= 0);
  const pastExams = sortedExams.filter(exam => getDaysUntil(exam.exam_date) < 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-orange-50 to-rose-100">
        <div className="animate-pulse text-4xl">📚💖</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-50 to-rose-100 px-4 pb-24 relative overflow-hidden">
      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 opacity-40"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -80],
              opacity: [0.3, 0.9, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            💞
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto pt-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-rose-200/60 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-rose-500" />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-rose-400 to-orange-400 p-3 rounded-2xl shadow-md">
                <BookOpen className="text-blue-500" size={24} />
              </div>
              <h1 className="text-xl font-semibold text-rose-600">
                Study Planner 💕
              </h1>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="icon"
            className="rounded-full bg-gradient-to-br from-pink-400 to-orange-400 hover:from-rose-400 hover:to-orange-500 text-blue-500 shadow-md"
          >
            <Plus size={20} />
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <form
                onSubmit={handleAddExam}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-rose-200 space-y-4"
              >
                <h3 className="text-rose-600 font-medium mb-2">Add New Exam ✍️</h3>
                <div>
                  <Label htmlFor="subject" className="text-rose-500">
                    Subject 💕
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics"
                    required
                    className="mt-2 border-pink-200 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <Label htmlFor="examDate" className="text-rose-500">
                    Exam Date 📅
                  </Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                    className="mt-2 border-pink-200 focus:ring-rose-400"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-br from-rose-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-blue-500 shadow-md"
                    disabled={submitting}
                  >
                    {submitting ? 'Adding...' : 'Add Exam '}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gradient-to-br from-rose-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-blue-500 shadow-md"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {upcomingExams.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-4 text-rose-600 font-medium">💞 Upcoming Exams</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {upcomingExams.map((exam) => (
                  <StudyCard key={exam.id} exam={exam} onDelete={handleDeleteExam} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {pastExams.length > 0 && (
          <div className="mb-6 opacity-80">
            <h3 className="mb-4 text-rose-400 font-medium">📖 Past Exams</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {pastExams.map((exam) => (
                  <StudyCard key={exam.id} exam={exam} onDelete={handleDeleteExam} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {exams.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-12 shadow-md border border-pink-200 text-center"
          >
            <BookOpen className="mx-auto mb-4 text-rose-400" size={48} />
            <h3 className="mb-2 text-rose-600">No Exams Added 💔</h3>
            <p className="text-rose-400 mb-6">
              Add your upcoming exams, baby 💕 stay focused and ace them together!
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="gap-2 bg-gradient-to-r from-pink-400 to-orange-400 text-white hover:from-pink-500 hover:to-orange-500"
            >
              <Plus size={20} />
              Add Your First Exam 💪
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-6 border border-rose-200 shadow-sm"
        >
          <h3 className="text-rose-600 mb-2">💡 Study Tips</h3>
          <ul className="text-rose-500 text-sm space-y-2">
            <li>• Read a little every day, sweetu 💕</li>
            <li>• Short breaks = sharp mind ✨</li>
            <li>• Drink water and smile while studying 💧</li>
            <li>• Ammu papu always study smart, not hard 🥰</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
