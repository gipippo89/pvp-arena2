# PvP Arena realtime backend

The frontend can stay on GitHub Pages, but GitHub Pages cannot execute a backend.

Deploy this repository on a serverless host such as Vercel and configure:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- ADMIN_PASSWORD

Create a Supabase table named players with at least:
id, name, score, wins, losses, online, updated_at.

Do not put SUPABASE_SERVICE_ROLE_KEY in the frontend.

After deployment, set the frontend API base URL to the backend URL. The current GitHub Pages URL remains the public frontend.
