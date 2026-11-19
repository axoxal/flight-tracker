# ⚡ Quick Start Guide

Get your flight tracker running in under 10 minutes!

## 1️⃣ Setup Supabase (3 minutes)

```bash
# 1. Go to supabase.com and create account
# 2. Create new project
# 3. Copy the SQL from supabase/schema.sql
# 4. Paste into SQL Editor and run
# 5. Copy your credentials from Settings > API
```

## 2️⃣ Get API Keys (5 minutes)

### Kiwi.com (Required - 2 min)
1. Go to https://tequila.kiwi.com/portal/login
2. Sign up
3. Get API key from dashboard
4. Free tier: 100 requests/month ✅

### Amadeus (Optional - 3 min)
1. Go to https://developers.amadeus.com
2. Create account
3. Create app
4. Get API Key + Secret
5. Free tier: 10k requests/month ✅

## 3️⃣ Deploy to Vercel (2 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd flight-tracker
vercel

# When prompted, add these environment variables:
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
KIWI_API_KEY=your_kiwi_key
CRON_SECRET=any_random_string_here

# Optional:
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret
```

## 4️⃣ Seed Airport Data

```bash
# After deployment, seed airports
npm run seed:airports
```

## 5️⃣ Trigger Initial Scrape

```bash
# Replace with your actual URL and CRON_SECRET
curl -X GET https://your-app.vercel.app/api/cron/scrape \
  -H "Authorization: Bearer YOUR_CRON_SECRET"

# Wait 1-2 minutes for it to complete
```

## 6️⃣ Visit Your App!

```
https://your-app.vercel.app
```

You should now see:
- ✅ Flight deals on the homepage
- ✅ Interactive world map (placeholder until you add Mapbox)
- ✅ Price alerts section
- ✅ Search functionality

## 🎉 That's it!

Your flight tracker is live and will automatically scrape new flights every 6 hours.

## 🔧 Common Issues

**"No flights showing"**
- Wait for first cron run (every 6 hours)
- Or manually trigger scrape endpoint

**"API errors"**
- Check your API keys are correct
- Verify keys in Vercel dashboard

**"Database connection failed"**
- Check Supabase credentials
- Make sure project isn't paused (free tier)

## 📚 Next Steps

1. Add Mapbox for real interactive map
2. Configure SendGrid for email alerts
3. Customize routes in `/api/cron/scrape/route.ts`
4. Add your own branding
5. Set up custom domain

## 💡 Pro Tips

- **Hobby Plan Limits**: Vercel Hobby has limited cron jobs. Upgrade to Pro for production.
- **API Rate Limits**: Monitor your API usage to stay within free tiers
- **Supabase Free Tier**: Auto-pauses after 1 week of inactivity. Upgrade for production.
- **Cost**: Can run completely free for testing, ~$45/month for production

## 🆘 Need Help?

- Check `README.md` for detailed docs
- Review `DEPLOYMENT.md` for troubleshooting
- Open an issue on GitHub
