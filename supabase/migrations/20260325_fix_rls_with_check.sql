-- Fix RLS policies: add WITH CHECK so INSERT/UPDATE operations work
-- The original policies only had USING (true) which blocks writes

drop policy if exists "authenticated_all" on brands;
create policy "authenticated_all" on brands for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_all" on brand_assets;
create policy "authenticated_all" on brand_assets for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_all" on brand_images;
create policy "authenticated_all" on brand_images for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_all" on brand_voice_examples;
create policy "authenticated_all" on brand_voice_examples for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_all" on campaigns;
create policy "authenticated_all" on campaigns for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_all" on generated_content;
create policy "authenticated_all" on generated_content for all to authenticated using (true) with check (true);

drop policy if exists "authenticated_all" on email_sends;
create policy "authenticated_all" on email_sends for all to authenticated using (true) with check (true);
