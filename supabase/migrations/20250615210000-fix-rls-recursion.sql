
-- Supprimer la fonction existante qui cause la récursion
DROP FUNCTION IF EXISTS public.get_current_user_role();

-- Créer une nouvelle fonction qui évite la récursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Vérifier si l'utilisateur est authentifié
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Récupérer le rôle directement sans passer par les politiques RLS
  SELECT role INTO user_role
  FROM admin_profiles
  WHERE user_id = auth.uid()
  AND is_active = true
  LIMIT 1;
  
  RETURN user_role;
END;
$$;

-- Supprimer toutes les politiques existantes qui causent des problèmes
DROP POLICY IF EXISTS "Admins have full access on admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Users can view their own admin profile" ON public.admin_profiles;

-- Désactiver temporairement RLS pour permettre l'accès initial
ALTER TABLE public.admin_profiles DISABLE ROW LEVEL SECURITY;

-- Réactiver RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Créer des politiques plus simples qui évitent la récursion
CREATE POLICY "Allow admin profile access"
ON public.admin_profiles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
