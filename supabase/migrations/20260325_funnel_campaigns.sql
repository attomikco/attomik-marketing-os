-- Add 'funnel' to campaign type
ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_type_check;
ALTER TABLE campaigns ADD CONSTRAINT campaigns_type_check
  CHECK (type IN ('email', 'ad_copy', 'social', 'seo', 'dtc_brief', 'funnel'));

-- Add angle column for funnel campaigns
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS angle text;

-- Campaign assets (saved creative PNGs, etc.)
CREATE TABLE IF NOT EXISTS campaign_assets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamptz DEFAULT now(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  mime_type text,
  size_bytes bigint,
  asset_type text DEFAULT 'creative' CHECK (asset_type IN ('creative', 'other')),
  notes text
);

ALTER TABLE campaign_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "authenticated_all" ON campaign_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
