-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    cif TEXT NOT NULL UNIQUE,
    direccion TEXT,
    email_contacto TEXT,
    telefono_contacto TEXT,
    persona_contacto TEXT,
    activo BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Crear tabla de relación muchos a muchos entre clientes y centros
CREATE TABLE IF NOT EXISTS public.cliente_centros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
    centro_id UUID NOT NULL REFERENCES public.centros(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(cliente_id, centro_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON public.clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_clientes_cif ON public.clientes(cif);
CREATE INDEX IF NOT EXISTS idx_clientes_activo ON public.clientes(activo);
CREATE INDEX IF NOT EXISTS idx_cliente_centros_cliente_id ON public.cliente_centros(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cliente_centros_centro_id ON public.cliente_centros(centro_id);

-- RLS Policies para clientes
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden ver clientes activos
CREATE POLICY "Usuarios autenticados pueden ver clientes activos"
    ON public.clientes FOR SELECT
    TO authenticated
    USING (activo = true);

-- Admins y planificadores pueden ver todos los clientes
CREATE POLICY "Admins y planificadores pueden ver todos los clientes"
    ON public.clientes FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid())
            AND profiles.role IN ('admin', 'planificador_rutas')
        )
    );

-- Solo admins y planificadores pueden crear clientes
CREATE POLICY "Admins y planificadores pueden crear clientes"
    ON public.clientes FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid())
            AND profiles.role IN ('admin', 'planificador_rutas')
        )
    );

-- Solo admins y planificadores pueden actualizar clientes
CREATE POLICY "Admins y planificadores pueden actualizar clientes"
    ON public.clientes FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid())
            AND profiles.role IN ('admin', 'planificador_rutas')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid())
            AND profiles.role IN ('admin', 'planificador_rutas')
        )
    );

-- Solo admins pueden eliminar clientes
CREATE POLICY "Solo admins pueden eliminar clientes"
    ON public.clientes FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid())
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies para cliente_centros
ALTER TABLE public.cliente_centros ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden ver las relaciones
CREATE POLICY "Usuarios autenticados pueden ver relaciones cliente-centro"
    ON public.cliente_centros FOR SELECT
    TO authenticated
    USING (true);

-- Solo admins y planificadores pueden crear relaciones
CREATE POLICY "Admins y planificadores pueden crear relaciones"
    ON public.cliente_centros FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid())
            AND profiles.role IN ('admin', 'planificador_rutas')
        )
    );

-- Solo admins y planificadores pueden eliminar relaciones
CREATE POLICY "Admins y planificadores pueden eliminar relaciones"
    ON public.cliente_centros FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = (SELECT auth.uid())
            AND profiles.role IN ('admin', 'planificador_rutas')
        )
    );

-- Trigger para actualizar updated_at en clientes
DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
