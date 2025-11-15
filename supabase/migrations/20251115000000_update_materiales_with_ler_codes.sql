-- Migration: Update materiales table with LER codes and material family
-- Description: Adds LER codes for different client types and material family classification

-- Add new columns to materiales table
ALTER TABLE materiales
  ADD COLUMN IF NOT EXISTS material_familia TEXT,
  ADD COLUMN IF NOT EXISTS ler_01 TEXT,
  ADD COLUMN IF NOT EXISTS ler_02 TEXT,
  ADD COLUMN IF NOT EXISTS ler_03 TEXT,
  ADD COLUMN IF NOT EXISTS ler_04 TEXT;

-- Add comments to explain the columns
COMMENT ON COLUMN materiales.material_familia IS 'Familia o categoría del material (ej: acero, plástico, madera)';
COMMENT ON COLUMN materiales.ler_01 IS 'Código LER para clientes tipo 1';
COMMENT ON COLUMN materiales.ler_02 IS 'Código LER para clientes tipo 2';
COMMENT ON COLUMN materiales.ler_03 IS 'Código LER para clientes tipo 3';
COMMENT ON COLUMN materiales.ler_04 IS 'Código LER para clientes tipo 4';

-- Rename nombre column to material for consistency with the data
ALTER TABLE materiales RENAME COLUMN nombre TO material;

-- Add comment to material column
COMMENT ON COLUMN materiales.material IS 'Nombre específico del material';

-- Create index on material_familia for faster filtering
CREATE INDEX IF NOT EXISTS idx_materiales_familia ON materiales(material_familia);

-- Create index on material for searching
CREATE INDEX IF NOT EXISTS idx_materiales_material ON materiales(material);
