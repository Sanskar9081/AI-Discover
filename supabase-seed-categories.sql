-- Seed categories table with default categories
DELETE FROM categories;

INSERT INTO categories (id, name, icon, color) VALUES
  ('chat', 'Chat AI', 'MessageSquare', 'hsl(263.4, 70%, 50.4%)'),
  ('image', 'Image AI', 'Image', 'hsl(330, 70%, 50%)'),
  ('video', 'Video AI', 'Video', 'hsl(200, 70%, 50%)'),
  ('coding', 'Coding AI', 'Code', 'hsl(150, 70%, 40%)'),
  ('audio', 'Audio AI', 'Music', 'hsl(30, 70%, 50%)'),
  ('productivity', 'Productivity AI', 'Zap', 'hsl(50, 70%, 45%)');

-- Verify categories were inserted
SELECT * FROM categories;
