/**
 * AI Tools Data Aggregator & Bulk Importer
 * Orchestrates all scrapers and imports data to Supabase
 */

import { fetchProductHuntTools } from './productHuntScraper';
import { fetchGitHubAwesomeTools } from './githubScraper';
import { fetchHuggingFaceModels, getHuggingFaceTrending } from './huggingfaceScraper';
import { fetchFuturpediaTools } from './futurepediaScraper';
import { supabase } from '@/lib/supabase';

interface TransformedTool {
  name: string;
  description: string;
  category: string;
  pricing: string;
  logo: string;
  url: string;
  featured: boolean;
  trending: boolean;
  rating: number;
  reviewCount: number;
  features: string[];
  tags: string[];
  freePlan: boolean;
  easeOfUse: string;
  mainFunctionality: string;
  views: number;
  clicks: number;
  status: string;
}

/**
 * Aggregate tools from all sources
 */
export const aggregateAllTools = async (): Promise<TransformedTool[]> => {
  console.log('🚀 Starting AI Tools Aggregation...');
  console.log('📋 Environment Check:');
  console.log(`  - Futurepedia: ✅ Available`);
  console.log(`  - ProductHunt Token: ${import.meta.env.VITE_PRODUCTHUNT_API_TOKEN ? '✅ Set' : '❌ Missing'}`);
  console.log(`  - GitHub Token: ${import.meta.env.VITE_GITHUB_API_TOKEN ? '✅ Set' : '❌ Missing'}`);
  console.log(`  - HuggingFace Token: ${import.meta.env.VITE_HUGGINGFACE_API_TOKEN ? '✅ Set' : '❌ Missing'}`);

  const allTools: TransformedTool[] = [];

  try {
    // PRIMARY SOURCE: Fetch from Futurepedia (2500+ comprehensive AI tools)
    try {
      console.log('🌐 Fetching from Futurepedia (Primary Source - Live Data)...');
      console.log('   Target: ~2,567 tools from Futurepedia database');
      const futurpediaTools = await fetchFuturpediaTools();
      allTools.push(...futurpediaTools);
      console.log(`✅ Added ${futurpediaTools.length} tools from Futurepedia`);
      if (futurpediaTools.length > 100) {
        console.log(`   📊 Large dataset detected (${futurpediaTools.length} tools)`);
      }
    } catch (error) {
      console.error('❌ Futurepedia fetch failed:', error);
    }

    // SECONDARY SOURCES: Fetch from other scrapers for additional diversity
    // Fetch from ProductHunt
    try {
      console.log('📦 Fetching from ProductHunt (Secondary)...');
      const phTools = await fetchProductHuntTools();
      allTools.push(...phTools);
      console.log(`✅ Added ${phTools.length} tools from ProductHunt`);
    } catch (error) {
      console.error('❌ ProductHunt fetch failed:', error);
    }

    // Fetch from GitHub
    try {
      console.log('📦 Fetching from GitHub (Secondary)...');
      const ghTools = await fetchGitHubAwesomeTools();
      allTools.push(...ghTools);
      console.log(`✅ Added ${ghTools.length} tools from GitHub`);
    } catch (error) {
      console.error('❌ GitHub fetch failed:', error);
    }

    // Fetch from HuggingFace Models
    try {
      console.log('📦 Fetching from HuggingFace Models (Secondary)...');
      const hfModels = await fetchHuggingFaceModels();
      allTools.push(...hfModels);
      console.log(`✅ Added ${hfModels.length} models from HuggingFace`);
    } catch (error) {
      console.error('❌ HuggingFace fetch failed:', error);
    }

    // Fetch HuggingFace Trending
    try {
      console.log('📦 Fetching HuggingFace Trending (Secondary)...');
      const hfTrending = await getHuggingFaceTrending();
      allTools.push(...hfTrending);
      console.log(`✅ Added ${hfTrending.length} trending from HuggingFace`);
    } catch (error) {
      console.error('❌ HuggingFace trending fetch failed:', error);
    }

    console.log(`📊 Total tools aggregated (pre-dedup): ${allTools.length}`);
    return allTools;
  } catch (error) {
    console.error('❌ Aggregation failed:', error);
    return [];
  }
};

/**
 * Deduplicate tools by name
 */
export const deduplicateTools = (tools: TransformedTool[]): TransformedTool[] => {
  const seen = new Map<string, TransformedTool>();

  for (const tool of tools) {
    const key = tool.name.toLowerCase().trim();
    
    // Keep the one with more information (higher featured/trending/rating)
    if (!seen.has(key)) {
      seen.set(key, tool);
    } else {
      const existing = seen.get(key)!;
      const score = (tool.rating || 0) + (tool.featured ? 1 : 0) + (tool.trending ? 1 : 0);
      const existingScore = (existing.rating || 0) + (existing.featured ? 1 : 0) + (existing.trending ? 1 : 0);
      
      if (score > existingScore) {
        seen.set(key, tool);
      }
    }
  }

  return Array.from(seen.values());
};

