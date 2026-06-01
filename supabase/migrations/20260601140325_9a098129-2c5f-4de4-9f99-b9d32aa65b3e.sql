
-- 1. Revoke EXECUTE on has_role from public/anon (keep authenticated since RLS policies invoke it)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;

-- 2. profile_photos: only show photos for approved profiles (or own / admin)
DROP POLICY IF EXISTS "Photos visible to authenticated" ON public.profile_photos;
CREATE POLICY "Photos visible for approved profiles"
ON public.profile_photos
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR has_role(auth.uid(), 'admin'::app_role)
  OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = profile_photos.profile_id
      AND p.status = 'approved'::profile_status_t
  )
);

-- 3. Storage: only read photos for approved profiles (folder name = profile uuid)
DROP POLICY IF EXISTS "Photos readable by authenticated" ON storage.objects;
CREATE POLICY "Photos readable for approved profiles"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'profile-photos'
  AND (
    (storage.foldername(name))[1] = (auth.uid())::text
    OR has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id::text = (storage.foldername(name))[1]
        AND p.status = 'approved'::profile_status_t
    )
  )
);

-- 4. profiles.phone: revoke column-level SELECT from authenticated; expose via RPC for matched users only
REVOKE SELECT (phone) ON public.profiles FROM authenticated;
REVOKE SELECT (phone) ON public.profiles FROM anon;

CREATE OR REPLACE FUNCTION public.get_profile_phone(_profile_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _phone text;
BEGIN
  -- Caller must be self, admin, or matched with the target profile
  IF auth.uid() = _profile_id
     OR has_role(auth.uid(), 'admin'::app_role)
     OR EXISTS (
       SELECT 1 FROM public.matches m
       WHERE (m.user_a = auth.uid() AND m.user_b = _profile_id)
          OR (m.user_b = auth.uid() AND m.user_a = _profile_id)
     )
  THEN
    SELECT phone INTO _phone FROM public.profiles WHERE id = _profile_id;
    RETURN _phone;
  END IF;
  RETURN NULL;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_profile_phone(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_profile_phone(uuid) TO authenticated;

-- 5. user_roles: explicit restrictive admin-only write policies
CREATE POLICY "Admins insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Realtime: restrict channel subscriptions to participants of the match
-- Channel topic format used by the app: 'chat-<matchId>'
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can subscribe to own match channels" ON realtime.messages;
CREATE POLICY "Authenticated can subscribe to own match channels"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  CASE
    WHEN realtime.topic() LIKE 'chat-%' THEN EXISTS (
      SELECT 1 FROM public.matches m
      WHERE m.id::text = substring(realtime.topic() FROM 6)
        AND (m.user_a = auth.uid() OR m.user_b = auth.uid())
    )
    ELSE true  -- allow postgres_changes / other system topics; row RLS still applies
  END
);
