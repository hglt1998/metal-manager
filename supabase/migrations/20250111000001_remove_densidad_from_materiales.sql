-- ============================================
-- Eliminar columna densidad de tabla materiales
-- ============================================

-- Eliminar la columna densidad si existe
ALTER TABLE public.materiales
DROP COLUMN IF EXISTS densidad;
