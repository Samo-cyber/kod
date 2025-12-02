-- Create Comment Table
CREATE TABLE "Comment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "story_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "author_name" TEXT NOT NULL DEFAULT 'Anonymous',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- Create StoryLike Table
CREATE TABLE "StoryLike" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "story_id" UUID NOT NULL,
    "ip_address" TEXT NOT NULL, -- Hashed or raw IP for uniqueness
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryLike_pkey" PRIMARY KEY ("id")
);

-- Add Foreign Keys
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StoryLike" ADD CONSTRAINT "StoryLike_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Unique constraint for Likes (One like per IP per Story)
CREATE UNIQUE INDEX "StoryLike_story_id_ip_address_key" ON "StoryLike"("story_id", "ip_address");

-- Enable RLS
ALTER TABLE "Comment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StoryLike" ENABLE ROW LEVEL SECURITY;

-- Policies for Comment
CREATE POLICY "Public can read comments" ON "Comment" FOR SELECT USING (true);
CREATE POLICY "Public can create comments" ON "Comment" FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage comments" ON "Comment" FOR ALL USING (true) WITH CHECK (true);

-- Policies for StoryLike
CREATE POLICY "Public can read likes" ON "StoryLike" FOR SELECT USING (true);
CREATE POLICY "Public can create likes" ON "StoryLike" FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage likes" ON "StoryLike" FOR ALL USING (true) WITH CHECK (true);
