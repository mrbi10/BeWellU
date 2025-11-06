import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Save, ArrowLeft } from 'lucide-react';
import { profileAPI } from '../utils/api';
import { calculateAge } from '../utils/calculations';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'female' as 'male' | 'female' | 'other',
    dob: '',
    height: 0,
    weight: 0,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const loadProfile = async () => {
    try {
      const profile = await profileAPI.get();
      if (profile) {
        const formattedDOB = profile.dob ? formatDateForInput(profile.dob) : '';

        setFormData({
          name: profile.name || '',
          gender: profile.gender || 'female',
          dob: formattedDOB,
          height: profile.height_cm || 0,
          weight: profile.weight_kg || 0,
        });
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await profileAPI.update({
        name: formData.name,
        gender: formData.gender,
        dob: formData.dob,
        height_cm: formData.height,
        weight_kg: formData.weight,
      });
      toast.success('Profile updated successfully!');
      navigate('/');
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const age = formData.dob ? calculateAge(formData.dob) : 0;

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
            <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-2xl">
              <User className="text-white" size={24} />
            </div>
            <h1>User Profile</h1>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                className="mt-2 w-full px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
                className="mt-2"
              />
              {age > 0 && (
                <p className="text-sm text-muted-foreground mt-1">Age: {age} years</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                  placeholder="170"
                  required
                  min="1"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                  placeholder="60"
                  required
                  min="1"
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full gap-2" disabled={saving}>
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
