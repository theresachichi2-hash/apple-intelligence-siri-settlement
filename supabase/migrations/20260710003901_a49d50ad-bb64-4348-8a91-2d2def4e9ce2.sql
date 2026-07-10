
CREATE TABLE public.claim_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  devices JSONB NOT NULL DEFAULT '[]'::jsonb,
  owned_device TEXT,
  received_notice TEXT,
  signature TEXT,
  notes TEXT,
  withdrawal_option TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.claim_submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.claim_submissions TO authenticated;
GRANT ALL ON public.claim_submissions TO service_role;

ALTER TABLE public.claim_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone (public claimant form) can insert
CREATE POLICY "Anyone can insert claim submissions"
  ON public.claim_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT policy = no one can read via Data API. Reads happen via server function with service role after password check.
