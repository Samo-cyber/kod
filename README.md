# Kingdom of Darkness (مملكة الظلام)

A bilingual (Arabic/English) horror-themed Next.js web application with a custom local CMS.

## Features

- **Next.js 14 App Router**: Server Components, Client Components, and API Routes.
- **Bilingual Support**: Arabic (RTL) and English (LTR).
- **Custom CMS**: Admin dashboard to manage stories and media.
- **Storage Mode**: Switch between Local (SQLite + Filesystem) and Remote (Postgres + Supabase/S3) via environment variables.
- **Immersive UI**: WebGL fog, custom cursor, and sound effects.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Environment**:
   Copy `.env.sample` to `.env.local` (create it if missing).
   ```bash
   cp .env.sample .env.local
   ```

3. **Initialize Database**:
   ```bash
   npx prisma migrate dev --name init
   npx tsx scripts/seed.ts
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.
   Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS (User: `admin`, Pass: `admin` - *change in production*).

## Environment Variables

See `.env.sample` for all options.

- `STORAGE_MODE`: `local` (default), `postgres`, or `supabase`.
- `ADMIN_PW_HASH`: Bcrypt hash for admin password.
- `DATABASE_URL`: Connection string for Postgres (if mode is postgres).

## Deployment

Recommended platform: **Vercel**.

1. Push to GitHub.
2. Import project in Vercel.
3. Set Environment Variables.
4. Deploy.

## License

[MIT](LICENSE)
