# ✈️ Flight Tracker - Never Miss a Cheap Flight

A modern flight tracking and price alert system built with Next.js, Supabase, and multiple flight data providers.

## 🚀 Features

- **Real-time Flight Tracking**: Monitor prices from multiple providers (Kiwi, Amadeus)
- **Interactive World Map**: Visualize cheap flight destinations on an interactive map
- **Price Alerts**: Get email notifications when prices drop to your target
- **Trending Deals**: Discover the hottest flight deals updated in real-time
- **Automated Scraping**: Cron jobs run every 6 hours to update flight prices
- **Beautiful UI**: Modern, responsive design with dark mode support

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- Vercel account
- API keys for:
  - Kiwi.com API
  - Amadeus API (optional)
  - SendGrid API (for email alerts, optional)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
cd flight-tracker
npm install
```

### 2. Setup Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema:
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `supabase/schema.sql`
   - Execute the SQL

3. Get your Supabase credentials:
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → Project API keys → anon/public
   - Service Role Key: Settings → API → Project API keys → service_role

### 3. Get API Keys

#### Kiwi.com API
1. Sign up at [tequila.kiwi.com](https://tequila.kiwi.com/portal/login)
2. Create an API key
3. Free tier includes 100 requests/month

#### Amadeus API (Optional)
1. Sign up at [developers.amadeus.com](https://developers.amadeus.com)
2. Create an app to get API key and secret
3. Test environment is free with 10k requests/month

#### SendGrid API (Optional)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Verify sender email

### 4. Configure Environment Variables

Copy `.env.local` and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Flight APIs
KIWI_API_KEY=your_kiwi_key
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret

# Email Alerts
SENDGRID_API_KEY=your_sendgrid_key
ALERT_EMAIL_FROM=alerts@yourdomain.com

# Cron Secret (generate a random string)
CRON_SECRET=your_random_secret_here
```

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### 6. Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel Dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all variables from `.env.local`

5. The cron job will automatically run every 6 hours (configured in `vercel.json`)

## 📊 Database Schema

The app uses the following main tables:

- **flights**: All scraped flight data
- **price_history**: Historical price tracking
- **price_alerts**: User price alert preferences
- **user_preferences**: User settings and home airports
- **airports**: Airport reference data
- **scraping_jobs**: Log of all scraping operations

## 🔄 Automated Scraping

The app automatically scrapes flights every 6 hours via Vercel Cron Jobs:

- Scrapes popular routes worldwide
- Updates price history
- Checks and triggers price alerts
- Logs all operations

To manually trigger scraping:

```bash
curl -X GET https://your-app.vercel.app/api/cron/scrape \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🎨 Customization

### Add More Routes

Edit `src/app/api/cron/scrape/route.ts` and add routes to `POPULAR_ROUTES`:

```typescript
const POPULAR_ROUTES = [
  { origin: 'JFK', destination: 'LHR' },
  { origin: 'YOUR_ORIGIN', destination: 'YOUR_DESTINATION' },
];
```

### Adjust Scraping Frequency

Edit `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/scrape",
    "schedule": "0 */3 * * *"  // Every 3 hours
  }]
}
```

### Add More Providers

Create a new scraper in `src/lib/scrapers/` and integrate it in the API routes.

## 🚀 Features Roadmap

- [ ] User authentication
- [ ] Saved searches
- [ ] Flexible date search
- [ ] Mobile app (React Native)
- [ ] Advanced filters (airlines, stops, duration)
- [ ] Multi-city flights
- [ ] Hotel and car rental integration
- [ ] Social sharing of deals

## 🔧 Troubleshooting

### Cron jobs not running
- Verify `CRON_SECRET` is set in Vercel environment variables
- Check Vercel deployment logs
- Ensure your plan supports cron jobs

### No flight data showing
- Check API keys are valid
- Verify Supabase connection
- Check browser console for errors
- Review API rate limits

### Prices not updating
- Check scraping job logs in Supabase
- Verify cron job is running
- Check API provider status

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📧 Support

For questions or issues, please open a GitHub issue.

---

Built with ❤️ using Next.js, Supabase, and Vercel
