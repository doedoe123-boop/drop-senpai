insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view item images" on storage.objects;
create policy "Public can view item images"
on storage.objects
for select
using (bucket_id = 'item-images');

drop policy if exists "Authenticated users can upload item images" on storage.objects;
create policy "Authenticated users can upload item images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'item-images');

drop policy if exists "Authenticated users can update item images" on storage.objects;
create policy "Authenticated users can update item images"
on storage.objects
for update
to authenticated
using (bucket_id = 'item-images')
with check (bucket_id = 'item-images');

drop policy if exists "Authenticated users can delete item images" on storage.objects;
create policy "Authenticated users can delete item images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'item-images');

