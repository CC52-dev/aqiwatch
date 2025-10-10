# PWA Setup for AQIWatch

## 📱 Progressive Web App Features

AQIWatch is now configured as a Progressive Web App (PWA), allowing users to install it on their devices for a native app-like experience.

## 🎨 Icons & Assets

### Generating PNG Icons

Since PNG icons are required for PWA support, follow these steps to generate them:

#### Option 1: Using the HTML Generator (Easiest)
1. Open `scripts/generate-icons.html` in your browser
2. Click "Download All Icons" to generate both 192x192 and 512x512 PNG files
3. Save the downloaded files to the `/public` folder:
   - `public/icon-192.png`
   - `public/icon-512.png`

#### Option 2: Using Online Tools
1. Open `public/icon.svg` in an SVG editor or online converter
2. Export as PNG at 192x192 and 512x512 resolutions
3. Save as `public/icon-192.png` and `public/icon-512.png`

#### Option 3: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first, then run:
magick convert -density 192 public/icon.svg -resize 192x192 public/icon-192.png
magick convert -density 512 public/icon.svg -resize 512x512 public/icon-512.png
```

## 📄 Manifest Configuration

The manifest is configured in `/app/manifest.ts` (using Next.js App Router convention) and includes:

- **App Name**: AQIWatch - Air Quality Monitoring
- **Theme Color**: #7df9ff (Electric Blue)
- **Background Color**: #0a0a0a (Dark)
- **Display Mode**: Standalone (fullscreen app experience)
- **Icons**: SVG and PNG formats for various devices
- **Shortcuts**: Quick action to check air quality

## ✅ PWA Checklist

- [x] manifest.ts created in /app directory (Next.js App Router)
- [x] SVG icon created
- [ ] PNG icons generated (192x192 and 512x512)
- [x] Next.js automatically serves manifest at /manifest.webmanifest
- [x] Theme color meta tag added
- [x] Apple touch icon configured
- [x] Viewport meta tag optimized
- [ ] Service Worker (optional - can be added for offline support)

## 🚀 Testing Your PWA

### Desktop (Chrome/Edge)
1. Open your app in Chrome or Edge
2. Look for the install icon in the address bar
3. Click to install the PWA

### Mobile (iOS)
1. Open in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Mobile (Android)
1. Open in Chrome
2. Tap the three-dot menu
3. Select "Install App" or "Add to Home Screen"

## 🔧 Customization

### Changing Colors
Edit these values in `app/manifest.ts`:
- `theme_color`: The color of the browser UI
- `background_color`: The splash screen background

### Changing the Icon
Replace or edit `public/icon.svg` with your custom design, then regenerate the PNG files.

### Important Note
With Next.js App Router, the manifest is created as `manifest.ts` in the `/app` directory. Next.js automatically:
- Generates the manifest JSON at build time
- Serves it at `/manifest.webmanifest`
- Links it in the HTML `<head>`
- No manual linking required!

## 📱 Features Enabled

- ✅ Install to home screen on mobile and desktop
- ✅ Standalone app experience (no browser UI)
- ✅ Custom app icon and name
- ✅ Splash screen with brand colors
- ✅ App shortcuts for quick actions
- ✅ Responsive design optimized for mobile
- ✅ Works offline-ready (if service worker is added)

## 🎯 Next Steps (Optional)

### Add Service Worker for Offline Support
Create `/public/sw.js` for caching and offline functionality:
```javascript
// Example service worker for caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('aqiwatch-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/icon.svg',
      ]);
    })
  );
});
```

### Register Service Worker
Add to your app layout or page:
```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🌟 Benefits of PWA

- **Faster Load Times**: Cached assets load instantly
- **Offline Access**: Continue using the app without internet
- **Native Feel**: Fullscreen experience without browser chrome
- **Easy Updates**: Updates deploy automatically
- **Cross-Platform**: One codebase works on all devices
- **Discoverable**: Can be found through search engines

