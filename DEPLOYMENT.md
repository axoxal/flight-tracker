# 🚀 Deployment Guide

## Step 1: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **SQL Editor**
3. Open `supabase/schema.sql` from this repository
4. Copy the entire SQL and paste into the SQL editor
5. Click **Run** to execute
6. Verify tables are created by going to **Table Editor**

## Step 2: Get API Credentials

### Supabase
1. Go to **Settings → API**
2. Copy:
   - Project URL
   - `anon` `public` key
   - `service_role` key (keep this secret!)

### Kiwi.com API (Required)
1. Sign up at [tequila.kiwi.com/portal](https://tequila.kiwi.com/portal/login)
2. Go to **Dashboard → API Keys**
3. Create a new API key
4. Copy the key (free tier: 100 requests/month)

### Amadeus API (Optional but recommended)
1. Sign up at [developers.amadeus.com](https://developers.amadeus.com)
2. Create an app
3. Copy **API Key** and **API Secret**
4. Test environment is free with 10k requests/month

### SendGrid (Optional - for email alerts)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Go to **Settings → API Keys**
3. Create an API key with **Full Access**
4. Verify a sender email address

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New → Project**
3. Import your GitHub repository: `https://github.com/YOUR_USERNAME/flight-tracker`
4. Configure the project:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`

5. Add Environment Variables (click **Environment Variables**):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
KIWI_API_KEY=your_kiwi_key
AMADEUS_API_KEY=your_amadeus_key
AMADEUS_API_SECRET=your_amadeus_secret
SENDGRID_API_KEY=your_sendgrid_key
ALERT_EMAIL_FROM=alerts@yourdomain.com
CRON_SECRET=generate_a_random_32_char_string
```

6. Click **Deploy**
7. Wait for deployment to complete (2-3 minutes)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd flight-tracker
vercel

# Follow prompts and add environment variables when asked
```

## Step 4: Configure Cron Jobs

After deployment:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings → Cron Jobs**
3. Verify the cron job is configured:
   - Path: `/api/cron/scrape`
   - Schedule: `0 */6 * * *` (every 6 hours)

If not visible, the cron will be automatically set up from `vercel.json`

## Step 5: Test the Deployment

### Test the Website
1. Visit your deployed URL (e.g., `https://flight-tracker-xyz.vercel.app`)
2. You should see the homepage with search bar and tabs

### Test the API
```bash
# Test deals endpoint
curl https://your-app.vercel.app/api/flights/deals

# Should return JSON with flights data
```

### Manually Trigger Scraping (First Time)
```bash
curl -X GET https://your-app.vercel.app/api/cron/scrape \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

This will populate your database with initial flight data.

## Step 6: Verify Database is Populated

1. Go back to Supabase Dashboard
2. Open **Table Editor**
3. Check the `flights` table
4. You should see flight records appearing
5. Check `scraping_jobs` table to see job status

## Step 7: Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `ALERT_EMAIL_FROM` if using custom domain

## 🔧 Troubleshooting

### Cron Jobs Not Running
- Ensure you're on Vercel Pro plan (Hobby plan has limited cron)
- Check **Deployments → Functions** tab for cron execution logs
- Verify `CRON_SECRET` is set correctly

### No Flight Data
- Check Vercel Function logs for errors
- Verify API keys are correct
- Check rate limits on your API providers
- Manually trigger scraping endpoint

### Database Connection Issues
- Verify Supabase credentials
- Check if your Supabase project is paused (free tier auto-pauses)
- Ensure service role key has correct permissions

### Build Failures
```bash
# Test build locally first
npm run build

# If successful, commit and push
git add .
git commit -m "Fix build issues"
git push origin main
```

## 📊 Monitoring

### Vercel Analytics
- Enable in **Settings → Analytics**
- Track visitor metrics and performance

### Supabase Logs
- Go to **Logs** in Supabase Dashboard
- Monitor database queries and errors

### Function Logs
- Go to **Deployments → Functions** in Vercel
- Click on any function to see execution logs

## 🔄 Updating the App

```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push origin main

# Vercel will automatically deploy the update
```

## 💰 Cost Estimation

### Free Tier (Good for starting)
- **Vercel**: Hobby plan (free)
  - 100 GB bandwidth
  - Unlimited deployments
  - Limited cron jobs
- **Supabase**: Free tier
  - 500 MB database
  - 2 GB bandwidth
  - Auto-pauses after 1 week inactivity
- **Kiwi API**: 100 requests/month (free)
- **Amadeus**: 10k requests/month (free)

### Paid (For production)
- **Vercel Pro**: $20/month
  - Unlimited cron jobs
  - Advanced analytics
- **Supabase Pro**: $25/month
  - 8 GB database
  - No auto-pause
  - Daily backups
- **Kiwi API**: Contact for pricing
- **Amadeus**: Free up to 10k/month

## 🚦 Going Live Checklist

- [ ] Database schema created
- [ ] All environment variables set
- [ ] Deployment successful
- [ ] Initial scraping completed
- [ ] Test search functionality
- [ ] Test price alerts creation
- [ ] Verify cron jobs are running
- [ ] Set up monitoring
- [ ] Configure custom domain (optional)
- [ ] Enable analytics
- [ ] Test email alerts (if configured)

## 📧 Support

If you run into issues:
1. Check Vercel function logs
2. Check Supabase logs
3. Review API provider status pages
4. Open an issue on GitHub

---

🎉 Congratulations! Your flight tracker is now live!
