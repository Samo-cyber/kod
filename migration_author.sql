-- Make author_id optional in Story table
ALTER TABLE "Story" ALTER COLUMN "author_id" DROP NOT NULL;

-- Drop the foreign key constraint if it exists (it might not if the previous migration didn't create it due to missing Admin table)
-- We use a DO block to avoid errors if the constraint doesn't exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Story_author_id_fkey') THEN
        ALTER TABLE "Story" DROP CONSTRAINT "Story_author_id_fkey";
    END IF;
END $$;
