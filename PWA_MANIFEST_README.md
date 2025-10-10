# AQIWatch PWA Manifest Setup

This document explains how to use the PWA manifest and generate the required icons for AQIWatch.

## Overview

AQIWatch is configured as a Progressive Web App (PWA) with the following features:
- **Standalone display mode** - Runs like a native app without browser UI
- **Responsive icons** - Multiple icon sizes for different devices
- **App shortcuts** - Quick access to check air quality
- **Offline-ready** - (when service worker is implemented)
- **No push notifications** - Lightweight PWA focused on core functionality

## Manifest Configuration

The `manifest.json` file is located at `/public/manifest.json` and includes:

### App Details
- **Name**: AQIWatch - Air Quality Monitoring
- **Short Name**: AQIWatch
- **Description**: Real-time air quality monitoring with AI-powered predictions
- **Theme Color**: #7df9ff (Electric cyan)
- **Background Color**: #0a0a0a (Dark)
- **Display**: Standalone
- **Orientation**: Portrait-primary
- **Categories**: Health, Weather, Utilities

### Icons
The manifest requires PNG icons in the following sizes:
- 72x72px
- 96x96px
- 128x128px
- 144x144px
- 152x152px
- 192x192px (required minimum for PWA)
- 384x384px
- 512x512px (required minimum for PWA)

## Generating Icons

### Option 1: Using the Icon Generator (Recommended)

1. Open `scripts/generate-icons.html` in your web browser
2. The page will automatically generate preview icons
3. Click **"⬇️ Download All Icons"** to download all 8 icon sizes
4. Save the downloaded PNG files to the `/public` folder

### Option 2: Manual Creation

If you have a design tool (Figma, Photoshop, etc.):
1. Create an icon design with dimensions of 512x512px
2. Export the following sizes: 72, 96, 128, 144, 152, 192, 384, 512
3. Name them as `icon-{size}.png` (e.g., `icon-192.png`)
4. Save all files to the `/public` folder

### Icon Design Guidelines

- Use a **square format** (1:1 aspect ratio)
- Include **safe zone padding** (10-15% from edges)
- Use **high contrast** colors for visibility
- Test on both **light and dark backgrounds**
- Ensure icons are recognizable at **small sizes** (72x72)
- Consider **maskable icon** requirements for Android

## Testing Your PWA

### Chrome DevTools
1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** section to verify:
   - All fields are loaded correctly
   - Icons are accessible
   - No errors are shown

### Lighthouse
1. Open Chrome DevTools (F12)
2. Go to **Lighthouse** tab
3. Select **Progressive Web App** category
4. Run the audit
5. Aim for a score of 90+

### Mobile Testing
1. Deploy your app to a server with HTTPS
2. Open on a mobile device
3. Look for **"Add to Home Screen"** prompt
4. Install and test the standalone experience

## Browser Support

| Browser | Install PWA | Standalone Mode | Manifest Support |
|---------|-------------|-----------------|------------------|
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Chrome (Mobile) | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari (iOS) | ✅ | ✅ | ⚠️ Partial |
| Firefox | ⚠️ Limited | ⚠️ Limited | ✅ |

## File Structure

```
aqiwatch/
├── public/
│   ├── manifest.json          # PWA manifest file
│   ├── icon-72.png           # App icons (generate these)
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   ├── icon-512.png
│   └── icon.svg              # Vector icon (fallback)
├── scripts/
│   └── generate-icons.html   # Icon generator tool
└── app/
    └── layout.tsx            # Includes manifest link
```

## Next Steps

To make AQIWatch a fully-featured PWA:

1. **Generate Icons** ✓ (Follow instructions above)
2. **Add Service Worker** (Optional - for offline support)
3. **Test Installation** (Use Chrome DevTools)
4. **Deploy with HTTPS** (Required for PWA features)

## Troubleshooting

### "Add to Home Screen" not showing
- Ensure you're using **HTTPS** (required for PWA)
- Check that `manifest.json` is accessible at `/manifest.json`
- Verify all required icons (192px, 512px) exist
- Use Chrome DevTools to check for manifest errors

### Icons not displaying
- Verify icon files are in the `/public` folder
- Check file names match exactly (e.g., `icon-192.png`)
- Ensure icons are valid PNG format
- Clear browser cache and reload

### Manifest not loading
- Verify the `<link rel="manifest">` tag in `app/layout.tsx`
- Check for JSON syntax errors in `manifest.json`
- Ensure the file is in the `/public` directory

## Additional Resources

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Web App Manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [PWA Icon Generator](https://www.simicart.com/manifest-generator.html/)
- [Maskable.app Icon Editor](https://maskable.app/editor)

## Support

For issues or questions about the PWA setup, please check the troubleshooting section above or consult the resources listed.

