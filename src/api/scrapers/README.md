# 🔧 AI Tools Data Scrapers

This directory contains modular scrapers for aggregating AI tools from multiple sources.

## Architecture Overview

```
scrapers/
├── productHuntScraper.ts    │ ProductHunt API integration
├── githubScraper.ts         │ GitHub awesome-lists aggregator
├── huggingfaceScraper.ts    │ HuggingFace Hub models
└── aggregator.ts            │ Orchestrator & deduplicator
```

## Data Flow

```
ProductHunt API    GitHub Repos    HuggingFace Hub
       │                 │               │
       └─────────┬───────┴───────┬───────┘
                 │               │
            fetchProductHuntTools()
            fetchGitHubAwesomeTools()
            fetchHuggingFaceModels()
                 │               │
                 └────┬──────────┘
                      │
            aggregateAllTools()
                      │
            deduplicateTools()
                      │
            bulkImportTools()
                      │
            Supabase Database
```

## Module Documentation

### 1. ProductHunt Scraper (`productHuntScraper.ts`)

**Purpose**: Fetch trending AI tools from ProductHunt

**Key Functions**:
- `fetchProductHuntTools()` - Main entry point
- `transformProductHuntData()` - Maps PH format to AITool schema
- `detectPricing()` - Parses pricing from description
- `extractFeatures()` - Extracts tool capabilities
- `hasFreeOption()` - Checks for free tier

**Example Usage**:
```typescript
import { fetchProductHuntTools } from './productHuntScraper';

const tools = await fetchProductHuntTools();
// Returns: TransformedTool[]
```

**API Requirements**:
- Environment Variable: `VITE_PRODUCTHUNT_API_TOKEN`
- Rate Limit: 50 requests/hour
- Response Time: 2-5 seconds per tool

**Data Statistics**:
- Initial Import: ~100-150 tools
- Daily New: ~10-20 tools
- Quality: ⭐⭐⭐⭐⭐ (highest rated tools)

---

### 2. GitHub Scraper (`githubScraper.ts`)

**Purpose**: Aggregate curated tools from GitHub awesome-ai-tools repositories

**Key Functions**:
- `fetchGitHubAwesomeTools()` - Fetches from awesome-lists
- `transformGitHubRepo()` - Converts repo to tool format
- `parseAwesomeMarkdown()` - Extracts links from markdown
- `detectCategoryFromDescription()` - Infers tool category
- `getHuggingFaceTrending()` - Special handling for trending repos

**Example Usage**:
```typescript
import { fetchGitHubAwesomeTools } from './githubScraper';

const tools = await fetchGitHubAwesomeTools();
// Returns: TransformedTool[] with open-source focus
```

**API Requirements**:
- Environment Variable: `VITE_GITHUB_API_TOKEN` (optional but recommended)
- Rate Limit: 5,000 requests/hour (authenticated), 60/hour (unauthenticated)
- Response Time: 5-10 seconds for full list

**Data Statistics**:
- Initial Import: ~300-500 tools
- Frequency: Weekly (curated lists update slowly)
- Quality: ⭐⭐⭐⭐ (community-vetted open-source)
- Coverage: 70% open-source tools

---

### 3. HuggingFace Scraper (`huggingfaceScraper.ts`)

**Purpose**: Import AI models and datasets from HuggingFace Hub

**Key Functions**:
- `fetchHuggingFaceModels()` - Fetches trending models
- `transformHuggingFaceModel()` - Maps model to tool schema
- `mapPipelineToCategory()` - Converts pipeline_tag to platform categories
- `getHuggingFaceTrending()` - Gets top models by downloads

**Example Usage**:
```typescript
import { fetchHuggingFaceModels } from './huggingfaceScraper';

const models = await fetchHuggingFaceModels();
// Returns: TransformedTool[] of models
```

**Supported Categories**:
- text-generation (LLMs)
- image-classification
- object-detection
- speech-recognition
- translation
- summarization
- question-answering
- And 15+ more...

**API Requirements**:
- Environment Variable: `VITE_HUGGINGFACE_API_TOKEN` (optional)
- Rate Limit: 100 requests/minute
- Response Time: 3-7 seconds

**Data Statistics**:
- Initial Import: ~200-300 models
- Daily New: ~50-100 trending models
- Quality: ⭐⭐⭐ (varies by model, includes pre-release)

---

### 4. Aggregator (`aggregator.ts`)

**Purpose**: Orchestrates all scrapers and handles database operations

**Key Functions**:
- `aggregateAllTools()` - Runs all scrapers in parallel
- `deduplicateTools()` - Removes duplicates by name
- `bulkImportTools()` - Batch insert to database
- `runFullImport()` - Complete pipeline

**Example Usage**:
```typescript
import { runFullImport } from './aggregator';

await runFullImport();
// Runs full pipeline: aggregate → deduplicate → import
```

