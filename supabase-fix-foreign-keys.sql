-- Fix foreign key constraints to use ON DELETE CASCADE
-- This allows deleting tools without violating foreign key constraints

-- Drop existing constraints
ALTER TABLE user_saved_items DROP CONSTRAINT IF EXISTS user_saved_items_tool_id_fkey;
ALTER TABLE user_saved_items DROP CONSTRAINT IF EXISTS user_saved_items_prompt_id_fkey;
ALTER TABLE user_recently_viewed DROP CONSTRAINT IF EXISTS user_recently_viewed_tool_id_fkey;

-- Recreate with ON DELETE CASCADE
ALTER TABLE user_saved_items ADD CONSTRAINT user_saved_items_tool_id_fkey 
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;

ALTER TABLE user_saved_items ADD CONSTRAINT user_saved_items_prompt_id_fkey 
  FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE;

ALTER TABLE user_recently_viewed ADD CONSTRAINT user_recently_viewed_tool_id_fkey 
  FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE;
