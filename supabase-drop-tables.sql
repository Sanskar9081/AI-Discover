-- ============ DROP ALL TABLES ============
-- Run this if you want to start fresh (warning: this deletes all data!)

-- Drop tables in order of dependencies
DROP TABLE IF EXISTS user_recently_viewed CASCADE;
DROP TABLE IF EXISTS user_saved_items CASCADE;
DROP TABLE IF EXISTS ads CASCADE;
DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS tools CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS bug_reports CASCADE;
DROP TABLE IF EXISTS ad_requests CASCADE;

-- Drop indices
DROP INDEX IF EXISTS idx_tools_category;
DROP INDEX IF EXISTS idx_tools_featured;
DROP INDEX IF EXISTS idx_tools_trending;
DROP INDEX IF EXISTS idx_user_saved_items_user;
DROP INDEX IF EXISTS idx_user_saved_items_type;
DROP INDEX IF EXISTS idx_user_recently_viewed_user;
