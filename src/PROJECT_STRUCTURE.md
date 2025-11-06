# Project Structure

Complete file organization for the Wellness & Study Companion app.

```
wellness-study-companion/
│
├── public/                          # Static assets
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service worker
│   ├── icon-192.png               # App icon 192x192 (placeholder)
│   └── icon-512.png               # App icon 512x512 (placeholder)
│
├── src/                            # Source code
│   ├── components/                # React components
│   │   ├── figma/                # Figma system components (protected)
│   │   │   └── ImageWithFallback.tsx
│   │   ├── ui/                   # UI component library
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (other UI components)
│   │   ├── Navbar.tsx            # Bottom navigation
│   │   ├── ProgressRing.tsx      # Circular progress indicator
│   │   ├── ReminderCard.tsx      # Alert/reminder cards
│   │   ├── StudyCard.tsx         # Exam cards
│   │   ├── QuoteWidget.tsx       # Motivational quote display
│   │   ├── InstallPrompt.tsx     # PWA install banner
│   │   └── NotificationBanner.tsx # Notification permission banner
│   │
│   ├── pages/                     # Page components (routes)
│   │   ├── Home.tsx              # Dashboard (/)
│   │   ├── Profile.tsx           # User profile (/profile)
│   │   ├── WaterTracker.tsx      # Water tracking (/water)
│   │   ├── PeriodTracker.tsx     # Period tracking (/period)
│   │   ├── StudyPlanner.tsx      # Exam planning (/study)
│   │   ├── Motivation.tsx        # Motivational quotes (/motivation)
│   │   └── Settings.tsx          # App settings (/settings)
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useLocalStorage.ts    # LocalStorage state management
│   │   └── useTheme.ts           # Theme management
│   │
│   ├── utils/                     # Utility functions
│   │   ├── calculations.ts       # Helper calculations
│   │   ├── quotes.ts             # Motivational quotes data
│   │   └── pwa.ts                # PWA utilities
│   │
│   ├── types/                     # TypeScript type definitions
│   │   └── index.ts              # All type interfaces
│   │
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # App entry point
│   └── vite-env.d.ts             # Vite type definitions
│
├── styles/                         # Global styles
│   └── globals.css                # Tailwind + custom styles
│
├── guidelines/                     # Figma Make guidelines
│   └── Guidelines.md
│
├── docs/                           # Documentation (root level)
│   ├── README.md                  # Main documentation
│   ├── GETTING_STARTED.md         # User guide
│   ├── DEPLOYMENT.md              # Deployment guide
│   ├── BACKEND_INTEGRATION.md     # Backend setup guide
│   ├── PACKAGE_INFO.md            # Dependencies guide
│   ├── FEATURES_CHECKLIST.md      # Feature completion
│   ├── PROJECT_STRUCTURE.md       # This file
│   └── Attributions.md            # Credits
│
├── config files/                   # Configuration
│   ├── index.html                 # HTML template
│   ├── package.json               # Dependencies
│   ├── tsconfig.json              # TypeScript config
│   ├── vite.config.ts             # Vite config
│   ├── tailwind.config.js         # Tailwind config (if needed)
│   ├── .gitignore                 # Git ignore rules
│   └── .env.example               # Environment variables example
│
└── dist/                           # Build output (generated)
    └── ... (production files)
```

## Directory Details

### `/public/` - Static Assets
**Purpose:** Files served as-is, not processed by Vite

**Contents:**
- `manifest.json`: PWA configuration (name, icons, theme)
- `sw.js`: Service worker for offline functionality
- `icon-192.png`: Required PWA icon (192×192)
- `icon-512.png`: Required PWA icon (512×512)

**Notes:**
- Files here are accessible at `/filename.ext`
- Icons are currently placeholders (need actual images)

### `/src/components/` - React Components
**Purpose:** Reusable UI components

**Structure:**
- `figma/`: System components (do not modify)
- `ui/`: Pre-built UI components library
- Custom components: Navbar, Cards, Widgets, Banners

**Guidelines:**
- One component per file
- PascalCase naming
- Props interface defined
- TypeScript strict

### `/src/pages/` - Route Components
**Purpose:** Full page components for each route

**Files:**
- `Home.tsx`: Dashboard overview
- `Profile.tsx`: User profile management
- `WaterTracker.tsx`: Water intake tracking
- `PeriodTracker.tsx`: Menstrual cycle tracking
- `StudyPlanner.tsx`: Exam management
- `Motivation.tsx`: Quotes and inspiration
- `Settings.tsx`: App configuration

**Pattern:**
- Each file = one route
- Imports necessary components
- Handles page-specific logic
- Uses custom hooks for data

### `/src/hooks/` - Custom Hooks
**Purpose:** Reusable stateful logic

**Files:**
- `useLocalStorage.ts`: Persistent state management
- `useTheme.ts`: Theme switching logic

**Pattern:**
- Prefix with `use`
- Return array or object
- Generic types where applicable

### `/src/utils/` - Utility Functions
**Purpose:** Pure helper functions

**Files:**
- `calculations.ts`: Math and date calculations
- `quotes.ts`: Motivational quotes data
- `pwa.ts`: PWA-specific utilities

**Guidelines:**
- Pure functions (no side effects)
- Well-typed inputs/outputs
- Unit testable
- No React dependencies

### `/src/types/` - TypeScript Types
**Purpose:** Shared type definitions

**Contents:**
- `UserProfile`: User data interface
- `WaterLog`: Water tracking interface
- `PeriodData`: Period tracking interface
- `Exam`: Study planner interface

**Guidelines:**
- Export all types
- Use interfaces for objects
- Use types for unions/primitives

