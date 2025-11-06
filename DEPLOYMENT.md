# Cuvée Web App - Deployment Info

## Live URL
**https://experiments.digital/cuvee-demo/**

## What's Deployed
The production build of the Cuvée web app prototype with the new Voyage Passport feature integrated.

## Features Included
- Dashboard with experiences slider
- Login system (Profile & Guest access)
- Reservations list and detail views
- Preferences center
- Itinerary screen
- **NEW: Voyage Passport** - Full rewards program with tier status, points tracking, and benefits

## Deployment Process
```bash
# Build the app
npm run build

# Files are generated in /dist
# - index.html
# - assets/index-[hash].js
# - assets/index-[hash].css

# Deployed to:
# experiments.digital/cuvee-demo/
```

## File Structure on Server
```
/experiments.digital/public_html/cuvee-demo/
├── index.html
├── assets/
│   ├── index-C8xWDIXW.js
│   └── index-WEAEeZ8a.css
└── README.txt
```

## Accessing the Voyage Passport
1. Open https://experiments.digital/cuvee-demo/
2. From the dashboard, tap the golden "Voyage Passport" button
3. View your tier status, points, and rewards
4. Tap the back arrow to return to dashboard

## Mock Data
Currently uses mock Voyage Points (65,000) for demonstration.
In production, this would connect to HubSpot API for real user data.

## Last Deployed
November 6, 2024 at 3:05 PM PST

## Version
v1.0.0 with Voyage Passport Integration
