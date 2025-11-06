import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Moon, Sun, Trash2, ArrowLeft } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

export function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all app data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

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
            <div className="bg-gradient-to-br from-gray-500 to-gray-700 p-3 rounded-2xl">
              <SettingsIcon className="text-white" size={24} />
            </div>
            <h1>Settings</h1>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6"
        >
          <h3 className="mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="text-muted-foreground" size={20} />
              ) : (
                <Sun className="text-muted-foreground" size={20} />
              )}
              <div>
                <Label htmlFor="theme-toggle">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  {theme === 'dark' ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-sm border border-border mb-6"
        >
          <h3 className="mb-4">Data Management</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <Trash2 className="text-destructive mt-0.5" size={20} />
              <div className="flex-1">
                <h4 className="text-destructive mb-1">Clear All Data</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  This will permanently delete all your profile data, water logs, period tracking, 
                  and study plans. This action cannot be undone.
                </p>
                <Button
                  onClick={handleClearData}
                  variant="destructive"
                  size="sm"
                >
                  Clear All Data
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-sm border border-border"
        >
          <h3 className="mb-4">About</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Last Updated</span>
              <span>November 2025</span>
            </div>
            <div className="pt-3 border-t border-border">
              <p>
                Wellness & Study Companion is your personal assistant for health tracking 
                and academic planning. All data is stored locally on your device.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
