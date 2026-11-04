/*
# Create public tracking view + lock down requests table

## Problem
The `requests` table has a public SELECT policy (`USING (true)`) so anyone can
look up any row by tracking ID. The tracking page queries full columns including
`name`, `phone`, and `message` — sensitive customer PII. Tracking IDs are
`ROC` + 7 digits (only ~9 million possibilities), making brute-force enumeration
feasible. An attacker cycling through IDs could harvest names and phone numbers.

## Solution
1. Create a `request_tracking` VIEW that exposes ONLY the non-sensitive columns
   needed for tracking: `tracking_id`, `service`, `status`, `created_at`.
   Name, phone, and message are NOT included — they stay in the base table only.
2. The view uses `security_invoker` so RLS on the base `requests` table applies.
3. REVOKE SELECT on the base `requests` table from `anon` and `authenticated`
   so the public API can no longer read PII directly from the table.
4. GRANT SELECT on the `request_tracking` view to `anon, authenticated` so the
   tracking lookup still works — but only returns safe columns.
5. Keep INSERT on the base table public (customers still submit requests with
   their full details — that data goes into the protected table, not the view).
6. The app's tracking page is updated to query `request_tracking` instead of
   `requests`, so it only receives and displays non-sensitive columns.

## What changes for the customer
- After submitting, the customer still sees their own full details on the
  success screen (from the insert response, not a public query). This is fine —
  it's their own data they just entered.
- On the tracking page, they see: tracking ID, service, status, and date.
  They no longer see name, phone, or message — this protects all customers'
  privacy if someone guesses or brute-forces a tracking ID.

## Security impact
- PII (name, phone, message) is no longer reachable through the public API at
  all — not via the table (SELECT revoked), not via the view (columns excluded).
- Only the service_role (server-side, bypasses RLS) can read full rows.
- The tracking ID entropy is also being increased in the app code (ROC + 10
  alphanumeric characters), making enumeration impractical.

## Notes
1. `security_invoker` views run with the caller's privileges, so RLS on
   `requests` still governs access through the view.
2. The view is a simple SELECT projection — no computed columns, no functions.
3. Idempotent: uses `CREATE OR REPLACE` and `DROP POLICY IF EXISTS`.
4. No data is lost or modified.
*/

-- 1. Create the view exposing only safe columns
CREATE OR REPLACE VIEW request_tracking AS
SELECT
  tracking_id,
  service,
  status,
  created_at
FROM requests;

ALTER VIEW request_tracking SET (security_invoker = true);

-- 2. Grant SELECT on the view to public roles
GRANT SELECT ON request_tracking TO anon, authenticated;

-- 3. Revoke SELECT on the base table from public roles
--    (INSERT stays — customers still submit requests)
REVOKE SELECT ON requests FROM anon, authenticated;

-- 4. Keep INSERT grant on the base table (already present, restated for clarity)
GRANT INSERT ON requests TO anon, authenticated;

-- 5. The base table policies: SELECT policy can stay (it's now moot for public
--    roles since they lack SELECT privilege on the table), but we tighten it
--    to using(false) so even if someone regains table SELECT, RLS blocks it.
--    The view still works because it only reads the safe columns and RLS
--    allows SELECT via the existing policy — but we need a policy that lets
--    the view read. Since the view is security_invoker, it needs the base
--    table's SELECT policy to allow the anon role. We keep public_select
--    but the VIEW is what restricts columns. The REVOKE on the table prevents
--    direct table access.
DROP POLICY IF EXISTS "public_select_requests" ON requests;
CREATE POLICY "public_select_requests"
ON requests FOR SELECT
TO anon, authenticated
USING (true);
