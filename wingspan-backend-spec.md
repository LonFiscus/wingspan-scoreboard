# Papa's Plantin' a Bird! — Backend Spec
## Multi-user Cloud Scoreboard

**Goal:** Replace localStorage with a real backend so any family member can open the app on any device and see the full shared game history and stats.

**Assumptions:**
- Each family member has their own account (email + password)
- Player names in games are still typed freely — stats aggregate by name
- All members of a household share one combined history and stats view
- Tech stack: Supabase (auth + Postgres + real-time) + existing Vercel frontend

---

## Architecture Overview

```
Browser (React + Vite on Vercel)
    │
    ├── @supabase/supabase-js
    │
    └── Supabase project
            ├── Auth (email/password, magic link)
            ├── Postgres database
            │       ├── households
            │       ├── household_members
            │       ├── household_invites
            │       └── games
            └── Realtime subscriptions
```

---

## Database Schema

```sql
-- Households (a shared group, e.g. "The Fiscus Family")
CREATE TABLE households (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  created_by uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Membership (many users → one household)
CREATE TABLE household_members (
  household_id uuid REFERENCES households ON DELETE CASCADE,
  user_id      uuid REFERENCES auth.users ON DELETE CASCADE,
  role         text NOT NULL DEFAULT 'member', -- 'admin' | 'member'
  joined_at    timestamptz DEFAULT now(),
  PRIMARY KEY (household_id, user_id)
);

-- Invite codes (share a link; expires in 7 days)
CREATE TABLE household_invites (
  code         text PRIMARY KEY,
  household_id uuid REFERENCES households ON DELETE CASCADE,
  created_by   uuid REFERENCES auth.users,
  created_at   timestamptz DEFAULT now(),
  expires_at   timestamptz NOT NULL
);

-- Games (replaces wingspan_games_v1 in localStorage)
CREATE TABLE games (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id uuid REFERENCES households ON DELETE CASCADE NOT NULL,
  played_at    timestamptz NOT NULL,
  players      jsonb NOT NULL,  -- [{id, name}]
  scores       jsonb NOT NULL,  -- {playerId: {rounds:[...], birds, ...}}
  winners      jsonb NOT NULL,  -- [playerId]
  created_by   uuid REFERENCES auth.users,
  created_at   timestamptz DEFAULT now()
);
```

**Row-Level Security (RLS):** Every table is locked down so users can only read/write rows belonging to their own household.

---

## Milestone 1 — Auth & Cloud Storage

**Goal:** A family member can sign up, sign in, and have all game history stored in the cloud and accessible from any device.

### Features

#### Auth Screen
- **M1-1** Sign-up form: email + password (min 8 chars). On success, auto-creates a household named "[Name]'s Games" and makes the user its admin.
- **M1-2** Sign-in form: email + password.
- **M1-3** "Send magic link" option — passwordless sign-in via email link.
- **M1-4** Auth state persists across sessions (Supabase handles the token).
- **M1-5** Sign-out button accessible from the nav bar or a settings screen.

#### Cloud Game Storage
- **M1-6** When a game ends, save it to the `games` table in Supabase (replacing the localStorage write).
- **M1-7** History screen loads games from Supabase, ordered newest-first.
- **M1-8** Delete game removes it from Supabase (with the existing confirmation).
- **M1-9** Mid-game auto-save continues to use localStorage (offline-safe); cloud save only happens on game completion.

#### Offline Fallback
- **M1-10** If the user is not signed in, the app falls back to localStorage behavior (current M1/M2 behavior). A banner prompts them to sign in to enable cloud sync.

### Acceptance Criteria
- A user can sign up on device A, play a game, then open the app on device B, sign in, and see that game in History.
- Deleting a game on one device removes it everywhere.

---

## Milestone 2 — Household & Invites

**Goal:** Family members can join a shared household so they all see the same history and stats.

### Features

#### Invite System
- **M2-1** Household admin can generate an invite link (e.g. `wingspan-scoreboard.vercel.app/join/ABC123`). Code expires in 7 days.
- **M2-2** "Copy Invite Link" button copies the URL to clipboard.
- **M2-3** Visiting an invite URL while signed out prompts sign-up/sign-in, then joins the household on completion.
- **M2-4** Visiting an invite URL while already signed in shows a "Join [Household Name]?" confirmation screen.
- **M2-5** A user can only belong to one household. Joining a new one leaves the previous one (with confirmation).

#### Household Settings Screen
- **M2-6** Accessible from the nav bar (gear icon or "Settings" tab).
- **M2-7** Shows household name (editable by admin) and member list with join dates.
- **M2-8** Admin can remove a member.
- **M2-9** Any member can leave the household.
- **M2-10** Admin can regenerate or revoke the invite code.

#### Shared History & Stats
- **M2-11** History and Stats screens now show all games from the entire household, not just games created by the current user.
- **M2-12** Each game row in History shows which household member recorded it (e.g. "Recorded by Lon").

### Acceptance Criteria
- Family member A (admin) generates an invite link and texts it to family member B.
- B signs up via the link, joins the household, and immediately sees A's game history.
- Both A and B see the same History and Stats from any device.

---

## Milestone 3 — Real-time & Polish

**Goal:** The app feels live — history updates instantly when anyone saves a game, and it works reliably offline.

### Features

#### Real-time Sync
- **M3-1** History screen subscribes to the `games` table via Supabase Realtime. New games appear automatically without a page refresh.
- **M3-2** A toast notification appears when a new game is added by another household member: "Alex just recorded a game!"
- **M3-3** Stats screen also reflects real-time changes.

#### Offline & Sync
- **M3-4** Mid-game state saves to localStorage as before. If the device goes offline before the game ends, the completed game is queued in localStorage.
- **M3-5** On next app load with connectivity, any queued games are synced to Supabase automatically.
- **M3-6** A subtle indicator shows sync status ("Synced" / "Offline — will sync when reconnected").

#### PWA — Installable App
- **M3-7** Add a `manifest.json` and service worker so the app can be installed to a phone's home screen ("Add to Home Screen").
- **M3-8** App icon and splash screen use the Wingspan bird illustration theme.
- **M3-9** Installed PWA works offline for score entry; syncs when connectivity returns.

#### User Profile
- **M3-10** Users can set a display name (shown in History as "Recorded by [display name]").
- **M3-11** Display name stored in a `profiles` table linked to `auth.users`.

### Acceptance Criteria
- Player A saves a game on their phone. Player B, viewing the History screen on their tablet, sees the new game appear within 2 seconds without refreshing.
- The app can be installed to an iPhone or Android home screen and used to enter scores with no internet connection.
- Completed offline games sync automatically when the device reconnects.

---

## Key Implementation Notes

### Supabase Setup
1. Create a free Supabase project at supabase.com
2. Add two environment variables to Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Enable Row-Level Security on all tables
4. Install: `npm install @supabase/supabase-js`

### Migration Path
- Existing localStorage games can be imported: a one-time "Import local games" button reads `wingspan_games_v1` and uploads them to Supabase.
- After successful import, localStorage is cleared.

### Cost
- Supabase free tier: 500 MB database, 50K monthly active users, 2 projects — more than sufficient for a family scoreboard.
- Vercel free tier: unchanged.
- Total cost: $0.
