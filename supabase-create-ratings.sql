-- Create ratings table to track individual user ratings
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id TEXT NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_ratings_tool_id ON ratings(tool_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_tool_user ON ratings(tool_id, user_id);

-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS ratings_insert_policy ON ratings;
DROP POLICY IF EXISTS ratings_update_policy ON ratings;
DROP POLICY IF EXISTS ratings_read_policy ON ratings;

-- Policy: Anyone can rate (insert/update)
CREATE POLICY ratings_insert_policy ON ratings
FOR INSERT WITH CHECK (true);

CREATE POLICY ratings_update_policy ON ratings
FOR UPDATE USING (true) WITH CHECK (true);

-- Policy: Anyone can read ratings
CREATE POLICY ratings_read_policy ON ratings
FOR SELECT USING (true);

-- Create function to update tool rating statistics
CREATE OR REPLACE FUNCTION update_tool_rating_stats(tool_id TEXT)
RETURNS TABLE(avg_rating DECIMAL, total_reviews INT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ROUND(AVG(rating), 1), 0::DECIMAL) as avg_rating,
    COUNT(*)::INT as total_reviews
  FROM ratings
  WHERE ratings.tool_id = $1;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update tool rating when a rating is added/updated
CREATE OR REPLACE FUNCTION update_tool_rating_on_rating_change()
RETURNS TRIGGER AS $$
DECLARE
  stats RECORD;
BEGIN
  -- Get updated stats
  SELECT * INTO stats FROM update_tool_rating_stats(NEW.tool_id);
  
  -- Update the tool
  UPDATE tools
  SET 
    rating = stats.avg_rating,
    reviewcount = stats.total_reviews,
    updated_at = NOW()
  WHERE id = NEW.tool_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS rating_change_trigger ON ratings;
CREATE TRIGGER rating_change_trigger
AFTER INSERT OR UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_tool_rating_on_rating_change();

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_tool_views(tool_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE tools
  SET views = COALESCE(views, 0) + 1,
      updated_at = NOW()
  WHERE id = $1;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment clicks
CREATE OR REPLACE FUNCTION increment_tool_clicks(tool_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE tools
  SET clicks = COALESCE(clicks, 0) + 1,
      updated_at = NOW()
  WHERE id = $1;
END;
$$ LANGUAGE plpgsql;
