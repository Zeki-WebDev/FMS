# Orders dashboard: Express + Supabase

## Setup
1. Create a Supabase project.
2. SQL Editor: run `supabase/migrations/001_init.sql`.
3. Authentication > Providers > Email: turn off "Confirm email" while developing
   (otherwise new accounts must click an email link before signing in).
4. Copy `.env.example` to `.env` and fill in the URL, anon key and service_role key
   (Project Settings > API).
5. Terminal:
   npm install
   npm run dev
6. Open http://localhost:3000, create an account, add orders.

## Layout
- src/app.js            Express setup and route mounting
- src/routes/           HTTP layer, one file per resource
- src/services/         All Supabase queries
- src/middleware/       auth (token check), validate (zod), errorHandler
- src/config/           Shared Supabase client

## Add a new resource (e.g. products)
1. Add a table + RLS policy in a new file under supabase/migrations/
2. Create src/services/products.js and src/routes/products.js
3. Mount it in src/app.js

## Security notes
- SUPABASE_SERVICE_KEY stays on the server only. Never commit .env.
- Every query is filtered by the signed-in user's id, so users only see their own orders.
