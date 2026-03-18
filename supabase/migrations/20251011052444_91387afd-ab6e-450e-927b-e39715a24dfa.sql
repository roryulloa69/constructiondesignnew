-- Create audit log table for tracking sensitive data access
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name text NOT NULL,
    operation text NOT NULL,
    user_id uuid REFERENCES auth.users(id),
    record_id uuid,
    old_data jsonb,
    new_data jsonb,
    ip_address inet,
    timestamp timestamptz DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create function to audit client_leads changes
CREATE OR REPLACE FUNCTION public.audit_client_leads()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.audit_logs (
        table_name, operation, user_id, record_id,
        old_data, new_data
    )
    VALUES (
        'client_leads',
        TG_OP,
        auth.uid(),
        COALESCE(NEW.id, OLD.id),
        to_jsonb(OLD),
        to_jsonb(NEW)
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger to automatically log all changes to client_leads
CREATE TRIGGER audit_client_leads_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.client_leads
FOR EACH ROW EXECUTE FUNCTION public.audit_client_leads();