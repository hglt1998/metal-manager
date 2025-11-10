-- ============================================
-- Añadir campo precio_kg a tabla materiales
-- ============================================

-- Añadir columna precio_kg (precio por kilogramo en euros)
ALTER TABLE public.materiales
ADD COLUMN IF NOT EXISTS precio_kg DECIMAL(10, 2) DEFAULT 0 CHECK (precio_kg >= 0);

-- Comentario descriptivo
COMMENT ON COLUMN public.materiales.precio_kg IS 'Precio por kilogramo del material en euros (€/kg)';