/**
 * Bulk import tools to Supabase
 * Returns: { imported: number, existing: number, total: number }
 */
export const bulkImportTools = async (tools: TransformedTool[]): Promise<any> => {
  try {
    console.log(`📤 Importing ${tools.length} tools to database...`);

    // STEP 1: Fetch existing tools from database to avoid duplicates
    console.log('🔍 Checking for existing tools in database...');
    const { data: existingTools } = await supabase
      .from('tools')
      .select('name')
      .limit(10000);

    const existingNames = new Set(
      (existingTools || []).map((tool: any) => tool.name.toLowerCase().trim())
    );
    console.log(`📌 Found ${existingNames.size} existing tools in database`);

    // STEP 2: Filter out tools that already exist
    const newTools = tools.filter(tool => !existingNames.has(tool.name.toLowerCase().trim()));
    const duplicateCount = tools.length - newTools.length;
    console.log(`✅ ${newTools.length} new tools to import (${duplicateCount} already exist)`);

    if (newTools.length === 0) {
      console.log('⏭️  All tools already exist in database. Skipping import.');
      console.log(`📊 Summary: 0 new, ${duplicateCount} existing (${tools.length} total)`);
      return { imported: 0, existing: duplicateCount, total: tools.length };
    }

    // Transform for database - use exact lowercase names that PostgreSQL created from unquoted identifiers
    const dbTools = newTools.map((tool, index) => ({
      id: `tool_${Date.now()}_${index}`, // Generate unique ID
      name: tool.name,
      description: tool.description,
      category: tool.category,
      pricing: tool.pricing,
      logo: tool.logo,
      url: tool.url,
      featured: tool.featured || false,
      trending: tool.trending || false,
      rating: tool.rating || 0,
      reviewcount: tool.reviewCount || 0,
      features: tool.features || [],
      tags: tool.tags || [],
      freeplan: tool.freePlan ?? true,
      easeofuse: tool.easeOfUse || 'Unknown', // PostgreSQL lowercased from easeOfUse
      mainfunctionality: tool.mainFunctionality || 'Unknown', // PostgreSQL lowercased from mainFunctionality
      views: tool.views || 0,
      clicks: tool.clicks || 0,
      isnew: false,
      ispremium: false,
      usecase: [],
    }));

    console.log(`📋 Sample tool being inserted:`, JSON.stringify(dbTools[0], null, 2));

    // Insert in batches to avoid overwhelming the database
    const batchSize = 50;
    let successCount = 0;
    const totalBatches = Math.ceil(dbTools.length / batchSize);

    console.log(`📦 Starting batch import: ${totalBatches} batches of ${batchSize} tools`);

    for (let i = 0; i < dbTools.length; i += batchSize) {
      const batch = dbTools.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const progress = Math.round((batchNumber / totalBatches) * 100);
      
      try {
        console.log(`🔄 Batch ${batchNumber}/${totalBatches} (${progress}%): Sending ${batch.length} tools...`);
        
        const { data, error } = await supabase
          .from('tools')
          .insert(batch)
          .select();

        if (error) {
          console.error(`❌ Batch ${batchNumber} error:`, error);
          console.error(`   Error code: ${error.code}`);
          console.error(`   Message: ${error.message}`);
          // Continue with next batch even if one fails
        } else {
          const inserted = data ? data.length : batch.length;
          successCount += inserted;
          console.log(`✅ Batch ${batchNumber} inserted: ${inserted} tools (Total: ${successCount}/${dbTools.length})`);
        }
      } catch (error) {
        console.error(`❌ Batch ${batchNumber} exception:`, error);
      }

      // Small delay between batches to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ Import complete! ${successCount} new tools added`);
    console.log(`   Final stats: ${successCount}/${dbTools.length} imported successfully`);
    return { imported: successCount, existing: duplicateCount, total: tools.length };
  } catch (error) {
    console.error('❌ Bulk import failed:', error);
    return { imported: 0, existing: 0, total: 0 };
  }
};

/**
 * Main function to run full import cycle
 */
export const runFullImport = async (): Promise<void> => {
  try {
    console.log('🌟 Starting Full AI Tools Import Process');
    console.log('==========================================');

    // Step 1: Aggregate from all sources
    const tools = await aggregateAllTools();

    // Step 2: Deduplicate
    const deduplicated = deduplicateTools(tools);
    console.log(`🔄 Deduplicated: ${tools.length} → ${deduplicated.length} unique tools`);

    // Step 3: Bulk import
    const imported = await bulkImportTools(deduplicated);

    console.log('==========================================');
    console.log(`✅ Process Complete! Imported ${imported} tools`);
  } catch (error) {
    console.error('❌ Full import process failed:', error);
  }
};

/**
 * Schedule import to run daily
 * This can be called from a cron job or scheduled function
 */
export const scheduleImport = (): void => {
  // Run immediately first time
  runFullImport();

  // Then run every 24 hours
  setInterval(runFullImport, 24 * 60 * 60 * 1000);

  console.log('📅 AI Tools import scheduled for daily updates');
};
