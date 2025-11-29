-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title_ar" TEXT NOT NULL,
    "title_en" TEXT,
    "slug" TEXT NOT NULL,
    "excerpt_ar" TEXT NOT NULL,
    "body_markdown_ar" TEXT NOT NULL,
    "body_html_ar" TEXT NOT NULL,
    "cover_image" TEXT NOT NULL,
    "audio_track" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "publish_date" DATETIME,
    "reading_time_min" INTEGER NOT NULL DEFAULT 0,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "author_id" TEXT NOT NULL,
    CONSTRAINT "Story_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Admin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "roles" TEXT NOT NULL DEFAULT 'editor',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" DATETIME
);

-- CreateTable
CREATE TABLE "_StoryToTag" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_StoryToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Story" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StoryToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "_StoryToTag_AB_unique" ON "_StoryToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_StoryToTag_B_index" ON "_StoryToTag"("B");
