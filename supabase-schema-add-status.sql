-- Add missing columns to tools table
ALTER TABLE IF EXISTS tools ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE IF EXISTS tools ADD COLUMN IF NOT EXISTS couponCode TEXT;
ALTER TABLE IF EXISTS tools ADD COLUMN IF NOT EXISTS useCase TEXT[];
ALTER TABLE IF EXISTS tools ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE IF EXISTS tools ADD COLUMN IF NOT EXISTS isNew BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS tools ADD COLUMN IF NOT EXISTS isPremium BOOLEAN DEFAULT false;
ALTER TABLE IF EXISTS tools ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE IF EXISTS tools ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0;

-- Add status column to prompts table (if not exists)
ALTER TABLE IF EXISTS prompts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Create indexes for status to improve query performance
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_prompts_status ON prompts(status);

-- Update existing rows to 'approved' so they display
UPDATE tools SET status = 'approved' WHERE status IS NULL;
UPDATE prompts SET status = 'approved' WHERE status IS NULL;
