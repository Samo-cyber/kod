const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

async function check() {
    console.log('Original URL:', supabaseUrl);
    let url = supabaseUrl;
    if (!url.includes('.supabase.co')) {
        console.log('URL seems to be missing .supabase.co, appending it...');
        url = `${url}.supabase.co`;
    }

    const client = createClient(url, supabaseKey);
    console.log('Testing connection to:', url);

    const { data, error } = await client.from('Story').select('*').limit(1);
    if (error) {
        console.error('DB Error:', error);
        // If error is 404 or connection refused, it confirms the issue
    } else {
        console.log('DB Connection OK with fixed URL!');
    }
}

check();
