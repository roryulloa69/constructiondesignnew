-- Remove the existing overly permissive UPDATE policy
DROP POLICY IF EXISTS "Anyone can update their own lead" ON public.client_leads;

-- Create a more restrictive UPDATE policy that only allows updates within 24 hours of creation
-- This allows the chatbot to update leads during an active conversation while preventing
-- unauthorized modifications to older leads
CREATE POLICY "Can update recent leads only"
ON public.client_leads
FOR UPDATE
TO anon
USING (created_at > now() - interval '24 hours')
WITH CHECK (created_at > now() - interval '24 hours');

-- Add a DELETE policy that denies all deletions from anonymous users
-- Only authenticated admin users should be able to delete leads
CREATE POLICY "Prevent anonymous deletion of leads"
ON public.client_leads
FOR DELETE
TO anon
USING (false);

-- Note: The edge function uses service role key which bypasses RLS,
-- so chatbot functionality will continue to work normally