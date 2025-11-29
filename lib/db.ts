import { createClient, SupabaseClient } from "@supabase/supabase-js";

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

// Supabase Adapter Implementation
class SupabaseAdapter implements DBAdapter {
    private supabase: SupabaseClient;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Missing Supabase environment variables");
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async connect() {
        // No-op for Supabase
    }

    async getStories(opts?: { status?: string; limit?: number; page?: number }) {
        const page = opts?.page || 1;
        const limit = opts?.limit || 10;
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = this.supabase
            .from('Story')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (opts?.status) {
            query = query.eq('status', opts.status);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        // Convert dates
        const stories = data?.map(story => ({
            ...story,
            created_at: new Date(story.created_at),
            updated_at: new Date(story.updated_at),
            publish_date: story.publish_date ? new Date(story.publish_date) : null
        })) as Story[];

        return {
            data: stories || [],
            meta: {
                total: count || 0,
                page,
                limit
            }
        };
    }

    async getStoryBySlug(slug: string) {
        const { data, error } = await this.supabase
            .from('Story')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return null;

        return {
            ...data,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
            publish_date: data.publish_date ? new Date(data.publish_date) : null
        } as Story;
    }

    async getStoryById(id: string) {
        const { data, error } = await this.supabase
            .from('Story')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return null;

        return {
            ...data,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
            publish_date: data.publish_date ? new Date(data.publish_date) : null
        } as Story;
    }

    async createStory(payload: Partial<Story>) {
        // Remove undefined fields
        const cleanPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== undefined)
        );

        const { data, error } = await this.supabase
            .from('Story')
            .insert(cleanPayload)
            .select()
            .single();

        if (error) throw error;

        return {
            ...data,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
            publish_date: data.publish_date ? new Date(data.publish_date) : null
        } as Story;
    }

    async updateStory(id: string, payload: Partial<Story>) {
        const cleanPayload = Object.fromEntries(
            Object.entries(payload).filter(([_, v]) => v !== undefined)
        );

        const { data, error } = await this.supabase
            .from('Story')
            .update(cleanPayload)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return {
            ...data,
            created_at: new Date(data.created_at),
            updated_at: new Date(data.updated_at),
            publish_date: data.publish_date ? new Date(data.publish_date) : null
        } as Story;
    }

    async deleteStory(id: string) {
        const { error } = await this.supabase
            .from('Story')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    async uploadMedia(file: File) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await this.supabase.storage
            .from('media')
            .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = this.supabase.storage
            .from('media')
            .getPublicUrl(fileName);

        // Also save to Media table if needed, but for now just return path/url
        return { path: data.path, url: publicUrl };
    }

    async listMedia(opts?: { type?: string }) {
        // This would ideally query a Media table, or list from storage
        // For now, let's assume we query the Media table if it exists, or just return empty
        // The original code used Prisma.media.findMany()

        const { data, error } = await this.supabase
            .from('Media')
            .select('*');

        if (error) return []; // Fail gracefully if table doesn't exist yet

        return data.map(m => ({
            ...m,
            uploaded_at: new Date(m.uploaded_at)
        })) as Media[];
    }
}

export const db = new SupabaseAdapter();

