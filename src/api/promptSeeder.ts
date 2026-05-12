import { supabase } from '@/lib/supabase';
import { promptsDatabase } from '@/data/promptsDatabase';
import type { Prompt } from '@/data/tools';

interface PromptImportResponse {
  success: boolean;
  imported: number;
  skipped: number;
  message: string;
  errors?: string[];
}

// Generate a UUID v4
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const seedPromptsDatabase = async (): Promise<PromptImportResponse> => {
  const errors: string[] = [];
  let imported = 0;
  let skipped = 0;

  try {
    console.log('🚀 Starting prompt seeding...');

    if (promptsDatabase.length === 0) {
      return {
        success: false,
        imported: 0,
        skipped: 0,
        message: 'No prompts in database to import',
        errors: ['Prompt database is empty'],
      };
    }

    console.log(`📦 Preparing to import ${promptsDatabase.length} prompts`);

    // Fetch existing prompts to avoid duplicates
    const { data: existingPrompts, error: fetchError } = await supabase
      .from('prompts')
      .select('title');

    if (fetchError) {
      throw new Error(`Failed to fetch existing prompts: ${fetchError.message}`);
    }

    const existingTitles = new Set(existingPrompts?.map(p => p.title) || []);

    // Prepare prompts for insertion - using only essential fields
    const promptsToInsert: any[] = [];

    for (const prompt of promptsDatabase) {
      if (existingTitles.has(prompt.title)) {
        console.log(`⏭️ Skipping "${prompt.title}" - already exists`);
        skipped++;
        continue;
      }

      // Create prompt with only the most essential fields
      const promptObj: any = {
        id: generateUUID(),
        title: prompt.title,
        prompt: prompt.prompt,
        category: prompt.category,
        author: prompt.author,
        instagram: prompt.instagram,
      };

      promptsToInsert.push(promptObj);
    }

    if (promptsToInsert.length === 0) {
      return {
        success: true,
        imported: 0,
        skipped,
        message: 'All prompts already exist in database',
      };
    }

    // Insert prompts
    const { error: insertError } = await supabase
      .from('prompts')
      .insert(promptsToInsert);

    if (insertError) {
      const errorMsg = `Insert error: ${insertError.message}`;
      console.error(`❌ ${errorMsg}`);
      errors.push(errorMsg);
    } else {
      imported = promptsToInsert.length;
      console.log(`✅ Imported ${imported} prompts`);
    }

    const successMsg = `Successfully imported ${imported} prompts${skipped > 0 ? ` (${skipped} duplicates skipped)` : ''}`;
    console.log(`🎉 ${successMsg}`);

    return {
      success: errors.length === 0,
      imported,
      skipped,
      message: successMsg,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('❌ Prompt seeding failed:', errorMessage);
    
    return {
      success: false,
      imported,
      skipped,
      message: 'Failed to seed prompts database',
      errors: [errorMessage],
    };
  }
};
