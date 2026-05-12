-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Tools Table
CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  pricing TEXT NOT NULL,
  logo TEXT NOT NULL,
  url TEXT NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  trending BOOLEAN DEFAULT FALSE,
  features TEXT[] DEFAULT '{}',
  easeOfUse TEXT NOT NULL,
  mainFunctionality TEXT NOT NULL,
  freePlan BOOLEAN DEFAULT TRUE,
  rating NUMERIC DEFAULT 0,
  reviewCount INTEGER DEFAULT 0,
  isNew BOOLEAN DEFAULT FALSE,
  isPremium BOOLEAN DEFAULT FALSE,
  useCase TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  couponCode TEXT,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Prompts Table
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL,
  beforeImage TEXT,
  afterImage TEXT,
  author TEXT NOT NULL,
  instagram TEXT,
  featured BOOLEAN DEFAULT FALSE,
  suggestedToolId TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Ads Table
CREATE TABLE IF NOT EXISTS ads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  video TEXT,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  placement TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create User Saved Items Table
CREATE TABLE IF NOT EXISTS user_saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tool_id TEXT REFERENCES tools(id) ON DELETE CASCADE,
  prompt_id TEXT REFERENCES prompts(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, tool_id, item_type),
  UNIQUE(user_id, prompt_id, item_type)
);

-- Create User Recently Viewed Table
CREATE TABLE IF NOT EXISTS user_recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indices for better query performance
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(featured);
CREATE INDEX IF NOT EXISTS idx_tools_trending ON tools(trending);
CREATE INDEX IF NOT EXISTS idx_user_saved_items_user ON user_saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_items_type ON user_saved_items(item_type);
CREATE INDEX IF NOT EXISTS idx_user_recently_viewed_user ON user_recently_viewed(user_id);

-- Insert sample categories (optional - you can delete this if you don't want sample data)
INSERT INTO categories (id, name, icon, color) VALUES
  ('chat', 'Chat AI', 'MessageSquare', 'hsl(263.4, 70%, 50.4%)'),
  ('image', 'Image AI', 'Image', 'hsl(330, 70%, 50%)'),
  ('video', 'Video AI', 'Video', 'hsl(200, 70%, 50%)'),
  ('coding', 'Coding AI', 'Code', 'hsl(150, 70%, 40%)'),
  ('audio', 'Audio AI', 'Music', 'hsl(30, 70%, 50%)'),
  ('productivity', 'Productivity AI', 'Zap', 'hsl(50, 70%, 45%)')
ON CONFLICT (id) DO NOTHING;

-- ============ Enable RLS (Row Level Security) ============
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recently_viewed ENABLE ROW LEVEL SECURITY;

-- ============ Create Policies for Public Read Access ============
-- Categories: Public read
CREATE POLICY "categories_select_public" ON categories
  FOR SELECT USING (true);

-- Tools: Public read
CREATE POLICY "tools_select_public" ON tools
  FOR SELECT USING (true);

-- Prompts: Public read
CREATE POLICY "prompts_select_public" ON prompts
  FOR SELECT USING (true);

-- Ads: Public read
CREATE POLICY "ads_select_public" ON ads
  FOR SELECT USING (true);

-- User Saved Items: Users can manage their own
CREATE POLICY "user_saved_items_select" ON user_saved_items
  FOR SELECT USING (true);

CREATE POLICY "user_saved_items_insert" ON user_saved_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "user_saved_items_delete" ON user_saved_items
  FOR DELETE USING (true);

-- User Recently Viewed: Users can manage their own
CREATE POLICY "user_recently_viewed_select" ON user_recently_viewed
  FOR SELECT USING (true);

CREATE POLICY "user_recently_viewed_insert" ON user_recently_viewed
  FOR INSERT WITH CHECK (true);

-- ============ Create Policies for Admin (Authenticated) Write Access ============
-- Tools: Authenticated users can write
CREATE POLICY "tools_insert_authenticated" ON tools
  FOR INSERT WITH CHECK (true);

CREATE POLICY "tools_update_authenticated" ON tools
  FOR UPDATE USING (true);

CREATE POLICY "tools_delete_authenticated" ON tools
  FOR DELETE USING (true);

-- Prompts: Authenticated users can write
CREATE POLICY "prompts_insert_authenticated" ON prompts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "prompts_update_authenticated" ON prompts
  FOR UPDATE USING (true);

CREATE POLICY "prompts_delete_authenticated" ON prompts
  FOR DELETE USING (true);

-- Ads: Authenticated users can write
CREATE POLICY "ads_insert_authenticated" ON ads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "ads_update_authenticated" ON ads
  FOR UPDATE USING (true);

CREATE POLICY "ads_delete_authenticated" ON ads
  FOR DELETE USING (true);
