
-- Déclencheur pour créer automatiquement un profil admin lors de la création d'un nouvel utilisateur
CREATE TRIGGER on_auth_user_created_for_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_admin_user();
