# Supabase setup for NearDrop

Supabase is **free** ($0/month). You create the project on [supabase.com](https://supabase.com) — the NearDrop app does **not** create it for you. After the project exists, you paste the URL + key into `.env.local`.

---

## Option A — Cloud free project (recommended for production)

### Step 1: Sign up the right way

Do **not** use a broken pricing-page flow. Go directly to:

**https://supabase.com/dashboard/sign-up**

1. Sign up with **GitHub** or **email**
2. Confirm your email if prompted
3. You should land in the dashboard

If you get stuck in a sign-in loop, use an **incognito window** and sign up fresh.

### Step 2: Create organization + project

1. Open **https://supabase.com/dashboard**
2. If asked, create a **Personal** organization (Free — **$0/month**)
3. Click **New project**
4. Fill in:
   - **Name:** `NearDrop`
   - **Database password:** choose a strong password (save it)
   - **Region:** pick the closest region (e.g. `East US`)
   - **Plan:** must show **Free** / **$0** — do **not** pick Pro
5. Click **Create new project** and wait ~2 minutes

You do **not** need a credit card for the free plan.

### Automated setup (recommended)

1. Create an access token: [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) → **Generate new token**
2. Add to `.env.local`:
   ```env
   SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxx
   ```
3. Run:
   ```bash
   npm run setup:supabase
   ```

This automatically:
- Enables **anonymous sign-ins**
- Creates all **database tables**
- Verifies the connection

---

### Manual setup (if you prefer the dashboard)

1. Open your project → **Authentication** → **Providers**
2. Find **Anonymous sign-ins**
3. Turn it **ON**

Guests share within **1 KM**. Registered users get full radius.

### Step 4: Disable email confirmation (easier local testing)

1. **Authentication** → **Providers** → **Email**
2. Turn **OFF** “Confirm email” (optional but recommended for dev)

### Step 5: Run the database migration

1. Open **SQL Editor** → **New query**
2. Paste all of `supabase/migrations/20250619000000_initial.sql`
3. Click **Run**

### Step 6: Add env vars locally

```bash
cp .env.example .env.local
```

From **Project Settings → API**:

| Supabase field | `.env.local` key |
|----------------|----------------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| anon public | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

### Step 7: Auth redirect URLs

**Authentication → URL configuration**

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/**`

For Vercel, also add: `https://your-app.vercel.app/**`

### Step 8: Run the app

```bash
npm run dev
```

---

## Option B — Local Supabase (100% free, no cloud account)

Use this if the Supabase website won’t let you create a project.

**Requirements:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
# Install Supabase CLI (one time)
npm install -g supabase

# From the NearDrop folder
cd "/Users/apple/Downloads/My Projects/NearDrop"
supabase init   # skip if supabase/ already exists
supabase start
```

After `supabase start`, the CLI prints local URLs and keys. Use them in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from CLI output>
```

Then apply migrations:

```bash
supabase db reset
```

Open local Studio: **http://127.0.0.1:54323**

Enable anonymous auth in local Studio: **Authentication → Providers → Anonymous → ON**

---

## Free plan limits (reminder)

| Resource | Free limit |
|----------|------------|
| Database | 500 MB |
| File storage | 1 GB |
| Bandwidth | 5 GB/month |
| Active projects | 2 |
| Realtime connections | 200 peak |

Enough for development and early users.

---

## Troubleshooting — “Can’t create free project”

| Problem | What to do |
|---------|------------|
| Sign-in loop after “Start for free” | Use **https://supabase.com/dashboard/sign-up** directly |
| “You do not have permission to create a project” | Sign out → clear cookies → incognito → sign in again |
| “User not found” on new account | Wait 10–30 min (Supabase provisioning bug) or try **Option B (local)** |
| Already have 2 active projects | Free plan allows **2 active** — pause/delete one in dashboard |
| Project stuck “Setting up” | Refresh after a few minutes; check [status.supabase.com](https://status.supabase.com) |
| Still blocked | Contact Supabase support from dashboard or use **Option B (local)** |

---

## How NearDrop uses Supabase

| User type | Auth | Share radius |
|-----------|------|--------------|
| Guest (not registered) | Anonymous session (automatic) | **1 KM** |
| Registered | Email/password or OAuth | **Up to 500 KM** |

- **Share nearby** saves clipboard + files with geolocation
- Realtime detects other shares within radius
- Register upgrades guest → full account

---

## Deploy on Vercel

Add to Vercel → **Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then redeploy.
