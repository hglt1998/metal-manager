-- ============================================
-- Agregar rol planificador_rutas al enum user_role
-- ============================================
-- IMPORTANTE: Esta migración debe ejecutarse PRIMERO y por separado
-- porque ALTER TYPE ADD VALUE no puede estar en una transacción con otras operaciones

-- Crear el enum si no existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'operario', 'planificador_rutas');
  END IF;
END $$;

-- Agregar el valor 'planificador_rutas' si no existe
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'planificador_rutas';
