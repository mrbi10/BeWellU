import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Save, ArrowLeft, User } from 'lucide-react';
import { profileAPI } from '../utils/api';
import { calculateAge } from '../utils/calculations';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import Select from "react-select";

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    background: "rgba(255, 255, 255, 0.85)",
    borderRadius: "1rem",
    borderColor: state.isFocused ? "#fb7185" : "#fbcfe8",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(251, 113, 133, 0.4)"
      : "none",
    padding: "2px 4px",
    transition: "all 0.2s ease",
    "&:hover": {
      borderColor: "#fb7185",
    },
  }),
  option: (base, state) => ({
    ...base,
    background: state.isSelected
      ? "linear-gradient(90deg, #f9a8d4 0%, #bfdbfe 100%)"
      : state.isFocused
        ? "rgba(251, 113, 133, 0.1)"
        : "white",
    color: state.isSelected ? "#ffffff" : "#fb7185",
    fontWeight: "500",
    borderRadius: "0.5rem",
    padding: "8px 12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fb7185",
    fontWeight: "500",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#fda4af",
    fontWeight: "400",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#fb7185",
    "&:hover": { color: "#f43f5e" },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: "1rem",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(251, 113, 133, 0.2)",
    marginTop: "8px",
  }),
};




export function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    partnerName: '',
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
        console.log(profile);
        const formattedDOB = profile.DOB ? formatDateForInput(profile.DOB) : '';
        setFormData({
          name: profile.Name || '',
          partnerName: profile.PartnerName || '',
          gender: profile.Gender || 'female',
          dob: formattedDOB,
          height: profile.Height_cm || 0,
          weight: profile.Weight_kg || 0,
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
        partnerName: formData.partnerName,
        gender: formData.gender,
        dob: formData.dob,
        height_cm: formData.height,
        weight_kg: formData.weight,
      });
      toast.success('Profile updated with love ❤️');
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
        <div className="relative">
          <div className="animate-bounce text-rose-400 text-5xl">💞</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 px-4 pb-24 overflow-hidden relative">
      {/* floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-300 opacity-40"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 1 + 0.5,
            }}
            animate={{
              y: [null, -50],
              opacity: [0.3, 0.8, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            💖
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
            <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-3 rounded-2xl shadow-md">
              <Heart className="text-blue" size={24} />
            </div>
            <h1 className="text-2xl font-semibold text-rose-600">Our Lovely Profile</h1>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-pink-200 space-y-5">
            <div>
              <Label htmlFor="name" className="text-rose-700">Your Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                required
                className="mt-2 border-pink-200 focus:ring-rose-400"
              />
            </div>

            <div>
              <Label htmlFor="partnerName" className="text-rose-700">Partner’s Name</Label>
              <Input
                id="partnerName"
                type="text"
                value={formData.partnerName}
                onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                placeholder="Enter your partner’s name"
                className="mt-2 border-pink-200 focus:ring-rose-400"
              />
            </div>


            <div className="mt-2">
              <label className="text-rose-500 text-sm font-medium mb-1 block">
                Gender 🌸
              </label>
              <Select
                options={genderOptions}
                value={genderOptions.find((opt) => opt.value === formData.gender)}
                onChange={(selected) =>
                  setFormData({
                    ...formData,
                    gender: selected?.value as "male" | "female" | "other",
                  })
                }
                styles={customStyles}
                placeholder="🌷 Choose gender"
                isSearchable={false}
              />
            </div>



            <div>
              <Label htmlFor="dob" className="text-rose-700">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
                className="mt-2 border-pink-200 focus:ring-rose-400"
              />
              {age > 0 && (
                <p className="text-sm text-rose-500 mt-1">Age: {age} years</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height" className="text-rose-700">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, height: Number(e.target.value) })
                  }
                  placeholder="170"
                  required
                  min="1"
                  className="mt-2 border-pink-200 focus:ring-rose-400"
                />
              </div>
              <div>
                <Label htmlFor="weight" className="text-rose-700">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: Number(e.target.value) })
                  }
                  placeholder="60"
                  required
                  min="1"
                  className="mt-2 border-pink-200 focus:ring-rose-400"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gap-2 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-rose-500 hover:to-pink-400 text-blue-500 font-medium rounded-xl shadow-md"
            disabled={saving}
          >
            <Save size={20} />
            {saving ? 'Saving your love...' : 'Save Together ❤️'}
          </Button>
        </motion.form>

        <div className="mt-10 text-center text-rose-500">
          <p className="text-sm italic">
            “Love isn’t about how many days, months, or years you’ve been together.
            It’s about how much you love each other every single day.”
          </p>
        </div>
      </div>
    </div>
  );
}
