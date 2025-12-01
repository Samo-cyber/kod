ALTER TABLE "Story" ADD COLUMN IF NOT EXISTS "author_name" TEXT;
UPDATE "Story" SET "author_name" = 'KOD Admin' WHERE "author_name" IS NULL;
