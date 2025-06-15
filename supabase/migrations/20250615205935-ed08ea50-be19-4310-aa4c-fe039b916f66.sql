
-- Supprimer d'abord tout profil admin existant pour cet email
DELETE FROM public.admin_profiles WHERE email = 'eliseemulekadas1@gmail.com';

-- Mettre à jour le mot de passe de l'utilisateur existant s'il existe
UPDATE auth.users 
SET 
    encrypted_password = crypt('mayckone1', gen_salt('bf')),
    updated_at = now(),
    email_confirmed_at = now(),
    raw_user_meta_data = '{"full_name": "Elisee Muleka"}'
WHERE email = 'eliseemulekadas1@gmail.com';

-- Créer le profil administrateur correspondant
INSERT INTO public.admin_profiles (
    user_id,
    email,
    full_name,
    role,
    is_active
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'eliseemulekadas1@gmail.com'),
    'eliseemulekadas1@gmail.com',
    'Elisee Muleka',
    'admin',
    true
);
