/*
# Switch request_tracking view to security_definer

## Problem
The view was set to `security_invoker`, which means it runs with the caller's
privileges. Since SELECT on the base `requests` table was revoked from
`anon`/`authenticated` (to prevent direct PII access), the view can't read
the base table when accessed by those roles — resulting in a permission error.

## Solution
Switch the view to `security_definer` (the Postgres default). The view now runs
with the view owner's privileges, which can read the base table. The view itself
is the security boundary: it only exposes `tracking_id`, `service`, `status`,
and `created_at` — never `name`, `phone`, or `message`.

This is the correct pattern for column-level access control:
- The base table has no public SELECT — PII is unreachable directly.
- The view exposes only safe columns — the view IS the access control.
- RLS row-level filtering is intentionally permissive (any tracking ID can be
  looked up) because the security goal is column restriction, not row restriction.

## Security impact
- anon/authenticated can SELECT from the view (safe columns only).
- anon/authenticated CANNOT SELECT from the base table (PII protected).
- The view owner (postgres) bypasses RLS, but the view projection limits output
  to non-sensitive columns, so no PII leaks.
- INSERT still works on the base table (customers submit requests).

## Notes
1. No data changes.
2. Idempotent.
*/

ALTER VIEW request_tracking SET (security_invoker = false);