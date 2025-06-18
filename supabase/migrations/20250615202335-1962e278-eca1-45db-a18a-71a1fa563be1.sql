
-- Activer la sécurité au niveau des lignes sur la table des profils admin
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Permettre aux administrateurs de lire tous les profils admin
CREATE POLICY "Allow admins to read admin_profiles"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Permettre aux administrateurs d'insérer de nouveaux profils admin
CREATE POLICY "Allow admins to insert admin_profiles"
ON public.admin_profiles
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- Permettre aux administrateurs de mettre à jour les profils admin
CREATE POLICY "Allow admins to update admin_profiles"
ON public.admin_profiles
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Permettre aux administrateurs de supprimer des profils admin
CREATE POLICY "Allow admins to delete admin_profiles"
ON public.admin_profiles
FOR DELETE
USING (public.is_admin(auth.uid()));
