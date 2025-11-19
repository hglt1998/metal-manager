-- Eliminar la restricción de tipo enum si existe
DROP TYPE IF EXISTS tipo_vehiculo CASCADE;

-- Verificar y corregir la estructura de la tabla vehiculos
DO $$
BEGIN
    -- Si la tabla existe pero no tiene la columna tipo, agregarla
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vehiculos') THEN
        -- Verificar si la columna tipo existe
        IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'vehiculos' AND column_name = 'tipo') THEN
            -- Agregar la columna tipo si no existe
            ALTER TABLE public.vehiculos ADD COLUMN tipo TEXT NOT NULL DEFAULT 'furgón';
        ELSE
            -- Si existe, asegurar que sea TEXT sin restricciones
            ALTER TABLE public.vehiculos ALTER COLUMN tipo TYPE TEXT;
        END IF;
    END IF;
END $$;
