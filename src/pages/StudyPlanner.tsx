import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Plus, ArrowLeft } from 'lucide-react';
import { examsAPI } from '../utils/api';
import { StudyCard } from '../components/StudyCard';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { getDaysUntil } from '../utils/calculations';
import { toast } from 'sonner@2.0.3';

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
      setExams(data);
    } catch (error) {
      console.error('Failed to load exams:', error);
      toast.error('Failed to load exams');
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
      toast.success('Exam added successfully!');
    } catch (error) {
      console.error('Failed to add exam:', error);
      toast.error('Failed to add exam');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExam = async (id: number) => {
    try {
      await examsAPI.delete(id);
      setExams(exams.filter(exam => exam.id !== id));
      toast.success('Exam deleted successfully!');
    } catch (error) {
      console.error('Failed to delete exam:', error);
      toast.error('Failed to delete exam');
    }
  };

  const sortedExams = [...exams].sort((a, b) => 
    new Date(a.exam_date).getTime() - new Date(b.exam_date).getTime()
  );

  const upcomingExams = sortedExams.filter(exam => getDaysUntil(exam.exam_date) >= 0);
  const pastExams = sortedExams.filter(exam => getDaysUntil(exam.exam_date) < 0);

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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-accent rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-2xl">
                <BookOpen className="text-white" size={24} />
              </div>
              <h1>Study Planner</h1>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            size="icon"
            className="rounded-full bg-orange-500 hover:bg-orange-600"
          >
            <Plus size={20} className="text-white" />
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
                className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-4"
              >
                <h3>Add New Exam</h3>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics"
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="examDate">Exam Date</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? 'Adding...' : 'Add Exam'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
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
            <h2 className="mb-4">Upcoming Exams</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {upcomingExams.map((exam) => (
                  <StudyCard
                    key={exam.id}
                    exam={exam}
                    onDelete={handleDeleteExam}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {pastExams.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4 text-muted-foreground">Past Exams</h3>
            <div className="space-y-3 opacity-60">
              <AnimatePresence>
                {pastExams.map((exam) => (
                  <StudyCard
                    key={exam.id}
                    exam={exam}
                    onDelete={handleDeleteExam}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {exams.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-12 shadow-sm border border-border text-center"
          >
            <BookOpen className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="mb-2">No Exams Added</h3>
            <p className="text-muted-foreground mb-6">
              Add your upcoming exams to stay organized and get timely reminders.
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus size={20} />
              Add Your First Exam
            </Button>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800"
        >
          <h3 className="text-orange-700 dark:text-orange-300 mb-2">📚 Study Tips</h3>
          <ul className="text-orange-600 dark:text-orange-400 text-sm space-y-2">
            <li>• Start studying at least 1-2 weeks before the exam</li>
            <li>• Break study sessions into manageable chunks</li>
            <li>• Review material regularly instead of cramming</li>
            <li>• Take breaks to maintain focus and retention</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
