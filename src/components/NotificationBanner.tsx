import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { requestNotificationPermission } from '../utils/pwa';

export function NotificationBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if notifications are supported and not already granted/denied
    if ('Notification' in window && Notification.permission === 'default') {
      const dismissed = localStorage.getItem('notificationBannerDismissed');
      if (!dismissed) {
        // Show banner after 5 seconds
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleEnable = async () => {
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      console.log('Notifications enabled');
    }
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto"
        >
          <div className="bg-card rounded-2xl p-4 shadow-2xl border border-border">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
                <Bell className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h4 className="mb-1">Enable Notifications</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get reminders for water intake and upcoming exams.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleEnable}
                    size="sm"
                  >
                    Enable
                  </Button>
                  <Button
                    onClick={handleDismiss}
                    size="sm"
                    variant="ghost"
                  >
                    Not now
                  </Button>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-accent rounded-lg transition-colors flex-shrink-0"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
