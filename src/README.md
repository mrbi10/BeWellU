# Wellness & Study Companion

A mobile-first Progressive Web App (PWA) that helps you track your wellness and manage your study schedule. Built with React, TypeScript, and Tailwind CSS.

## Features

### 🧑 User Profile
- Store personal information (name, gender, DOB, height, weight)
- Calculate age automatically
- Data stored locally and used for personalization

### 💧 Water Tracker
- Calculate daily water target based on weight (weight × 35ml)
- Log water intake in glasses (250ml each)
- Visual progress ring showing daily completion
- Track history of past water intake
- Service worker reminders (hourly notifications)

### 📅 Period Tracker (Female Users)
- Input last period date and cycle length
- Predict next period date
- Identify cycle phases (period, safe, ovulation, upcoming)
- Alerts for upcoming periods
- Visual phase indicators with helpful messages

### 📚 Study Planner
- Add exams with subject and date
- Automatic reminders 1-2 days before exams
- Color-coded urgency (red for urgent, orange for soon, blue for later)
- Track upcoming and past exams
- Delete completed exams

### ✨ Motivation Widget
- Daily rotating motivational quotes
- 15+ curated quotes for wellness and productivity
- Browse all quotes
- Refresh to get random quotes

### 🏠 Home Dashboard
- Centralized overview of all features
- Quick access to water progress
- Period alerts for female users
- Upcoming exam reminders
- Daily motivational quote
- Quick navigation cards

### ⚙️ Settings
- Light/Dark theme toggle
- Clear all data option
- App information
- About section

### 📱 PWA Features
- Installable on mobile and desktop
- Offline functionality with service workers
- Push notifications for reminders
- App shortcuts for quick access
- Standalone app experience

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Motion (Framer Motion) for animations
- Lucide React for icons
- Sonner for toast notifications

**Storage:**
- LocalStorage for data persistence
- All data stored locally on device

**PWA:**
- Service Workers for offline support
- Web App Manifest for installation
- Push Notifications API

## Getting Started

1. **Setup Profile**: Create your profile with basic information
2. **Track Water**: Log your daily water intake
3. **Period Tracking** (Female): Set up your cycle information
4. **Add Exams**: Plan your study schedule
5. **Get Motivated**: Read daily quotes for inspiration

## Data Privacy

- All data is stored locally on your device
- No data is sent to external servers
- You can clear all data anytime from Settings
- No account or login required

## Installation

### As a PWA:
1. Visit the app in your mobile browser
2. Look for "Install App" prompt or "Add to Home Screen"
3. Follow the installation steps
4. Access the app from your home screen

### For Development:
```bash
npm install
npm run dev
```

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (iOS 11.3+)
- Opera

## Future Enhancements

- AI-based personalized tips
- Google Sign-In for cloud sync
- Charts and graphs for progress tracking
- Export data functionality
- Custom reminder schedules
- Integration with fitness trackers
- Meal and exercise tracking

## Notes

- Designed for mobile-first experience
- Fully responsive for all screen sizes
- Works offline after first visit
- Notifications require permission

## Version

1.0.0 - November 2025
