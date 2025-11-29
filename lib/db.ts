import { PrismaClient } from "@prisma/client";

// Define the shape of our data models
export interface Story {
    id: string;
    title_ar: string;
    title_en?: string | null;
    slug: string;
    excerpt_ar: string;
    body_markdown_ar: string;
    body_html_ar: string;
    cover_image: string;
    audio_track?: string | null;
    status: "draft" | "published" | "archived";
    publish_date?: Date | null;
    reading_time_min: number;
    meta_title?: string | null;
    meta_description?: string | null;
    created_at: Date;
    updated_at: Date;
    author_id: string;
}

export interface Media {
    id: number;
    type: "image" | "audio";
    path: string;
    original_name: string;
    size_bytes: number;
    uploaded_by: string;
    uploaded_at: Date;
}

interface DBAdapter {
    connect(): Promise<void>;
    getStories(opts?: { status?: string; limit?: number; page?: number }): Promise<{ data: Story[]; meta: { total: number; page: number; limit: number } }>;
    getStoryBySlug(slug: string): Promise<Story | null>;
    getStoryById(id: string): Promise<Story | null>;
    createStory(payload: Partial<Story>): Promise<Story>;
    updateStory(id: string, payload: Partial<Story>): Promise<Story>;
    deleteStory(id: string): Promise<void>;
    uploadMedia(file: File): Promise<{ path: string; url: string }>;
    listMedia(opts?: { type?: string }): Promise<Media[]>;
}

// Prisma Singleton Pattern for Next.js Hot Reloading
const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Factory to get the correct adapter
class DBFactory {
    private static instance: DBAdapter;

    static getAdapter(): DBAdapter {
        if (!this.instance) {
            const mode = process.env.STORAGE_MODE || "local";

            if (mode === "local") {
                this.instance = new LocalAdapter();
            } else if (mode === "postgres" || mode === "supabase") {
                // Placeholder for remote adapter
                this.instance = new LocalAdapter(); // Fallback for now
            } else {
                throw new Error(`Unknown STORAGE_MODE: ${mode}`);
            }
        }
        return this.instance;
    }
}

// Local Adapter Implementation (using Prisma + Local FS)
class LocalAdapter implements DBAdapter {
    // Use the singleton prisma instance
    private prisma: PrismaClient = prisma;

    async connect() {
        await this.prisma.$connect();
    }

    async getStories(opts?: { status?: string; limit?: number; page?: number }) {
        const where = opts?.status ? { status: opts.status } : {};
        const take = opts?.limit || 10;
        const skip = ((opts?.page || 1) - 1) * take;

        const [data, total] = await Promise.all([
            this.prisma.story.findMany({ where, take, skip, orderBy: { created_at: 'desc' } }),
            this.prisma.story.count({ where })
        ]);

        return { data: data as any, meta: { total, page: opts?.page || 1, limit: take } };
    }

    async getStoryBySlug(slug: string) {
        return this.prisma.story.findUnique({ where: { slug } }) as any;
    }

    async getStoryById(id: string) {
        return this.prisma.story.findUnique({ where: { id } }) as any;
    }

    async createStory(payload: Partial<Story>) {
        return this.prisma.story.create({ data: payload as any }) as any;
    }

    async updateStory(id: string, payload: Partial<Story>) {
        return this.prisma.story.update({ where: { id }, data: payload as any }) as any;
    }

    async deleteStory(id: string) {
        await this.prisma.story.delete({ where: { id } });
    }

    async uploadMedia(file: File) {
        // This would handle local file writing
        // For now returning mock
        return { path: "/uploads/mock.jpg", url: "/uploads/mock.jpg" };
    }

    async listMedia(opts?: { type?: string }) {
        return this.prisma.media.findMany() as any;
    }
}

export const db = DBFactory.getAdapter();
