-- Enable RLS on all tables
ALTER TABLE "Story" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;

-- Story Policies
-- Allow public read access to published stories
CREATE POLICY "Public can view published stories" ON "Story"
  FOR SELECT
  USING (status = 'published');

-- Allow authenticated users (admins) to do everything with stories
CREATE POLICY "Admins can manage stories" ON "Story"
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Media Policies
-- Allow public read access to media
CREATE POLICY "Public can view media" ON "Media"
  FOR SELECT
  USING (true);

-- Allow authenticated users to upload/manage media
CREATE POLICY "Admins can manage media" ON "Media"
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Tag Policies
-- Allow public read access to tags
CREATE POLICY "Public can view tags" ON "Tag"
  FOR SELECT
  USING (true);

-- Allow authenticated users to manage tags
CREATE POLICY "Admins can manage tags" ON "Tag"
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Admin Table Policies
-- Only allow authenticated users to view/manage admin profiles
CREATE POLICY "Admins can manage admin profiles" ON "Admin"
  FOR ALL
  USING (auth.role() = 'authenticated');
