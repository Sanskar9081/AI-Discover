-- Create use_cases table
CREATE TABLE IF NOT EXISTS use_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  icon TEXT DEFAULT 'Zap',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;

-- Allow all users to read
CREATE POLICY "Allow public read use_cases"
  ON use_cases FOR SELECT
  USING (true);

-- Allow only admin to insert/update/delete
CREATE POLICY "Allow admin write use_cases"
  ON use_cases FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow admin update use_cases"
  ON use_cases FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin delete use_cases"
  ON use_cases FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert default use cases
INSERT INTO use_cases (key, label, icon, order_index) VALUES
  ('students', 'For Students', 'GraduationCap', 0),
  ('developers', 'For Developers', 'Code', 1),
  ('creators', 'For Creators', 'PenTool', 2)
ON CONFLICT DO NOTHING;
