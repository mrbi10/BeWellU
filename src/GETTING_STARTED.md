# Getting Started

Welcome to your Wellness & Study Companion! This guide will help you set up and use the app.

## First Time Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 3. Create Your Profile

When you first open the app:
- Click "Create Profile"
- Fill in your information:
  - Name
  - Gender (important for period tracker feature)
  - Date of Birth (auto-calculates age)
  - Height (in cm)
  - Weight (in kg - used for water intake calculation)
- Click "Save Profile"

## Main Features

### 🏠 Home Dashboard

Your central hub showing:
- Daily motivational quote
- Water intake progress
- Period tracker status (female users)
- Upcoming exam reminders
- Quick access to all features

**Tip**: The home screen updates in real-time as you log data!

### 💧 Water Tracker

Track your daily hydration:
- Target calculated automatically: **weight (kg) × 35ml**
- Each glass = 250ml
- Click **+** to add a glass
- Click **-** to remove a glass
- View 7-day history

**Example**: If you weigh 60kg, your target is 2,100ml (about 8-9 glasses)

**Reminders**: Enable notifications to get hourly water reminders!

### 📅 Period Tracker (Female Users Only)

Track your menstrual cycle:
- Enter your last period start date
- Set your average cycle length (typically 28 days)
- App calculates:
  - Next period date
  - Current phase (period, safe, ovulation, upcoming)
  - Days until next period
- Get alerts 2-3 days before period

**Privacy**: All data stored locally on your device!

### 📚 Study Planner

Organize your exams:
- Click **+** to add an exam
- Enter subject name and date
- View upcoming exams sorted by date
- Color-coded urgency:
  - 🔴 Red: 0-2 days (urgent!)
  - 🟠 Orange: 3-7 days (soon)
  - 🔵 Blue: 8+ days (plenty of time)
- Delete exams after completion

**Tip**: Add exams as soon as you know the dates for better planning!

### ✨ Motivation

Daily inspiration:
- One quote rotates daily automatically
- Click "Get Another Quote" for random inspiration
- Browse all 15+ curated quotes
- Click any quote to feature it

**Use Case**: Read a quote every morning to start your day positively!

### ⚙️ Settings

Customize your experience:
- **Dark Mode**: Toggle between light and dark themes
- **Clear Data**: Reset app (use carefully!)
- **About**: View app version and info

## Installation as PWA

### On Mobile (Android/iOS):

1. Open the app in Chrome (Android) or Safari (iOS)
2. Look for "Add to Home Screen" prompt
3. Or tap menu (⋮) → "Install app" or "Add to Home Screen"
4. App icon appears on your home screen
5. Open like any native app!

### On Desktop:

1. Open app in Chrome/Edge
2. Look for install icon in address bar
3. Or click menu → "Install Wellness App"
4. App opens in its own window

**Benefits**:
- Works offline after installation
- Faster loading
- No browser UI (feels like native app)
- Can receive notifications

## Enabling Notifications

To get water and study reminders:

1. Look for the notification banner (appears after 5 seconds)
2. Click "Enable"
3. Allow notifications in browser prompt
4. You'll receive:
   - Hourly water reminders (during daytime)
   - Study reminders 1-2 days before exams
   - Period alerts 2-3 days before cycle

**Note**: Notifications only work if app is installed as PWA!

## Daily Workflow

### Morning Routine:
1. ☀️ Open app and read daily motivation quote
2. 💧 Log your morning water intake
3. 📅 Check period tracker (if applicable)
4. 📚 Review today's study schedule

### Throughout the Day:
- Log water intake after each glass
- Add new exams as you learn about them
- Check reminders

### Evening:
- Review water intake goal completion
- Check tomorrow's study schedule
- Read another motivational quote

## Tips & Best Practices

### Water Tracking:
- ✅ Log water immediately after drinking
- ✅ Keep app accessible on home screen
- ✅ Aim for consistent intake throughout day
- ❌ Don't try to drink all at once at end of day