**Deduplication Strategy**:
- Primary Key: Tool name (lowercased, trimmed)
- Conflict Resolution: Keeps entry with higher score
  - Score = rating + (featured ? 1 : 0) + (trending ? 1 : 0)

**Database Operations**:
- Method: `upsert` with `onConflict: 'name'`
- Batch Size: 50 records per batch
- Rate Limiting: 500ms delay between batches

---

## Data Schema

All scrapers transform data to this common schema:

```typescript
interface TransformedTool {
  name: string;                    // Tool display name
  description: string;             // Short description
  category: string;                // Platform category
  pricing: string;                 // 'Free', 'Freemium', 'Paid', etc.
  logo: string;                    // URL to logo
  url: string;                     // Official website/tool URL
  featured: boolean;               // Manually marked as featured
  trending: boolean;               // Currently trending
  rating: number;                  // 0-5 star rating
  reviewCount: number;             // Number of reviews
  features: string[];              // Tool capabilities
  tags: string[];                  // Related keywords
  freePlan: boolean;               // Has free tier
  easeOfUse: string;               // 'Easy', 'Medium', 'Hard'
  mainFunctionality: string;       // Primary use case
  views: number;                   // View count
  clicks: number;                  // Click count
  status: string;                  // 'active', 'archived', etc.
}
```

---

## Adding New Scrapers

To add a new scraper source:

1. **Create new file**: `src/api/scrapers/newSourceScraper.ts`

2. **Implement interface**:
```typescript
export const fetchNewSourceTools = async (): Promise<TransformedTool[]> => {
  const tools: TransformedTool[] = [];
  
  try {
    // 1. Fetch from API
    const response = await fetch('...');
    const data = await response.json();
    
    // 2. Transform data
    data.forEach(item => {
      tools.push({
        name: item.name,
        description: item.desc,
        // ... map all required fields
      });
    });
    
    return tools;
  } catch (error) {
    console.error('Failed to fetch from source:', error);
    return [];
  }
};
```

3. **Add to aggregator**:
```typescript
// In aggregateAllTools()
try {
  const newSourceTools = await fetchNewSourceTools();
  allTools.push(...newSourceTools);
} catch (error) {
  console.error('NewSource fetch failed:', error);
}
```

---

## Performance Metrics

### Load Times (Typical)
| Source | First Run | Subsequent | Avg Items |
|--------|-----------|-----------|-----------|
| ProductHunt | 3-5s | 2-3s | 100-150 |
| GitHub | 5-10s | 3-5s | 300-500 |
| HuggingFace | 3-7s | 2-4s | 200-300 |
| **Total** | **15-25s** | **10-15s** | **~1000** |

### Database Performance
- Upsert batch of 50: ~500ms
- Full import of 1000 items: ~10-12s
- Deduplication: ~1-2s

### API Rate Limits
- ProductHunt: 50/hour → 1 tool every 72 seconds max
- GitHub: 5,000/hour → Safe for frequent imports
- HuggingFace: 100/minute → Easily sustainable

---

## Error Handling

Each scraper includes try-catch blocks and returns empty arrays on failure:

```typescript
try {
  // Scrape data
} catch (error) {
  console.error('Scraper failed:', error);
  return []; // Graceful degradation
}
```

The aggregator continues with other sources if one fails.

---

## Testing

### Manual Testing
```typescript
// In browser console while on Admin page
import { aggregateAllTools } from '@/api/scrapers/aggregator';

const tools = await aggregateAllTools();
console.log(`Aggregated ${tools.length} tools`);
```

### Unit Test Template
```typescript
import { fetchProductHuntTools } from './productHuntScraper';

test('ProductHunt scraper returns valid tools', async () => {
  const tools = await fetchProductHuntTools();
  
  expect(tools.length).toBeGreaterThan(0);
  tools.forEach(tool => {
    expect(tool.name).toBeDefined();
    expect(tool.url).toMatch(/^https?:\/\//);
  });
});
```

---

## Troubleshooting

### "0 tools returned from scrapers"
1. Check API tokens in `.env.local`
2. Verify network connectivity
3. Check API service status
4. Review browser console for errors

### "Rate limit exceeded"
1. Increase delay between batches in aggregator
2. Run import at off-peak times
3. Consider upgrade API plans for higher limits

### "Duplicate tools in database"
1. Upsert logic isn't working - check Supabase permissions
2. Check that `name` field matches exactly (case-sensitive)
3. Consider clearing and re-importing

---

## Future Improvements

- [ ] Add langchain integration for AI-powered tool categorization
- [ ] Implement ML-based duplicate detection
- [ ] Add user voting on tool quality
- [ ] Create marketplace for tool publishers
- [ ] Add A/B testing for featured tools
- [ ] Real-time tool status monitoring
- [ ] Community contribution system

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Maintained By**: AI Tool Hub Team
