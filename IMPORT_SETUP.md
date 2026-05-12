# 🚀 AI Tools Data Import Setup Guide

This guide walks through setting up automated data imports from ProductHunt, GitHub, and HuggingFace.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Database Setup](#database-setup)
3. [API Token Configuration](#api-token-configuration)
4. [Manual Import Testing](#manual-import-testing)
5. [Automatic Scheduling](#automatic-scheduling)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before starting, ensure you have:
- ✅ Supabase project set up
- ✅ Admin access to the AI Tool Hub application
- ✅ API tokens from external sources (instructions below)

---

## Database Setup

### Step 1: Run Migration
Execute the SQL migration to create import tracking tables:

```bash
# Option A: Using Supabase Dashboard
1. Go to SQL Editor in Supabase Dashboard
2. Create new Query
3. Copy content from: src/db/migrations/add_import_history_table.sql
4. Run the query

# Option B: Using Supabase CLI
supabase db push
```

### Step 2: Verify Tables
Check that the following tables and views were created:
- ✅ `import_history` - Stores all import runs
- ✅ `import_statistics` - View with aggregate stats
- ✅ Function `clean_old_imports()` - Maintenance helper

```sql
-- Verify migration
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public'
AND table_name IN ('import_history', 'tools');
```

---

## API Token Configuration

### ProductHunt API Token

1. **Create ProductHunt Account**
   - Visit: https://www.producthunt.com/
   - Create an account if you don't have one

2. **Get API Token**
   - Go to: https://api.producthunt.com/v2/docs
   - Look for "Authentication" section
   - Request API access or use your OAuth token

3. **Store Token**
   - **Environment Variable**: `PRODUCTHUNT_API_TOKEN`
   - **File**: `.env.local`
   ```
   VITE_PRODUCTHUNT_API_TOKEN=your_token_here
   ```

### GitHub API Token

1. **Create GitHub Account**
   - Visit: https://github.com/
   - Create an account if you don't have one

2. **Generate PAT (Personal Access Token)**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Select scopes: `public_repo`, `read:org`
   - Generate and copy token

3. **Store Token**
   - **Environment Variable**: `GITHUB_API_TOKEN`
   - **File**: `.env.local`
   ```
   VITE_GITHUB_API_TOKEN=your_token_here
   ```

### HuggingFace API Token

1. **Create HuggingFace Account**
   - Visit: https://huggingface.co/
   - Create an account if you don't have one

2. **Get API Token**
   - Go to: https://huggingface.co/settings/tokens
   - Create new token with "Read" access
   - Copy the token

3. **Store Token**
   - **Environment Variable**: `HUGGINGFACE_API_TOKEN`
   - **File**: `.env.local`
   ```
   VITE_HUGGINGFACE_API_TOKEN=your_token_here
   ```

### ✅ Complete `.env.local` Example

```env
# Existing variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# New API tokens
VITE_PRODUCTHUNT_API_TOKEN=ph_token_here
VITE_GITHUB_API_TOKEN=github_pat_here
VITE_HUGGINGFACE_API_TOKEN=hf_token_here
```

---

## Manual Import Testing

### Step 1: Access Admin Import Panel
1. Log in as admin
2. Go to Admin Dashboard → "Data Import" tab
3. You should see the import management interface

### Step 2: Trigger First Import
1. Click "Start Import Process" button
2. Wait for completion (typically 30-60 seconds)
3. Check import history for results

### Expected Results (First Run)
```
ProductHunt:    ~100-150 tools
GitHub:         ~300-500 tools
HuggingFace:    ~200-300 models
───────────────────────────────
Total:          ~1000 tools (after deduplication)
```

### Troubleshooting

**Error: "Failed to fetch tools from any source"**
- Check API tokens are set correctly in `.env.local`
- Verify `.env.local` file is loaded (restart dev server)
- Check that tokens haven't expired

**Error: "Failed to save import log"**
- Verify `import_history` table exists in database
- Check Supabase connection credentials

**Import takes too long**
- This is normal for first import (API rate limits)
- Subsequent imports are faster due to deduplication

---

## Automatic Scheduling

### Option 1: Vercel Cron Jobs (Recommended for Production)

Create `api/cron/import-tools.ts`:

```typescript
// api/cron/import-tools.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleImport } from '@/api/importHandler';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: NextRequest) {
  // Verify cron secret
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await handleImport();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
```

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/import-tools",
    "schedule": "0 2 * * *"
  }]
}
```

### Option 2: GitHub Actions (Free Alternative)

Create `.github/workflows/daily-import.yml`:

```yaml
name: Daily AI Tools Import

on:
  schedule:
    # Runs at 2 AM UTC daily
    - cron: '0 2 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  import:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
      
      - name: Run import
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          VITE_PRODUCTHUNT_API_TOKEN: ${{ secrets.PRODUCTHUNT_API_TOKEN }}
          VITE_GITHUB_API_TOKEN: ${{ secrets.GITHUB_API_TOKEN }}
          VITE_HUGGINGFACE_API_TOKEN: ${{ secrets.HUGGINGFACE_API_TOKEN }}
        run: npm run import
```

### Option 3: Simple Node.js Script (Development)

Create `scripts/import-tools.js`:

```javascript
const { runFullImport } = require('../src/api/scrapers/aggregator.ts');

// Run immediately
runFullImport();

// Then run daily
setInterval(runFullImport, 24 * 60 * 60 * 1000);

console.log('Import process started. Running daily at this time.');
```

Run with: `node scripts/import-tools.js`

---

## Monitoring & Maintenance

### View Import Statistics

```sql
-- Check import statistics
SELECT * FROM import_statistics;

-- View recent imports
SELECT * FROM import_history
ORDER BY created_at DESC
LIMIT 10;

-- Check for failed imports
SELECT * FROM import_history
WHERE status = 'failed'
ORDER BY created_at DESC;
```

### Clean Old Imports

Run maintenance to keep only last 100 imports:

```sql
SELECT clean_old_imports();
```

### Email Notifications (Optional)

Set up email alerts for failed imports using Supabase Functions or integrations.

---

## Expected Data Inflow

| Source | Frequency | Tools | Quality |
|--------|-----------|-------|---------|
| ProductHunt | Daily | 10-20 new | ⭐⭐⭐⭐⭐ |
| GitHub | Weekly | 50-100 | ⭐⭐⭐⭐ |
| HuggingFace | Daily | 50-100 | ⭐⭐⭐ |
| **Total** | Daily | **100-200 new** | **High** |

---

## Performance Tips

1. **First import is slowest** (deduplication kicks in)
   - ~2-5 minutes on first run
   - ~30-60 seconds on subsequent runs

2. **API Rate Limiting**
   - ProductHunt: 50 requests/hour
   - GitHub: 5,000 requests/hour (authenticated)
   - HuggingFace: 100 requests/minute

3. **Database Performance**
   - Tools table has ~1000-2000 rows after 1 week
   - Queries remain fast due to indexing
   - Consider archiving old imports monthly

---

## Next Steps

✅ Database setup complete
✅ API tokens configured
✅ Manual import tested
✅ Scheduler set up
✅ Monitoring in place

**You now have:**
- 📊 1000+ AI tools in your database
- ⚙️ Daily automatic updates
- 📈 Import tracking and statistics
- 🎯 Quality data from trusted sources

---

## FAQ

**Q: How do I update API tokens?**
A: Update `.env.local` and restart dev server, or update secrets in production (Vercel/GitHub).

**Q: Can I run import more frequently?**
A: Yes, but respect API rate limits. ProductHunt allows 50 req/hr.

**Q: How do I exclude certain tools/categories?**
A: Add filters to `deduplicateTools()` function in aggregator.ts

**Q: Can I import from other sources?**
A: Yes! Follow the scraper pattern and create new modules for additional sources.

---

## Support

For issues or questions:
1. Check import history for error messages
2. Review API token configuration
3. Check database migration status
4. Review scraper logs in browser console

---

Last Updated: December 2024
