# Cuvée Web App

A web-based companion app for Cuvée luxury vacation rentals. This allows rapid iteration and testing before converting to a native iOS app.

## Features

- ✅ **Experiences Screen** - Browse and request curated activities with category filtering
- ✅ **Preference Center** - Build comprehensive travel preferences for personalized offers
- ✅ **Itinerary Viewer** - Embedded Travefy itinerary (ready for integration)
- 🔜 **Property Details** - Coming soon
- 🔜 **Login/Authentication** - Coming soon

## Quick Start

### 1. Install Dependencies

```bash
cd /Users/jvp/Cuvée/cuvee-web-app
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
npm run preview
```

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Axios** - API calls (ready for WordPress integration)

## Project Structure

```
src/
├── components/       # Reusable components
│   └── PreferenceCenter.tsx
├── screens/         # Main screens
│   └── ExperiencesScreen.tsx
├── api/            # API integration (future)
├── types/          # TypeScript types
├── App.tsx         # Main app component
└── main.tsx        # Entry point
```

## Next Steps

1. **Connect to WordPress API** - Replace mock data with real API calls
2. **Add Authentication** - JWT login with WordPress
3. **HubSpot Integration** - Sync preferences to HubSpot
4. **Convert to iOS** - Use React Native or Capacitor for native app

## Converting to iOS

When ready, you can:
- **Option 1**: Use the existing React Native codebase
- **Option 2**: Use Capacitor to wrap this web app as native iOS
- **Option 3**: Use Ionic for hybrid approach

## Development Notes

- All colors follow Cuvée brand (gold: #d4af37)
- Mock data in components for quick testing
- Ready for API integration with existing WordPress backend
