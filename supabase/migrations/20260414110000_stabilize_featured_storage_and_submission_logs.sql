drop policy if exists "Authenticated users can upload item images" on storage.objects;
create policy "Authenticated users can upload item images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'item-images'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "Authenticated users can update item images" on storage.objects;
create policy "Authenticated users can update item images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'item-images'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
)
with check (
  bucket_id = 'item-images'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "Authenticated users can delete item images" on storage.objects;
create policy "Authenticated users can delete item images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'item-images'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or public.is_admin()
  )
);

drop policy if exists "Users can read own submission logs" on public.submission_logs;
create policy "Users can read own submission logs"
on public.submission_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.items
    where items.id = submission_logs.item_id
      and items.submitted_by = auth.uid()
  )
);
