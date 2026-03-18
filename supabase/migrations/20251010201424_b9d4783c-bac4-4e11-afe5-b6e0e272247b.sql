-- Create a table to store potential client leads
CREATE TABLE public.client_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  project_type TEXT,
  budget_range TEXT,
  message TEXT,
  conversation_history JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.client_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (for chatbot to save leads)
CREATE POLICY "Anyone can create leads"
ON public.client_leads
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow public updates (for chatbot to update conversation)
CREATE POLICY "Anyone can update their own lead"
ON public.client_leads
FOR UPDATE
TO anon
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_client_leads_updated_at
BEFORE UPDATE ON public.client_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_client_leads_created_at ON public.client_leads(created_at DESC);
CREATE INDEX idx_client_leads_status ON public.client_leads(status);