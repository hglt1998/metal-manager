-- Fix RLS policies for clientes table to use profiles.role instead of auth.jwt()

-- Drop existing policies
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver clientes activos" ON public.clientes;
DROP POLICY IF EXISTS "Admins y planificadores pueden ver todos los clientes" ON public.clientes;
DROP POLICY IF EXISTS "Admins y planificadores pueden crear clientes" ON public.clientes;
DROP POLICY IF EXISTS "Admins y planificadores pueden actualizar clientes" ON public.clientes;
DROP POLICY IF EXISTS "Solo admins pueden eliminar clientes" ON public.clientes;

-- Recreate policies with correct role checking
CREATE POLICY "Usuarios autenticados pueden ver clientes activos"
    ON public.clientes FOR SELECT
    TO authenticated
    USING (activo = true);

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

-- Fix RLS policies for cliente_centros table
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver relaciones cliente-centro" ON public.cliente_centros;
DROP POLICY IF EXISTS "Admins y planificadores pueden crear relaciones" ON public.cliente_centros;
DROP POLICY IF EXISTS "Solo admins pueden eliminar relaciones" ON public.cliente_centros;
DROP POLICY IF EXISTS "Admins y planificadores pueden eliminar relaciones" ON public.cliente_centros;

CREATE POLICY "Usuarios autenticados pueden ver relaciones cliente-centro"
    ON public.cliente_centros FOR SELECT
    TO authenticated
    USING (true);

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
