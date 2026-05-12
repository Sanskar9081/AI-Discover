-- Bug Reports Table
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  page_feature TEXT NOT NULL,
  severity TEXT DEFAULT 'medium',
  user_email TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ad Requests Table
CREATE TABLE IF NOT EXISTS ad_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  website TEXT NOT NULL,
  description TEXT NOT NULL,
  budget TEXT DEFAULT 'contact for pricing',
  contact_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow all users to insert, only admin to read/delete
CREATE POLICY "Anyone can submit bug reports" ON bug_reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can view bug reports" ON bug_reports
  FOR SELECT USING (auth.email() = 'sanskarsolanki9081@gmail.com');

CREATE POLICY "Anyone can submit ad requests" ON ad_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admin can view ad requests" ON ad_requests
  FOR SELECT USING (auth.email() = 'sanskarsolanki9081@gmail.com');