### `/styles/` - Global Styles
**Purpose:** CSS and Tailwind configuration

**Files:**
- `globals.css`: Tailwind directives + custom CSS

**Notes:**
- CSS variables for theming
- Typography defaults
- Dark mode variants
- Tailwind v4 syntax

## File Naming Conventions

### Components
```
ComponentName.tsx       ✅ Correct
component-name.tsx      ❌ Wrong (use for non-components)
componentName.tsx       ❌ Wrong
```

### Utilities
```
calculations.ts         ✅ Correct
helperFunctions.ts      ✅ Correct
CalculationUtils.ts     ❌ Wrong
```

### Types
```
types/index.ts          ✅ Correct (exports all)
types/user.ts           ✅ Correct (specific types)
UserTypes.ts            ❌ Wrong
```

### Hooks
```
useLocalStorage.ts      ✅ Correct
useTheme.ts            ✅ Correct
localStorage.ts         ❌ Wrong (must start with 'use')
```

## Import Conventions

### Absolute vs Relative
```typescript
// Components
import { Button } from '../components/ui/button'  ✅
import { Navbar } from './components/Navbar'      ✅

// Hooks
import { useLocalStorage } from '../hooks/useLocalStorage'  ✅

// Utils
import { calculateAge } from '../utils/calculations'  ✅

// Types
import type { UserProfile } from '../types'  ✅
```

### Import Order
1. React imports
2. Third-party libraries
3. Components
4. Hooks
5. Utils
6. Types
7. Styles

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateAge } from '../utils/calculations';
import type { UserProfile } from '../types';
```

## Key Files Explained

### `App.tsx`
**Role:** Main application component
- Sets up routing
- Registers service worker
- Provides global UI (Navbar, Toaster)
- Wraps app in Router

### `main.tsx`
**Role:** Application entry point
- Mounts React app to DOM
- Imports global styles
- Development only file

### `index.html`
**Role:** HTML template
- PWA meta tags
- Viewport configuration
- Manifest link
- Mount point (#root)

### `package.json`
**Role:** Project configuration
- Dependencies list
- Scripts (dev, build, preview)
- Project metadata

### `tsconfig.json`
**Role:** TypeScript configuration
- Compiler options
- Strict mode enabled
- JSX configuration

### `vite.config.ts`
**Role:** Build configuration
- React plugin
- Build optimizations
- Dev server settings

## Data Flow

### Component → Hook → LocalStorage
```typescript
// Component
const [profile, setProfile] = useLocalStorage('userProfile', null);

// Hook handles
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(localStorage.get(key) || initial);
  
  useEffect(() => {
    localStorage.set(key, value);
  }, [value]);
  
  return [value, setValue];
}
```

### Page → Utils → Display
```typescript
// Page gets data
const waterTarget = calculateWaterTarget(profile.weight);

// Utils calculate
export function calculateWaterTarget(kg) {
  return kg * 35;
}

// Component displays
<div>{waterTarget}ml</div>
```

## Code Organization Principles

### 1. Single Responsibility
Each file has one clear purpose

### 2. DRY (Don't Repeat Yourself)
Reusable logic → utils or hooks
Reusable UI → components

### 3. Separation of Concerns
- UI in components
- Logic in hooks
- Calculations in utils
- Data models in types

### 4. Progressive Enhancement
- Core functionality works without JS
- Enhanced with React
- Further enhanced with PWA

## Build Output (`/dist/`)

After running `npm run build`:

```
dist/
├── assets/
│   ├── index-[hash].js         # Main JavaScript bundle
│   ├── vendor-[hash].js        # Third-party code
│   └── index-[hash].css        # Compiled CSS
├── manifest.json               # Copied from public/
├── sw.js                       # Copied from public/
├── icon-192.png               # Copied from public/
├── icon-512.png               # Copied from public/
└── index.html                 # Processed HTML
```

## Environment Variables

### `.env` (not committed)
```env
VITE_API_URL=https://api.example.com
VITE_SUPABASE_URL=...
VITE_SUPABASE_KEY=...
```

### `.env.example` (committed)
```env
VITE_API_URL=
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
```

## Git Structure

### Recommended `.gitignore`
```
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
```

### Committed Files
- All source code
- Documentation
- Configuration files
- `.env.example`
- `public/` assets

### Not Committed
- `node_modules/`
- `dist/`
- `.env`
- Build artifacts

## Adding New Features

### New Page
1. Create file in `/src/pages/PageName.tsx`
2. Add route in `App.tsx`
3. Add navigation link in `Navbar.tsx`

### New Component
1. Create file in `/src/components/ComponentName.tsx`
2. Export component
3. Import where needed

### New Utility
1. Create function in appropriate utils file
2. Export function
3. Import in component

### New Type
1. Add interface to `/src/types/index.ts`
2. Export interface
3. Import where needed

## Testing Structure (Future)

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx        # Component tests
├── utils/
│   ├── calculations.ts
│   └── calculations.test.ts   # Unit tests
└── pages/
    ├── Home.tsx
    └── Home.test.tsx          # Integration tests
```

## Quick Reference

**Add dependency:**
```bash
npm install package-name
```

**Remove dependency:**
```bash
npm uninstall package-name
```

**Create component:**
```bash
# In /src/components/
touch NewComponent.tsx
```

**Create page:**
```bash
# In /src/pages/
touch NewPage.tsx
```

**Run development:**
```bash
npm run dev
```

**Build production:**
```bash
npm run build
```

**Preview build:**
```bash
npm run preview
```

This structure keeps the code organized, maintainable, and scalable! 🏗️
