-- ============================================
-- Crear tabla centros
-- ============================================

-- Crear tabla de centros de reciclaje
CREATE TABLE IF NOT EXISTS public.centros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    direccion TEXT NOT NULL,
    telefono VARCHAR(50),
    email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_centros_nombre ON public.centros(nombre);

-- RLS (Row Level Security)
ALTER TABLE public.centros ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso
-- Todos los usuarios autenticados pueden ver centros
CREATE POLICY "Usuarios autenticados pueden ver centros"
    ON public.centros
    FOR SELECT
    TO authenticated
    USING (true);

-- Solo admins y planificadores pueden insertar centros
CREATE POLICY "Admins y planificadores pueden crear centros"
    ON public.centros
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'planificador_rutas')
        )
    );

-- Solo admins y planificadores pueden actualizar centros
CREATE POLICY "Admins y planificadores pueden actualizar centros"
    ON public.centros
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'planificador_rutas')
        )
    );

-- Solo admins pueden eliminar centros
CREATE POLICY "Solo admins pueden eliminar centros"
    ON public.centros
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_centros_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_centros_updated_at
    BEFORE UPDATE ON public.centros
    FOR EACH ROW
    EXECUTE FUNCTION public.update_centros_updated_at();

-- Comentarios
COMMENT ON TABLE public.centros IS 'Centros de reciclaje o recogida de materiales';
COMMENT ON COLUMN public.centros.nombre IS 'Nombre del centro de reciclaje';
COMMENT ON COLUMN public.centros.direccion IS 'Dirección completa del centro';
COMMENT ON COLUMN public.centros.telefono IS 'Teléfono de contacto del centro';
COMMENT ON COLUMN public.centros.email IS 'Email de contacto del centro';
