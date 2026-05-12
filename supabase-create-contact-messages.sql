-- ============ CREATE CONTACT_MESSAGES TABLE ============

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages
CREATE POLICY "Allow public to insert contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated admins to read contact messages
CREATE POLICY "Allow admins to read contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (true);

-- Allow authenticated admins to update contact messages
CREATE POLICY "Allow admins to update contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Allow authenticated admins to delete contact messages
CREATE POLICY "Allow admins to delete contact messages" 
  ON public.contact_messages 
  FOR DELETE 
  USING (true);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS contact_messages_updated_at_trigger ON public.contact_messages;
CREATE TRIGGER contact_messages_updated_at_trigger
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION update_contact_messages_updated_at();
