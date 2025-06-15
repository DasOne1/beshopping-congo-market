
-- Ajouter les nouvelles colonnes à la table products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS subcategory_id uuid REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS colors text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('homme', 'femme', 'mixte')),
ADD COLUMN IF NOT EXISTS material text,
ADD COLUMN IF NOT EXISTS brand text,
ADD COLUMN IF NOT EXISTS collection text,
ADD COLUMN IF NOT EXISTS season text,
ADD COLUMN IF NOT EXISTS care_instructions text;

-- Ajouter un commentaire pour clarifier que subcategory_id référence les catégories avec parent_id
COMMENT ON COLUMN public.products.subcategory_id IS 'References categories table where parent_id is not null (subcategories)';
