# Package Information & Setup

This document explains the dependencies and scripts needed for the Wellness & Study Companion app.

## Required Dependencies

### Core Framework
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  }
}
```

### UI & Styling
```json
{
  "dependencies": {
    "motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

### TypeScript & Build Tools
```json
{
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

## Complete package.json

```json
{
  "name": "wellness-study-companion",
  "version": "1.0.0",
  "type": "module",
  "description": "A personalized wellness and study companion PWA",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "motion": "^10.16.0",
    "lucide-react": "^0.294.0",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "eslint": "^8.55.0",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0"
  }
}
```

## Installation Steps

### Fresh Install
```bash
npm install
```

### Installing Individual Packages

If you need to add packages manually:

```bash
# Core React
npm install react react-dom react-router-dom

# UI Libraries
npm install motion lucide-react sonner

# TypeScript Support
npm install -D @types/react @types/react-dom typescript

# Build Tools
npm install -D vite @vitejs/plugin-react

# Tailwind CSS
npm install -D tailwindcss@4.0.0 autoprefixer postcss
```

## Build Configuration

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['motion', 'lucide-react']
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist"]
}
```

## Scripts Explanation

### Development
```bash
npm run dev
```
- Starts Vite development server
- Hot module replacement enabled
- Opens browser automatically at localhost:5173

### Production Build
```bash
npm run build
```
- TypeScript compilation
- Optimized production build
- Minification and tree-shaking
- Output in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
- Serves production build locally
- Test before deployment
- Runs on different port (usually 4173)

### Linting (if configured)
```bash
npm run lint
```
- Checks code quality
- TypeScript errors
- React best practices

## Environment Setup

### Node.js Version
```bash
# Check Node version
node --version

# Required: Node 18.x or higher
# Recommended: Node 20.x LTS
```

### Update Node.js
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Or download from nodejs.org
```

## Optional Development Tools

### ESLint Configuration
```bash
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks
```

### Prettier (Code Formatting)
```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

Create `.prettierrc`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### Husky (Git Hooks)
```bash
npm install -D husky lint-staged
npx husky install
```

## Bundle Size Optimization

### Analyze Bundle
```bash
npm install -D rollup-plugin-visualizer
```

Add to `vite.config.ts`:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
})
```

### Expected Bundle Sizes
- **Main bundle**: ~150-200 KB (gzipped)
- **React vendor**: ~130 KB (gzipped)
- **UI vendor**: ~50 KB (gzipped)
- **Total**: ~350-400 KB (gzipped)

## PWA Dependencies

### Service Worker (Built-in)
No additional dependencies needed - using vanilla service worker.

### Optional: Workbox (Advanced)
```bash
npm install -D workbox-precaching workbox-routing workbox-strategies
```

## Testing (Optional)

### Unit Testing
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### E2E Testing
```bash
npm install -D playwright @playwright/test
```

## Common Issues

### "Cannot find module"
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
npm run dev
```

### Build Errors
```bash
# Check Node version
node --version  # Should be 18+

# Update dependencies
npm update

# Try clean build
rm -rf dist
npm run build
```

### Port Already in Use
```bash
# Kill process on port 5173
# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID [PID] /F
```

## Production Optimizations

### Enable Compression
Most hosting platforms handle this automatically, but for custom servers:

```javascript
// Express.js
const compression = require('compression');
app.use(compression());
```

### Cache Headers
Configure in your hosting platform or server:

```
# Static assets
Cache-Control: public, max-age=31536000, immutable

# index.html
Cache-Control: no-cache
```

### CDN (Optional)
- Cloudflare (free tier)
- Fastly
- AWS CloudFront

## Monitoring Bundle Size

### Set Budget in vite.config.ts
```typescript
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500, // KB
  }
})
```

## Updating Dependencies

### Check for Updates
```bash
npm outdated
```

### Update All
```bash
npm update
```

### Update Major Versions (Carefully!)
```bash
npx npm-check-updates -u
npm install
```

## Quick Commands Reference

```bash
# Install everything
npm install

# Start development
npm run dev

# Build for production
npm run build

# Test production build
npm run preview

# Clean install
rm -rf node_modules package-lock.json && npm install

# Check bundle size
npm run build && du -sh dist/*

# Update all packages
npm update
```

## Deployment Preparation

Before deploying:

1. ✅ Run `npm run build` successfully
2. ✅ Test with `npm run preview`
3. ✅ Check bundle sizes
4. ✅ Test PWA features
5. ✅ Verify service worker registration
6. ✅ Test on mobile devices
7. ✅ Lighthouse audit (score 90+)

## Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Motion (Framer Motion)](https://motion.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

Your app is now ready to build and deploy! 🚀
