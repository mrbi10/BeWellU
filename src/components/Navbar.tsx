import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Home,
  Droplet,
  Calendar,
  BookOpen,
  Sparkles,
  User,
} from 'lucide-react';
import { profileAPI } from '../utils/api';

export function Navbar() {
  const location = useLocation();
  const [isFemale, setIsFemale] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const profile = await profileAPI.get();
        const gender = (profile?.gender ?? profile?.Gender ?? '').toString().toLowerCase();
        setIsFemale(gender === 'female');
      } catch (err) {
        console.error('Failed to load profile in navbar:', err);
      }
    })();
  }, []);

  const navItems = [
    { path: '/', icon: Home, label: 'Home', color: 'from-pink-400 to-rose-400' },
    { path: '/water', icon: Droplet, label: 'Water', color: 'from-blue-400 to-cyan-400' },
    ...(isFemale
      ? [{ path: '/period', icon: Calendar, label: 'Period', color: 'from-red-400 to-pink-400' }]
      : []),
    { path: '/study', icon: BookOpen, label: 'Study', color: 'from-violet-400 to-purple-400' },
    { path: '/motivation', icon: Sparkles, label: 'Quotes', color: 'from-yellow-400 to-pink-400' },
    { path: '/profile', icon: User, label: 'Profile', color: 'from-teal-400 to-green-400' },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-pink-100 px-4 py-2 w-[95%] max-w-lg z-50">
      <div className="flex justify-around items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl group"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl shadow-md`}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <motion.div
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="relative z-10 flex flex-col items-center"
              >
                <Icon
                  className={`transition-colors ${
                    isActive ? 'text-blue-500 drop-shadow-md' : 'text-pink-400 group-hover:text-rose-500'
                  }`}
                  size={22}
                />
                <span
                  className={`text-[10px] transition-colors font-medium ${
                    isActive ? 'text-blue-500' : 'text-pink-400 group-hover:text-rose-500'
                  }`}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
