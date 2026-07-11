DROP POLICY IF EXISTS "Anyone can insert claim submissions" ON public.claim_submissions;
REVOKE INSERT, SELECT ON public.claim_submissions FROM anon;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.claim_submissions FROM authenticated;