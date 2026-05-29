# Saanjh — Matrimonial Platform Build Plan

Replacing the existing habit tracker entirely with **Saanjh**, a modern minimalist matrimonial site. Rose & Ivory palette (#fdf8f3 / #e8d5c4 / #b5546a / #3d2a2e), Cormorant Garamond headlines paired with Karla body, bilingual Gurmukhi + English headings (e.g. **ਸਾਂਝ · Saanjh**).

## Scope (delivered in this build)

### Public site
- **Home** — hero with wedding photography, value props, success stories, featured profiles teaser, CTA
- **About**, **Pricing**, **Contact**, **FAQ**, **Privacy Policy**, **Terms** — all bilingual, mobile-first

### Auth
- Email + password signup/login, Google sign-in
- `/reset-password` flow
- Auth-gated app routes under `_authenticated`
- Admin role check via `user_roles` table + `has_role` security-definer function

### Profile creation (multi-step wizard)
- Basic: name, DOB (age auto), gender, city/district
- Background: religion/community, education, occupation, height, marital status
- Story: about me, partner preference
- **Photo uploads** to Supabase Storage (multiple, with primary)
- All text fields run through a **content sanitizer** that strips phone numbers (Indian + intl formats), emails, URLs, @handles, and the words "whatsapp/insta/telegram/snap"

### Browsing
- Card grid (not swipe), filters: age range, city, religion, marital status
- Free tier: blurred photos, limited fields, 10/day cap (tracked in `daily_views`)
- Premium: full photos + contact details
- "Recommended for you" rail (age band + city + preferences)

### Interest & match
- Send / receive / accept / reject
- Mutual accept → row in `matches` → unlocks chat (if premium)

### Chat (premium + matched only)
- Supabase Realtime on `messages` table
- Same content sanitizer applied to outgoing messages
- Free or unmatched users blocked at RLS layer

### Membership / payments
- Plans table seeded with ₹199/7d, ₹499/1m, ₹1999/6m
- `memberships` table tracks active plan + expiry
- **Payment integration note:** Razorpay/Paytm/GPay are not built into Lovable. I'll wire the full UI + DB + plan-gating logic, and for actual checkout I'll set up Lovable's built-in **Stripe payments** (works in India, no account setup) — or you can later swap to Razorpay with your own key. The plan-activation flow is the same either way.

### Admin panel (`/admin`, gated by `admin` role)
- Approve / block profiles, delete accounts
- Manage memberships, view payments
- View reports, block abusive users, edit plan pricing

### Content safety
- Server-side sanitizer used in profile updates AND chat sends (defence in depth — same regex client + server)
- Report user button → `reports` table for admin

## Database (Supabase migration)

Drops old `habits` / `habit_logs`. New tables:
- `profiles` (extends existing): adds dob, gender, city, district, religion, education, occupation, height_cm, marital_status, about_me, partner_preference, status (pending/approved/blocked), is_admin_approved
- `profile_photos` (id, profile_id, storage_path, is_primary, position)
- `app_role` enum + `user_roles` + `has_role()` (admin gating)
- `interests` (sender_id, receiver_id, status: pending/accepted/rejected, created_at, unique pair)
- `matches` (user_a, user_b, created_at) — created when interest accepted both ways
- `messages` (match_id, sender_id, body, created_at) — realtime enabled
- `plans` (code, name, price_paise, duration_days, features jsonb) — seeded
- `memberships` (user_id, plan_code, started_at, expires_at, status)
- `payments` (user_id, plan_code, amount_paise, provider, provider_ref, status)
- `daily_views` (user_id, date, count) — for free-tier 10/day cap
- `reports` (reporter_id, reported_id, reason, created_at, resolved)
- `blocks` (blocker_id, blocked_id)

All tables: RLS enabled, GRANTs on every public table, policies scoped to `auth.uid()`, admin override via `has_role(auth.uid(), 'admin')`.

Storage bucket: `profile-photos` (private — signed URLs; free users get blurred via CSS overlay on placeholder; premium users get signed URL to original).

## Tech notes
- TanStack Start routes only — no React Router
- Server functions (`createServerFn`) for: sanitize-and-update profile, send-interest, accept-interest, send-message, check-daily-limit, activate-membership
- `Route.useRouteContext().auth` for gating; `_authenticated` layout for app, `_authenticated/_admin` for admin
- All colors via semantic tokens in `src/styles.css` — no raw hex in components
- Wedding photography sourced via image generation (3-4 hero/section images)

## Out of scope for this build (call out for later)
- SMS OTP (requires Twilio/MSG91 secret — easy to add)
- Screenshot prevention (browsers don't expose this reliably; will add `user-select: none` + watermark overlay as best-effort)
- IP/device blocking beyond Supabase auth's built-in throttling
- Mobile native app (the responsive web works on Android/iPhone; native is a separate Capacitor/Expo build)

## Order of execution
1. Migration (drops habits, creates full schema, seeds plans, creates `admin` role infra, sets up storage bucket)
2. Brand foundation: `styles.css` tokens, fonts, sanitizer lib
3. Public routes (home, about, pricing, contact, faq, privacy, terms)
4. Auth (login, signup, reset, Google) + `_authenticated` guard
5. Profile wizard + photo upload
6. Browse + filters + daily-limit gate
7. Interests + matches
8. Chat (realtime, premium gated)
9. Membership UI + Stripe checkout wiring
10. Admin panel
11. Polish, mobile QA

This is a large build — expect 50+ files. Approve and I'll start with the migration.