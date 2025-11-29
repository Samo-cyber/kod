const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];
const missing = required.filter(key => !process.env[key] || process.env[key].includes('your-'));
if (missing.length > 0) {
    console.log('Missing or placeholder env vars:', missing.join(', '));
    process.exit(1);
} else {
    console.log('All required env vars are present.');
}
