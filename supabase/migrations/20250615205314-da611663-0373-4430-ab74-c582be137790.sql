
-- Vérifier si le profil admin existe déjà pour cet utilisateur
-- Si il n'existe pas, le créer
INSERT INTO public.admin_profiles (
    user_id,
    email,
    full_name,
    role,
    is_active
) 
SELECT 
    u.id,
    'eliseemulekadas1@gmail.com',
    'Elisee Muleka',
    'admin',
    true
FROM auth.users u
WHERE u.email = 'eliseemulekadas1@gmail.com'
AND NOT EXISTS (
    SELECT 1 FROM public.admin_profiles ap 
    WHERE ap.user_id = u.id
);
