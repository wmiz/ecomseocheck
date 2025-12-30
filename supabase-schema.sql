-- Supabase Database Schema for Audit Requests
-- Run this SQL in your Supabase project's SQL Editor
-- 
-- Steps:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Paste this entire file and run it

-- Create the audit_requests table
CREATE TABLE IF NOT EXISTS audit_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_url TEXT NOT NULL,
  store_name TEXT,
  myshopify_domain TEXT,
  overall_score DECIMAL(5, 2), -- 0-100 catalog health score (can be decimal)
  total_issues INTEGER, -- Total count of issues found
  overall_grade TEXT, -- Letter grade (A, B, C, D, F)
  total_products INTEGER, -- Number of products audited
  ip_address TEXT, -- Client IP address
  user_agent TEXT, -- Browser user agent
  recaptcha_score DECIMAL(3, 2), -- reCAPTCHA score if available
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audit_requests_store_url ON audit_requests(store_url);
CREATE INDEX IF NOT EXISTS idx_audit_requests_created_at ON audit_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_requests_overall_score ON audit_requests(overall_score);
CREATE INDEX IF NOT EXISTS idx_audit_requests_myshopify_domain ON audit_requests(myshopify_domain);

-- Enable Row Level Security (RLS) - we'll use service role key so this won't block server operations
ALTER TABLE audit_requests ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows service role to do everything
-- (Since we're using service role key, this is mainly for future-proofing)
CREATE POLICY "Service role can manage audit_requests"
  ON audit_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_audit_requests_updated_at
  BEFORE UPDATE ON audit_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

