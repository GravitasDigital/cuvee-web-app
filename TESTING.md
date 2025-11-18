# Testing Voyage Passport with Real HubSpot Data

## Overview
The Voyage Passport screen now fetches real data from HubSpot using the API credentials configured for Cuvee.com.

## Quick Start

### Option 1: Run Everything at Once (Easiest!)

```bash
cd /Users/jvp/Cuvée/cuvee-web-app
npm run dev:all
```

This starts both the API server (port 8080) and React app (port 3000) in one command!

### Option 2: Run Servers Separately

**Terminal 1 - Start Node.js API Server:**
```bash
cd /Users/jvp/Cuvée/cuvee-web-app
npm run api
```

**Terminal 2 - Start React App:**
```bash
cd /Users/jvp/Cuvée/cuvee-web-app
npm run dev
```

### Option 3: Test the API Directly

```bash
curl "http://localhost:8080/api-voyage-passport.php?email=test@example.com" | python3 -m json.tool
```

**Then:**
1. Open http://localhost:3000 in your browser
2. Log in with a profile user account (use an email that exists in HubSpot)
3. Navigate to the Voyage Passport section
4. You'll see real data from HubSpot!

## How It Works

1. **PHP API Endpoint** (`api-voyage-passport.php`)
   - Takes an email parameter
   - Queries HubSpot API for contact data
   - Fetches `hs_lifetime_revenue` (Voyage Points)
   - Fetches `sub_type__c` (Tier status)
   - Calculates tier information
   - Returns JSON

2. **React App** (`src/screens/VoyagePassportScreen.tsx`)
   - Gets logged-in user's email from auth
   - Calls PHP API endpoint
   - Displays real HubSpot data
   - Falls back to demo mode if no email found

## Testing with Specific Accounts

To test with a specific guest account:

1. **Find a HubSpot contact** with:
   - An email address
   - Some lifetime revenue (Voyage Points)
   - Ideally with `sub_type__c` field set

2. **Log into the web app** using that email

3. **Navigate to Voyage Passport** to see their real data

## Data Display Modes

The app shows a badge indicating which mode it's in:

- **🟢 Live Data from HubSpot** - Fetching real data successfully
- **🟡 Demo Mode** - No email found, using mock data (65,000 points)
- **🔴 Error State** - Failed to load data

## HubSpot Data Mapping

| HubSpot Field | Voyage Passport Field |
|--------------|----------------------|
| `hs_lifetime_revenue` | Voyage Points |
| `sub_type__c` | Tier Status (Tier 1-5) |
| `num_associated_deals` | Stay Count |
| `firstname` / `lastname` | Display Name |

## Tier Thresholds

- **Weekender**: $0+ (Tier 5)
- **Explorer**: $40,000+ (Tier 4)
- **Voyager**: $100,000+ (Tier 3)
- **Jetsetter**: $250,000+ (Tier 2)
- **Cuvée Circle**: $500,000+ (Tier 1)

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console, make sure the PHP server is running and the React app is making requests to `http://localhost:8080/api-voyage-passport.php`

### API Errors
- Check that HubSpot API token is valid
- Verify the email exists in HubSpot
- Look for error messages in the browser console

### No Data Showing
- Make sure you're logged in with a profile user (not guest)
- Check that the email in auth storage matches a HubSpot contact
- Try the test script to verify the API works independently
