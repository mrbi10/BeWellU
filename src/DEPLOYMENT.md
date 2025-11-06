# Deployment Guide

This guide explains how to deploy your Wellness & Study Companion app to various free hosting platforms.

## Option 1: Vercel (Recommended)

Vercel offers excellent support for React apps and PWAs with automatic HTTPS.

### Steps:

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Web Interface**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect React and deploy

3. **Deploy via CLI**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - Your app will be live in seconds

### Configuration:

Create `vercel.json` in your project root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Option 2: Netlify

Netlify is another excellent option with automatic deployments.

### Steps:

1. **Via Web Interface**:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy"

2. **Via CLI**:
   ```bash
   npm install -g netlify-cli
   netlify init
   netlify deploy --prod
   ```

### Configuration:

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Option 3: GitHub Pages

Free hosting directly from your GitHub repository.

### Steps:

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

4. **Configure GitHub**:
   - Go to repository Settings → Pages
   - Source: Deploy from branch `gh-pages`
   - Click Save

### Note for GitHub Pages:
You'll need to update your router to use HashRouter instead of BrowserRouter for proper routing:

```tsx
import { HashRouter as Router } from 'react-router-dom';
```

## Option 4: Cloudflare Pages

Fast, global CDN with unlimited bandwidth.

### Steps:

1. **Via Web Interface**:
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Connect your GitHub/GitLab account
   - Select your repository
   - Build settings:
     - Build command: `npm run build`
     - Build output directory: `dist`
   - Click "Save and Deploy"

2. **Via Wrangler CLI**:
   ```bash
   npm install -g wrangler
   wrangler pages project create wellness-app
   npm run build
   wrangler pages publish dist
   ```

## PWA Considerations

### Service Worker

Make sure your service worker (`/public/sw.js`) is accessible at the root:
- Most platforms handle this automatically
- For custom servers, ensure `/sw.js` serves the file correctly

### HTTPS Required

PWAs require HTTPS. All the platforms above provide free HTTPS certificates automatically.

### App Icons

Generate PWA icons (192x192 and 512x512):
1. Use a tool like [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
2. Or create manually and place in `/public/` folder:
   - `/public/icon-192.png` (192x192px)
   - `/public/icon-512.png` (512x512px)

### Testing PWA

After deployment:
1. Open your app in Chrome/Edge
2. Open DevTools → Application → Manifest
3. Check if manifest is loaded correctly
4. Test "Add to Home Screen" functionality
5. Check Service Workers tab for registration

## Environment Variables

If you add backend integration later:

### Vercel:
```bash
vercel env add
```

### Netlify:
- Site settings → Build & deploy → Environment → Add variable

### GitHub Actions:
- Repository Settings → Secrets → New repository secret

## Custom Domain

All platforms support custom domains:

1. **Add domain** in platform settings
2. **Update DNS** records:
   - For Vercel/Netlify: Add CNAME record
   - For GitHub Pages: Add A records
3. **Wait for DNS propagation** (can take up to 24 hours)
4. **Enable HTTPS** (usually automatic)

## Performance Optimization

Before deploying:

1. **Optimize images**:
   ```bash
   npm install -g sharp-cli
   sharp -i input.png -o output.png resize 512 512
   ```

2. **Minimize bundle**:
   - Already handled by Vite build
   - Check bundle size: `npm run build`

3. **Enable compression**:
   - Most platforms enable gzip/brotli automatically

4. **Add caching headers**:
   - Service worker handles offline caching
   - Platform CDNs handle edge caching

## Monitoring

After deployment, monitor your app:

1. **Google Analytics** (optional):
   - Add GA script to `index.html`

2. **Lighthouse CI**:
   - Test PWA score
   - Run: `npm install -g @lhci/cli`
   - `lhci autorun --collect.url=https://your-app.com`

3. **Platform Analytics**:
   - All platforms provide basic analytics
   - Check bandwidth, requests, errors

## Troubleshooting

### Service Worker not registering:
- Check HTTPS is enabled
- Verify `/sw.js` is accessible
- Clear browser cache and reload

### Routing issues (404 on refresh):
- Ensure redirects/rewrites are configured
- All routes should redirect to `/index.html`

### Icons not showing:
- Verify icon paths in `manifest.json`
- Icons must be accessible at `/icon-192.png` etc.
- Check browser console for errors

### Manifest not loading:
- Verify `manifest.json` is in `/public/`
- Check `<link rel="manifest">` in `index.html`
- Validate manifest with Chrome DevTools

## Quick Deploy Checklist

- [ ] Update `package.json` with correct homepage (if needed)
- [ ] Create PWA icons (192x192 and 512x512)
- [ ] Test locally: `npm run build && npm run preview`
- [ ] Choose hosting platform
- [ ] Connect repository
- [ ] Configure build settings
- [ ] Deploy
- [ ] Test PWA functionality
- [ ] Enable custom domain (optional)
- [ ] Set up monitoring (optional)

## Resources

- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
