
-- D'abord supprimer toutes les politiques qui dépendent de la fonction is_admin
DROP POLICY IF EXISTS "Allow admins to read settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admins to insert settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admins to update settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admins to delete settings" ON public.settings;

-- Supprimer toutes les politiques sur admin_profiles
DROP POLICY IF EXISTS "Allow admin profile access" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins have full access on admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Users can view their own admin profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Allow admins to read admin_profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Allow admins to insert admin_profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Allow admins to update admin_profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Allow admins to delete admin_profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Allow authenticated users to access admin profiles" ON public.admin_profiles;

-- Maintenant supprimer les fonctions
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.is_admin(uuid);

-- Configurer RLS pour admin_profiles
ALTER TABLE public.admin_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Créer une politique simple pour admin_profiles
CREATE POLICY "Allow authenticated users to access admin profiles"
ON public.admin_profiles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Recréer des politiques simples pour settings (permettre à tous les utilisateurs authentifiés)
CREATE POLICY "Allow authenticated users to read settings"
ON public.settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to insert settings"
ON public.settings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update settings"
ON public.settings
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete settings"
ON public.settings
FOR DELETE
TO authenticated
USING (true);
