-- Supabase grants function execution to API roles by default. Privileged RPCs
-- must be callable only by signed-in users after their own authorization checks.
do $$
declare
  function_signature text;
begin
  for function_signature in
    select format('%I.%I(%s)', n.nspname, p.proname, pg_get_function_identity_arguments(p.oid))
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
  loop
    execute format('revoke execute on function %s from public, anon', function_signature);
  end loop;
end
$$;

-- New functions must opt into API access explicitly in their migration.
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated;
