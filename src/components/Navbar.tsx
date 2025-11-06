import { Link, useLocation } from 'react-router-dom';
import { Home, Droplet, Calendar, BookOpen, Sparkles, User, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export function Navbar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/water', icon: Droplet, label: 'Water' },
    { path: '/period', icon: Calendar, label: 'Period' },
    { path: '/study', icon: BookOpen, label: 'Study' },
    { path: '/motivation', icon: Sparkles, label: 'Quotes' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="max-w-screen-lg mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors hover:bg-accent"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-accent rounded-lg"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon 
                  className={`relative z-10 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                  size={20} 
                />
                <span className={`relative z-10 text-[10px] transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
