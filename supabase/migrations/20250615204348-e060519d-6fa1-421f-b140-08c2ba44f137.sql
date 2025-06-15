
-- This function safely retrieves the role of the currently logged-in user
-- by bypassing RLS, thus avoiding recursion.
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- We use a temporary variable to store the role.
  SELECT role INTO user_role
  FROM admin_profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
  
  RETURN user_role;
END;
$$;

-- Drop all potentially conflicting old policies on admin_profiles
DROP POLICY IF EXISTS "Enable read access for all users." ON public.admin_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins have full access" ON public.admin_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins have full access on admin profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Users can view their own admin profile" ON public.admin_profiles;


-- Ensure RLS is enabled on the table.
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for admins to have full access (SELECT, INSERT, UPDATE, DELETE).
-- This uses the safe function to check the user's role and avoid recursion.
CREATE POLICY "Admins have full access on admin profiles"
ON public.admin_profiles
FOR ALL
USING (get_current_user_role() = 'admin')
WITH CHECK (get_current_user_role() = 'admin');

-- Policy for users to view their own profile.
-- This allows any authenticated user to read their own row in admin_profiles.
CREATE POLICY "Users can view their own admin profile"
ON public.admin_profiles
FOR SELECT
USING (user_id = auth.uid());

