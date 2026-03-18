-- Fix 1: Remove dangerous UPDATE policy that allows anyone to modify recent leads
DROP POLICY IF EXISTS "Can update recent leads only" ON public.client_leads;

-- Create secure UPDATE policy restricted to admins only
CREATE POLICY "Admins can update leads" ON public.client_leads
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Add INSERT policy for audit_logs to allow legitimate audit trail logging
-- This allows authenticated users and the SECURITY DEFINER trigger to insert audit logs
CREATE POLICY "System can insert audit logs" ON public.audit_logs
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL OR current_setting('role', true) = 'postgres');