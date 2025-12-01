// lib/db.ts
// Supabase adapter — lazy-loads @supabase/supabase-js and avoids throwing during build

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
  status: "draft" | "published" | "archived" | "pending";
  publish_date?: Date | null;
  reading_time_min: number;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at: Date;
  updated_at: Date;
  author_id?: string | null;
  author_name?: string | null;
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
}

class SupabaseAdapter implements DBAdapter {
  private supabase: any;
  private url?: string;
  private key?: string;

  constructor() {
    // store env values but do not throw here to avoid breaking `next build`
    this.url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    this.key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  private async getClient() {
    if (!this.url || !this.key) return null;
    if (this.supabase) return this.supabase;

    // dynamic import so bundler/edge runtime won't eagerly require Node APIs
    const { createClient } = await import('@supabase/supabase-js');
    this.supabase = createClient(this.url, this.key, {
      auth: { persistSession: false },
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, cache: 'no-store' });
        }
      }
    });
    return this.supabase;
  }

  async connect() {
    await this.getClient();
  }

  async getStories(opts?: { status?: string; limit?: number; page?: number }) {
    const supabase = await this.getClient();
    if (!supabase) throw new Error('Supabase not configured');

    const page = opts?.page || 1;
    const limit = opts?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query: any = supabase
      .from('Story')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (opts?.status) query = query.eq('status', opts.status);

    const { data, error, count } = await query;
    if (error) {
      console.error("getStories Error:", error);
      throw error;
    }

    const stories = (data || []).map((s: any) => ({
      ...s,
      created_at: s.created_at ? new Date(s.created_at) : null,
      updated_at: s.updated_at ? new Date(s.updated_at) : null,
      publish_date: s.publish_date ? new Date(s.publish_date) : null
    })) as Story[];

    return { data: stories, meta: { total: count || 0, page, limit } };
  }

  async getStoryBySlug(slug: string) {
    const supabase = await this.getClient();
    if (!supabase) return null;
    const { data, error } = await supabase.from('Story').select('*').eq('slug', slug).single();
    if (error) return null;
    return {
      ...data,
      created_at: data.created_at ? new Date(data.created_at) : null,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      publish_date: data.publish_date ? new Date(data.publish_date) : null
    } as Story;
  }

  async getStoryById(id: string) {
    const supabase = await this.getClient();
    if (!supabase) return null;
    const { data, error } = await supabase.from('Story').select('*').eq('id', id).single();
    if (error) return null;
    return {
      ...data,
      created_at: data.created_at ? new Date(data.created_at) : null,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      publish_date: data.publish_date ? new Date(data.publish_date) : null
    } as Story;
  }

  async createStory(payload: Partial<Story>) {
    const supabase = await this.getClient();
    if (!supabase) throw new Error('Supabase not configured');

    const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));

    const { data, error } = await supabase.from('Story').insert(cleanPayload).select().single();
    if (error) {
      console.error("Supabase Insert Error:", error);
      throw error;
    }

    return {
      ...data,
      created_at: data.created_at ? new Date(data.created_at) : null,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      publish_date: data.publish_date ? new Date(data.publish_date) : null
    } as Story;
  }

  async updateStory(id: string, payload: Partial<Story>) {
    const supabase = await this.getClient();
    if (!supabase) throw new Error('Supabase not configured');

    const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v !== undefined));

    const { data, error } = await supabase.from('Story').update(cleanPayload).eq('id', id).select().single();
    if (error) throw error;

    return {
      ...data,
      created_at: data.created_at ? new Date(data.created_at) : null,
      updated_at: data.updated_at ? new Date(data.updated_at) : null,
      publish_date: data.publish_date ? new Date(data.publish_date) : null
    } as Story;
  }

  async deleteStory(id: string) {
    const supabase = await this.getClient();
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('Story').delete().eq('id', id);
    if (error) throw error;
  }

  // Accept Buffer/Blob/ReadableStream or browser File depending on runtime
  async uploadMedia(file: any) {
    const supabase = await this.getClient();
    if (!supabase) throw new Error('Supabase not configured');

    const filename = `${Date.now()}-${(file.name || 'upload').replace(/[^a-zA-Z0-9.-]/g, '')}`;

    let uploadArg = file;
    if (typeof file.arrayBuffer === 'function') {
      const buffer = await file.arrayBuffer();
      uploadArg = buffer;
    } else if (file.buffer) {
      uploadArg = file.buffer;
    }

    const { data, error } = await supabase.storage.from('media').upload(filename, uploadArg, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream'
    });

    if (error) {
      // Attempt to create bucket if it doesn't exist
      if (error.message && (error.message.includes("Bucket not found") || error.message.includes("The resource was not found"))) {
        console.log("Bucket 'media' not found. Attempting to create...");
        const { error: createError } = await supabase.storage.createBucket('media', { public: true });
        if (createError) {
          console.error("Failed to create bucket:", createError);
          throw error; // Throw original error
        }

        // Retry upload
        const { data: retryData, error: retryError } = await supabase.storage.from('media').upload(filename, uploadArg, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type || 'application/octet-stream'
        });

        if (retryError) {
          console.error("Retry Upload Error:", retryError);
          throw retryError;
        }

        const { data: publicData } = supabase.storage.from('media').getPublicUrl(retryData.path);
        return { path: retryData.path, url: publicData.publicUrl };
      }

      console.error("Supabase Storage Upload Error:", error);
      throw error;
    }

    const { data: publicData } = supabase.storage.from('media').getPublicUrl(data.path);
    return { path: data.path, url: publicData.publicUrl };
  }

  async listMedia(opts?: { type?: string }) {
    const supabase = await this.getClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from('Media').select('*');
    if (error) return [];
    return (data || []).map((m: any) => ({ ...m, uploaded_at: m.uploaded_at ? new Date(m.uploaded_at) : null })) as Media[];
  }

  // Submitted Stories Implementation
  async createSubmittedStory(payload: any) {
    const supabase = await this.getClient();
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase.from('SubmittedStory').insert(payload).select().single();
    if (error) {
      console.error("SubmittedStory Insert Error:", error);
      throw error;
    }
    return data;
  }

  async getSubmittedStories() {
    const supabase = await this.getClient();
    if (!supabase) return [];

    const { data, error } = await supabase.from('SubmittedStory').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("getSubmittedStories Error:", error);
      return [];
    }
    return data;
  }

  async deleteSubmittedStory(id: string) {
    const supabase = await this.getClient();
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('SubmittedStory').delete().eq('id', id);
    if (error) throw error;
  }

  async getSubmittedStoryById(id: string) {
    const supabase = await this.getClient();
    if (!supabase) return null;
    const { data, error } = await supabase.from('SubmittedStory').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  }
}

export const db = new SupabaseAdapter();
