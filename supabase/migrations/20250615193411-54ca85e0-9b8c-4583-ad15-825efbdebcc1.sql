
-- Activer la sécurité au niveau des lignes sur la table des paramètres
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Permettre aux administrateur de lire tous les paramètres
CREATE POLICY "Allow admins to read settings"
ON public.settings
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Permettre aux administrateurs d'insérer de nouveaux paramètres
CREATE POLICY "Allow admins to insert settings"
ON public.settings
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

-- Permettre aux administrateurs de mettre à jour les paramètres
CREATE POLICY "Allow admins to update settings"
ON public.settings
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

-- Permettre aux administrateurs de supprimer des paramètres
CREATE POLICY "Allow admins to delete settings"
ON public.settings
FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));
