-- 1. DROP ALL TABLES (Clean Slate)
DROP TABLE IF EXISTS "_StoryToTag" CASCADE;
DROP TABLE IF EXISTS "Story" CASCADE;
DROP TABLE IF EXISTS "Tag" CASCADE;
DROP TABLE IF EXISTS "Media" CASCADE;
DROP TABLE IF EXISTS "Admin" CASCADE;

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. RECREATE TABLES (PostgreSQL Syntax)

-- Admin Table (Linked to auth.users)
CREATE TABLE "Admin" (
    "id" UUID NOT NULL, -- Matches auth.users.id
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL, -- Kept for legacy/reference, but auth uses auth.users
    "display_name" TEXT NOT NULL,
    "roles" TEXT NOT NULL DEFAULT 'editor',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- Story Table
CREATE TABLE "Story" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title_ar" TEXT NOT NULL,
    "title_en" TEXT,
    "slug" TEXT NOT NULL,
    "excerpt_ar" TEXT NOT NULL,
    "body_markdown_ar" TEXT NOT NULL,
    "body_html_ar" TEXT NOT NULL,
    "cover_image" TEXT NOT NULL,
    "audio_track" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publish_date" TIMESTAMP(3),
    "reading_time_min" INTEGER NOT NULL DEFAULT 0,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id" TEXT,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- Tag Table
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- Media Table
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- _StoryToTag (Implicit Many-to-Many)
CREATE TABLE "_StoryToTag" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL
);

CREATE UNIQUE INDEX "_StoryToTag_AB_unique" ON "_StoryToTag"("A", "B");
CREATE INDEX "_StoryToTag_B_index" ON "_StoryToTag"("B");

ALTER TABLE "_StoryToTag" ADD CONSTRAINT "_StoryToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_StoryToTag" ADD CONSTRAINT "_StoryToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE "Story" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_StoryToTag" ENABLE ROW LEVEL SECURITY;

-- 4. CREATE RLS POLICIES

-- Story Policies
CREATE POLICY "Public can read published stories" ON "Story" FOR SELECT USING (status = 'published');
CREATE POLICY "Admins have full access to stories" ON "Story" FOR ALL USING (true) WITH CHECK (true);

-- Admin Policies
CREATE POLICY "Admins have full access to admin table" ON "Admin" FOR ALL USING (true) WITH CHECK (true);

-- Tag Policies
CREATE POLICY "Public can read tags" ON "Tag" FOR SELECT USING (true);
CREATE POLICY "Admins have full access to tags" ON "Tag" FOR ALL USING (true) WITH CHECK (true);

-- Media Policies
CREATE POLICY "Public can read media" ON "Media" FOR SELECT USING (true);
CREATE POLICY "Admins have full access to media" ON "Media" FOR ALL USING (true) WITH CHECK (true);

-- _StoryToTag Policies
CREATE POLICY "Public can read story tags" ON "_StoryToTag" FOR SELECT USING (true);
CREATE POLICY "Admins have full access to story tags" ON "_StoryToTag" FOR ALL USING (true) WITH CHECK (true);


-- 5. SEED DATA (Auth User + Admin Record)
-- We insert into auth.users to allow login via Supabase Auth.
-- Email: admin@kod.com
-- Password: 328kod

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
BEGIN
  -- Insert into auth.users (if not exists)
  -- Note: This requires privileges usually available in SQL Editor
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id,
    'authenticated',
    'authenticated',
    'admin@kod.com',
    crypt('328kod', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  );

  -- Insert into public.Admin
  INSERT INTO "Admin" ("id", "username", "password_hash", "display_name", "roles")
  VALUES (new_user_id, 'admin', 'hashed_by_auth', 'Super Admin', 'superadmin');

END $$;