### Period Tracking:
- ✅ Update immediately when period starts
- ✅ Track for 2-3 cycles to verify cycle length
- ✅ Adjust cycle length if predictions are off
- ❌ Don't rely solely for contraception

### Study Planning:
- ✅ Add exams as soon as announced
- ✅ Check dashboard daily
- ✅ Start studying when reminder appears
- ✅ Delete exams after completion to declutter

## Data & Privacy

### Where is my data stored?
- **Locally** on your device using browser localStorage
- **No cloud sync** (unless you add backend later)
- **No account required**

### Is my data secure?
- Only accessible on your device
- Not sent to any server
- Private and confidential

### Can I export my data?
- Currently: No built-in export
- Future feature: Planned for later versions
- Workaround: Browser's localStorage can be inspected via DevTools

### What if I clear browser data?
- ⚠️ All app data will be lost
- No recovery possible
- Use Settings → Clear Data for intentional reset only

## Troubleshooting

### App not loading?
- Check internet connection (first load only)
- Clear browser cache
- Try different browser (Chrome/Edge recommended)

### Notifications not working?
- Install app as PWA first
- Check browser notification permissions
- Check device notification settings
- Make sure "Do Not Disturb" is off

### Dark mode not working?
- Go to Settings
- Toggle "Dark Mode" switch
- Refresh if needed

### Water progress not updating?
- Make sure you're clicking +/- buttons
- Check if correct date is selected
- Refresh the page

### Period predictions wrong?
- Adjust your cycle length in Period Tracker
- Track for 2-3 cycles to find average
- Consult doctor if cycles are irregular

### Profile data not saving?
- Make sure all fields are filled
- Check for error messages
- Try clearing and re-entering data

## Keyboard Shortcuts

Currently none, but planned for future:
- `W` - Quick water log
- `S` - Open study planner
- `M` - Random quote
- `/` - Search/navigate

## Browser Compatibility

✅ **Fully Supported**:
- Chrome 90+ (Desktop & Mobile)
- Edge 90+
- Safari 14+ (iOS & macOS)
- Firefox 88+

⚠️ **Limited Support**:
- Older browsers may miss some features
- Update browser for best experience

## Getting Help

### Issues or Bugs?
- Check this guide first
- Try clearing app data and starting fresh
- Check browser console for errors (F12)

### Feature Requests?
- Keep track of what features you'd like
- Future versions may include community feedback

### Want to Contribute?
- Fork the repository
- Make improvements
- Submit pull requests

## What's Next?

Once comfortable with the app:
1. ✅ Use daily for at least 2 weeks
2. ✅ Form healthy tracking habits
3. ✅ Explore all features
4. ✅ Customize to your needs
5. ✅ Share with friends who might benefit

## Advanced Usage

### For Developers:

- **Local Storage Keys**:
  - `userProfile`: User profile data
  - `waterLogs`: Array of daily water logs
  - `periodData`: Period cycle information
  - `exams`: Array of exam objects
  - `theme`: Current theme (light/dark)

- **Inspect Data**:
  ```javascript
  // In browser console
  console.log(localStorage.getItem('userProfile'));
  ```

- **Modify Settings**:
  ```javascript
  // Change theme programmatically
  localStorage.setItem('theme', 'dark');
  window.location.reload();
  ```

### Customization:

Want to modify the app?
- Edit `/utils/quotes.ts` for custom quotes
- Adjust water calculation in `/utils/calculations.ts`
- Modify colors in `/styles/globals.css`
- Change glass size in `/pages/WaterTracker.tsx`

## Stay Healthy & Study Smart! 🌟

Remember:
- 💧 Stay hydrated
- 📚 Plan your studies
- 🌸 Track your health
- ✨ Stay motivated

Questions? Consult the README.md for technical details or DEPLOYMENT.md for hosting information.

Happy tracking! 🎉
