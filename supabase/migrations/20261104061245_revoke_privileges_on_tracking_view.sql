/*
# Revoke unnecessary privileges on request_tracking view

## Problem
The Supabase platform grants broad default privileges (INSERT, UPDATE, DELETE,
REFERENCES, TRIGGER) to anon and authenticated on the new `request_tracking`
view, just as it did on the base table. The view should be SELECT-only — it's
a read-only tracking lookup.

## Changes
- REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER from
  anon, authenticated on the `request_tracking` view.
- Re-grant SELECT only (idempotent).

## Security impact
The public API can only SELECT from the view (look up a tracking ID). It cannot
insert, update, or delete through the view. Combined with the view being a
projection of only safe columns, this means:
- No PII exposure (name, phone, message not in the view)
- No mutation through the view
- INSERT still works only on the base `requests` table (for submitting requests)

## Notes
1. Idempotent — REVOKE is safe to repeat.
2. No data changes.
*/

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON request_tracking FROM anon, authenticated;

GRANT SELECT ON request_tracking TO anon, authenticated;