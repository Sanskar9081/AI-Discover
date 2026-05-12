/**
 * API endpoint for triggering AI tools import
 * Can be called manually or by scheduled jobs
 * 
 * Usage: POST /api/import-tools
 * Response: { success: boolean, imported: number, message: string }
 */

import { runFullImport, aggregateAllTools, deduplicateTools, bulkImportTools } from './scrapers/aggregator';
import { supabase } from '@/lib/supabase';

interface ImportResponse {
  success: boolean;
  imported: number;
  message: string;
  timestamp: string;
  errors?: string[];
}

/**
 * Handler for tool import endpoint
 */
export const handleImport = async (): Promise<ImportResponse> => {
  const startTime = Date.now();
  const errors: string[] = [];

  try {
    console.log('🚀 Import endpoint triggered');

    // Check if tokens are missing
    const missingTokens = [
      !import.meta.env.VITE_PRODUCTHUNT_API_TOKEN && 'ProductHunt (VITE_PRODUCTHUNT_API_TOKEN)',
      !import.meta.env.VITE_GITHUB_API_TOKEN && 'GitHub (VITE_GITHUB_API_TOKEN)',
      !import.meta.env.VITE_HUGGINGFACE_API_TOKEN && 'HuggingFace (VITE_HUGGINGFACE_API_TOKEN)',
    ].filter(Boolean);

    if (missingTokens.length > 0) {
      const errorMsg = `Missing API tokens: ${missingTokens.join(', ')}. Check .env.local configuration.`;
      console.warn(errorMsg);
      errors.push(errorMsg);
    }

    // Aggregate tools from all sources
    const tools = await aggregateAllTools();
    
    if (tools.length === 0) {
      const msg = errors.length > 0 
        ? `Failed to fetch tools. ${errors.join(' ')}`
        : 'Failed to fetch tools from any source. Check browser console for details.';
      
      console.error('❌ Import failed - no tools fetched');
      return {
        success: false,
        imported: 0,
        message: msg,
        timestamp: new Date().toISOString(),
        errors,
      };
    }

    // Deduplicate
    const deduplicated = deduplicateTools(tools);
    console.log(`✅ Deduplication: ${tools.length} → ${deduplicated.length} unique tools`);

    // Bulk import
    const importResult = await bulkImportTools(deduplicated);
    console.log(`✅ Import result:`, importResult);

    // Log to import history
    try {
      await saveImportLog({
        imported_count: importResult.imported,
        total_processed: deduplicated.length,
        duplicates_removed: tools.length - deduplicated.length,
        status: 'success',
        duration_ms: Date.now() - startTime,
        errors: errors,
      });
    } catch (logError) {
      console.warn('⚠️ Could not save import log (offline mode):', logError);
    }

    // Provide detailed feedback
    let message = '';
    if (importResult.imported > 0) {
      message = `✅ Successfully imported ${importResult.imported} new tools`;
      if (importResult.existing > 0) {
        message += ` (${importResult.existing} tools already exist)`;
      }
    } else if (importResult.existing > 0) {
      message = `ℹ️  All ${importResult.existing} tools already exist in database. No new imports.`;
    } else {
      message = '⚠️  No tools processed';
    }

    if (errors.length > 0) {
      message += ` (with ${errors.length} warnings)`;
    }

    return {
      success: true,
      imported: importResult.imported,
      message,
      timestamp: new Date().toISOString(),
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    errors.push(errorMsg);

    // Log failed import
    await saveImportLog({
      imported_count: 0,
      total_processed: 0,
      duplicates_removed: 0,
      status: 'failed',
      duration_ms: Date.now() - startTime,
      errors,
    });

    return {
      success: false,
      imported: 0,
      message: `Import failed: ${errorMsg}`,
      timestamp: new Date().toISOString(),
      errors,
    };
  }
};

/**
 * Save import history to database
 */
export const saveImportLog = async (log: {
  imported_count: number;
  total_processed: number;
  duplicates_removed: number;
  status: 'success' | 'failed';
  duration_ms: number;
  errors: string[];
}): Promise<void> => {
  try {
    await supabase
      .from('import_history')
      .insert({
        imported_count: log.imported_count,
        total_processed: log.total_processed,
        duplicates_removed: log.duplicates_removed,
        status: log.status,
        duration_ms: log.duration_ms,
        errors: log.errors,
        created_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Failed to save import log:', error);
  }
};

/**
 * Get import history
 */
export const getImportHistory = async (limit: number = 10): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('import_history')
      .select()
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch import history:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error getting import history:', error);
    return [];
  }
};

/**
 * Clear import history
 */
export const clearImportHistory = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('import_history')
      .delete()
      .neq('id', null); // Delete all except none (all rows)

    if (error) {
      console.error('Failed to clear import history:', error);
      return false;
    }

    console.log('✅ Import history cleared');
    return true;
  } catch (error) {
    console.error('Error clearing import history:', error);
    return false;
  }
};

/**
 * Clear all imported tools and reimport fresh
 */
export const clearAndReimport = async (): Promise<ImportResponse> => {
  try {
    console.log('🗑️  Clearing all tools from database...');
    
    // Delete all tools
    const { error: deleteError } = await supabase
      .from('tools')
      .delete()
      .neq('id', null); // Delete all rows

    if (deleteError) {
      console.error('Failed to delete tools:', deleteError);
      return {
        success: false,
        imported: 0,
        message: `Failed to clear tools: ${deleteError.message}`,
        timestamp: new Date().toISOString(),
        errors: [deleteError.message],
      };
    }

    console.log('✅ All tools cleared');

    // Now reimport fresh
    console.log('🔄 Reimporting fresh tools...');
    return handleImport();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      imported: 0,
      message: `Clear and reimport failed: ${errorMsg}`,
      timestamp: new Date().toISOString(),
      errors: [errorMsg],
    };
  }
};
