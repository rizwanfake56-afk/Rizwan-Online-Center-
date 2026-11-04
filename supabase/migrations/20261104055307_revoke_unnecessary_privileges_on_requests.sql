/*
# Revoke unnecessary privileges from anon and authenticated on requests

## Problem
The initial migration granted only SELECT and INSERT to `anon, authenticated`,
but the Supabase platform grants broad default privileges (UPDATE, DELETE,
TRUNCATE, REFERENCES, TRIGGER) to these roles on every table. This means the
RLS policies (USING (false) for UPDATE/DELETE) are the ONLY thing preventing
a browser client from modifying or deleting rows. While the policies do block
these operations, defense in depth requires that the table-level privileges
also be revoked, so the protection does not depend on a single layer.

## Changes
- REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER from `anon` and
  `authenticated` on the `requests` table.
- Re-grant only SELECT and INSERT (idempotent — these already exist, but this
  ensures they are present after the revokes).
- No schema changes. No data changes. No policy changes.

## Security impact
After this migration, the `anon` and `authenticated` roles have ONLY:
  - SELECT (to look up requests by tracking ID)
  - INSERT (to submit new requests)
on the `requests` table. UPDATE and DELETE are impossible from the public API
regardless of what a malicious client attempts — blocked at BOTH the privilege
layer AND the RLS policy layer. Status changes can only happen server-side
where the service role bypasses RLS.

## Notes
1. The service_role is unaffected — it retains all privileges and bypasses RLS.
2. This is idempotent: REVOKE is safe to run multiple times.
3. No data is lost or modified.
*/

REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON requests FROM anon, authenticated;

-- Re-grant only the two verbs the public API needs (idempotent)
GRANT SELECT, INSERT ON requests TO anon, authenticated;