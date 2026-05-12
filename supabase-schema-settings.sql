-- Create settings table for homepage stats and admin configurations
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'string', -- string, number, json, boolean
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Insert default settings
INSERT INTO settings (key, value, type, description) VALUES
  ('homepage_total_tools', '100+', 'string', 'Total tools display on homepage'),
  ('homepage_categories', '10+', 'string', 'Total categories display on homepage'),
  ('homepage_update_freq', 'Daily', 'string', 'Update frequency display on homepage'),
  ('homepage_pricing', 'Free', 'string', 'Pricing model display on homepage')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy for read access (public can read)
CREATE POLICY "Allow public read access to settings" ON settings
  FOR SELECT USING (true);

-- Policy for admin write access
CREATE POLICY "Allow admin write access to settings" ON settings
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow admin insert access to settings" ON settings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create a table to manage featured tools and prompts metadata (optional, for future use)
CREATE TABLE IF NOT EXISTS featured_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('tool', 'prompt')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(item_id, item_type)
);

CREATE INDEX IF NOT EXISTS idx_featured_items_type ON featured_items(item_type);
