-- Promote an existing user to admin so they can use the production queue.
-- Run in the Supabase SQL editor after signing up:
update public.profiles set role = 'admin' where email = 'you@example.com';
