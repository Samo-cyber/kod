-- Enable RLS on the implicit join table created by Prisma
-- Prisma names these tables with an underscore, e.g., "_StoryToTag"
-- Columns are usually "A" (references one model) and "B" (references the other)

ALTER TABLE "_StoryToTag" ENABLE ROW LEVEL SECURITY;

-- Allow public read access (so users can see which tags belong to which stories)
CREATE POLICY "Public can view story tags" ON "_StoryToTag"
  FOR SELECT
  USING (true);

-- Allow authenticated users (admins) to manage these relationships
CREATE POLICY "Admins can manage story tags" ON "_StoryToTag"
  FOR ALL
  USING (auth.role() = 'authenticated');
