# PakVista Pro Realtime Setup (Supabase Free Tier)

This project now supports a Supabase-backed data layer for Pro pages with mock fallback.

## 1) Add environment variables

Add to `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL=...`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`

If these are missing, Pro pages continue using mock data.

## 2) Create tables

Use the schema in [docs/pro-schema.md](docs/pro-schema.md).

## 3) Realtime for routes (optional)

Enable realtime on table `routes` in Supabase dashboard.

Suggested SQL:

```sql
alter publication supabase_realtime add table routes;
```

## 4) Who updates data

- Admin operations should update rows in Supabase tables.
- Pro pages automatically read latest data (server render / no-store fetch).


## 5) Enable realtime for all admin tables

Enable realtime for all relevant tables in Supabase:

```
alter publication supabase_realtime add table suppliers;
alter publication supabase_realtime add table routes;
alter publication supabase_realtime add table permits;
```

## 6) How realtime works in the Admin portal

- The admin UI (`/admin`) now subscribes to realtime changes for suppliers, routes, and permits.
- Any create, update, or delete operation on these tables will automatically update the UI for all connected admins.
- No manual refresh is needed.

## 7) Testing realtime updates

1. Open the Admin portal in two browser windows (or devices).
2. Add, edit, or delete a supplier, route, or permit in one window.
3. The change should appear instantly in the other window.

If changes do not appear, check:
- Supabase project has the correct tables added to the `supabase_realtime` publication.
- Environment variables are set correctly in `.env.local`.
- No network errors in the browser console.

## 8) Troubleshooting

- If you see mock data, ensure your Supabase environment variables are set and valid.
- If realtime is not working, verify the publication includes all tables and your Supabase project is on a plan that supports realtime.

---
For advanced usage or custom widgets, see the implementation in `src/app/admin/page.tsx` for a reference on using Supabase's JS client for realtime subscriptions.
