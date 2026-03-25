-- Structured font styles for heading and body
alter table brands add column if not exists font_heading jsonb;
alter table brands add column if not exists font_body jsonb;
