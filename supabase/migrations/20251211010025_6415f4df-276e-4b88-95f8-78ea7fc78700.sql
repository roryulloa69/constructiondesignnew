-- Remove the vulnerable anonymous UPDATE policy on client_leads
-- This policy allowed any anonymous user to modify any lead created in the last 24 hours
DROP POLICY IF EXISTS "Can update recent leads only" ON public.client_leads;

-- Add a comment explaining the security change
COMMENT ON TABLE public.client_leads IS 'Client leads table - anonymous users can INSERT only. Updates restricted to authenticated admin users.';