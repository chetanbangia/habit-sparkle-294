DELETE FROM public.user_roles
WHERE role = 'admin'::public.app_role
  AND user_id NOT IN (
    SELECT id FROM auth.users WHERE lower(email) = 'saanjhadmin@saanjhmatrimony.com'
  );

UPDATE auth.users
SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE lower(email) = 'saanjhadmin@saanjhmatrimony.com';

INSERT INTO public.profiles (id, display_name)
SELECT id, 'Saanjh Admin'
FROM auth.users
WHERE lower(email) = 'saanjhadmin@saanjhmatrimony.com'
ON CONFLICT (id) DO UPDATE
SET display_name = COALESCE(public.profiles.display_name, EXCLUDED.display_name),
    updated_at = now();

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'saanjhadmin@saanjhmatrimony.com'
ON CONFLICT (user_id, role) DO NOTHING;