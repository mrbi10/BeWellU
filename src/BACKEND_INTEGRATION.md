# Backend Integration Guide

This app currently runs entirely in the frontend with localStorage. This guide explains how to add backend integration for cloud sync and advanced features.

## Recommended: Supabase (Free Tier)

Supabase is the easiest backend for this app, providing:
- PostgreSQL database
- Authentication
- Real-time subscriptions
- Storage for files
- Free tier: 500MB database, 50MB file storage, 50,000 monthly active users

### Setup Steps:

1. **Create Supabase Project**:
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and anon key

2. **Install Supabase Client**:
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Create Supabase Client** (`/utils/supabase.ts`):
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

4. **Environment Variables** (`.env`):
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Database Schema:

```sql
-- Users table (automatically created by Supabase Auth)

-- User Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  name TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  dob DATE,
  height NUMERIC,
  weight NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Water Logs
CREATE TABLE water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  glasses INTEGER NOT NULL,
  target_ml INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Period Data
CREATE TABLE period_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  last_period_date DATE NOT NULL,
  cycle_length INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  exam_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their own data)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own water logs" ON water_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own period data" ON period_data
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exams" ON exams
  FOR ALL USING (auth.uid() = user_id);
```

### Authentication:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
})

// Sign out
await supabase.auth.signOut()

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### Data Operations:

```typescript
// Save profile
await supabase
  .from('profiles')
  .upsert({ id: user.id, ...profileData })

// Get water logs
const { data } = await supabase
  .from('water_logs')
  .select('*')
  .eq('user_id', user.id)
  .order('date', { ascending: false })

// Add exam
await supabase
  .from('exams')
  .insert({ user_id: user.id, subject, exam_date })
```

## Alternative: Firebase (Free Tier)

Firebase is another great option:
- Firestore database (1GB storage, 50k reads/day)
- Authentication
- Cloud Functions
- Hosting included

### Setup:

1. **Install Firebase**:
   ```bash
   npm install firebase
   ```

2. **Initialize** (`/utils/firebase.ts`):
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
     // ... other config
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

3. **Firestore Structure**:
   ```
   users/{userId}
     ├── profile (document)
     ├── waterLogs (collection)
     │   └── {date} (document)
     ├── periodData (document)
     └── exams (collection)
         └── {examId} (document)
   ```

## Alternative: PocketBase (Self-hosted Free)

Lightweight, self-hostable backend:
- SQLite database
- Real-time subscriptions
- File storage
- Admin UI

### Setup:

1. **Download PocketBase**:
   - Get from [pocketbase.io](https://pocketbase.io)
   - Run: `./pocketbase serve`

2. **Install SDK**:
   ```bash
   npm install pocketbase
   ```

3. **Initialize**:
   ```typescript
   import PocketBase from 'pocketbase';
   export const pb = new PocketBase('http://127.0.0.1:8090');
   ```

## Sync Strategy

When adding backend, implement offline-first sync:

1. **Read**: Try backend first, fall back to localStorage
2. **Write**: Write to localStorage immediately, sync to backend
3. **Conflict Resolution**: Backend data wins (or implement custom logic)

### Example Sync Hook:

```typescript
function useSyncedData<T>(key: string, fetchFn: () => Promise<T>) {
  const [data, setData] = useLocalStorage<T>(key, null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function sync() {
      setSyncing(true);
      try {
        const backendData = await fetchFn();
        setData(backendData);
      } catch (error) {
        console.log('Using local data, backend unavailable');
      } finally {
        setSyncing(false);
      }
    }
    sync();
  }, []);

  return [data, setData, syncing] as const;
}
```

## Push Notifications (Backend)

For proper push notifications, you need a backend:

### Using Supabase Edge Functions:

```typescript
// Supabase Edge Function
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

serve(async (req) => {
  const webpush = await import('https://esm.sh/web-push@3.5.0')
  
  // Set VAPID keys
  webpush.setVapidDetails(
    'mailto:your@email.com',
    PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY
  )

  // Get subscriptions from database
  // Send notifications
  await webpush.sendNotification(subscription, payload)
  
  return new Response('OK')
})
```

### Using Firebase Cloud Messaging:

```typescript
import { getMessaging, getToken } from 'firebase/messaging';

const messaging = getMessaging();
const token = await getToken(messaging, {
  vapidKey: 'YOUR_VAPID_KEY'
});

// Send token to your backend
await fetch('/api/save-token', {
  method: 'POST',
  body: JSON.stringify({ token })
});
```

## Migration from localStorage

When adding backend, migrate existing data:

```typescript
async function migrateToBackend() {
  const profile = localStorage.getItem('userProfile');
  const waterLogs = localStorage.getItem('waterLogs');
  const periodData = localStorage.getItem('periodData');
  const exams = localStorage.getItem('exams');

  if (profile) {
    await supabase.from('profiles').upsert(JSON.parse(profile));
  }
  if (waterLogs) {
    await supabase.from('water_logs').insert(JSON.parse(waterLogs));
  }
  // ... migrate other data

  // Mark as migrated
  localStorage.setItem('migrated', 'true');
}
```

## API Routes (if using custom backend)

If you prefer a custom Node.js backend:

### Express Server Structure:
```
/server
  ├── server.js
  ├── routes/
  │   ├── auth.js
  │   ├── profile.js
  │   ├── water.js
  │   ├── period.js
  │   └── study.js
  ├── models/
  │   └── db.js
  └── middleware/
      └── auth.js
```

### Example Routes:

```javascript
// POST /api/water/log
app.post('/api/water/log', authenticateUser, async (req, res) => {
  const { date, glasses, targetMl } = req.body;
  await db.query(
    'INSERT INTO water_logs (user_id, date, glasses, target_ml) VALUES (?, ?, ?, ?)',
    [req.user.id, date, glasses, targetMl]
  );
  res.json({ success: true });
});

// GET /api/water/today
app.get('/api/water/today', authenticateUser, async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const [rows] = await db.query(
    'SELECT * FROM water_logs WHERE user_id = ? AND date = ?',
    [req.user.id, today]
  );
  res.json(rows[0] || null);
});
```

## Free Hosting for Backend

- **Supabase**: Built-in hosting
- **Firebase**: Built-in hosting
- **Render.com**: Free tier for web services
- **Railway.app**: $5 free credit monthly
- **Fly.io**: Free tier for small apps
- **Vercel**: Serverless functions (free tier)
- **Netlify**: Serverless functions (free tier)

## Security Considerations

1. **Never expose private keys** in frontend code
2. **Use environment variables** for all credentials
3. **Implement rate limiting** on API endpoints
4. **Validate all inputs** on backend
5. **Use HTTPS only**
6. **Implement proper CORS** settings
7. **Don't store sensitive health data** without proper encryption
8. **Comply with HIPAA/GDPR** if collecting PII

## Testing with Backend

```bash
# Install testing libraries
npm install --save-dev vitest @testing-library/react

# Test API calls
describe('Water Tracker API', () => {
  it('should log water intake', async () => {
    const response = await logWaterIntake(250);
    expect(response.success).toBe(true);
  });
});
```

## Monitoring

- **Supabase**: Built-in dashboard
- **Firebase**: Firebase Console
- **Sentry**: Error tracking (free tier available)
- **LogRocket**: Session replay (free tier)

Choose the backend that best fits your needs and scale!
