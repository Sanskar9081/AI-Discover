-- Create import_history table for tracking bulk data imports
CREATE TABLE IF NOT EXISTS import_history (
  id BIGSERIAL PRIMARY KEY,
  imported_count INTEGER NOT NULL DEFAULT 0,
  total_processed INTEGER NOT NULL DEFAULT 0,
  duplicates_removed INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed')),
  duration_ms INTEGER NOT NULL DEFAULT 0,
  errors TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS import_history_created_at_idx ON import_history(created_at DESC);
CREATE INDEX IF NOT EXISTS import_history_status_idx ON import_history(status);

-- Create a view to get import statistics
CREATE OR REPLACE VIEW import_statistics AS
SELECT
  COUNT(*) as total_imports,
  COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_imports,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_imports,
  COALESCE(SUM(imported_count), 0) as total_tools_imported,
  COALESCE(SUM(duplicates_removed), 0) as total_duplicates_removed,
  ROUND(AVG(CAST(duration_ms AS NUMERIC)) / 1000, 1) as avg_duration_seconds,
  MAX(created_at) as last_import_at
FROM import_history;

-- Create a function to clean old import history (keep last 100)
CREATE OR REPLACE FUNCTION clean_old_imports()
RETURNS void AS $$
BEGIN
  DELETE FROM import_history
  WHERE id NOT IN (
    SELECT id FROM import_history
    ORDER BY created_at DESC
    LIMIT 100
  );
END;
$$ LANGUAGE plpgsql;
