-- Eliminar enum si existe de migraciones anteriores
DROP TYPE IF EXISTS tipo_vehiculo CASCADE;

-- Crear tabla de vehículos
CREATE TABLE IF NOT EXISTS public.vehiculos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    matricula TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL, -- furgón, camión, bañera, paquetero, cabeza, etc.
    activo BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Crear tabla de remolques
CREATE TABLE IF NOT EXISTS public.remolques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    matricula TEXT NOT NULL UNIQUE,
    batea TEXT, -- bañera aluminio, bañera hierro, etc.
    activo BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Crear tabla de contenedores
CREATE TABLE IF NOT EXISTS public.contenedores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    codigo TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL, -- contenedor 20m3, contenedor 30m3, etc.
    activo BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_vehiculos_matricula ON public.vehiculos(matricula);
CREATE INDEX IF NOT EXISTS idx_vehiculos_activo ON public.vehiculos(activo);
CREATE INDEX IF NOT EXISTS idx_remolques_matricula ON public.remolques(matricula);
CREATE INDEX IF NOT EXISTS idx_remolques_activo ON public.remolques(activo);
CREATE INDEX IF NOT EXISTS idx_contenedores_codigo ON public.contenedores(codigo);
CREATE INDEX IF NOT EXISTS idx_contenedores_activo ON public.contenedores(activo);

-- Habilitar RLS
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remolques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contenedores ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para vehiculos
CREATE POLICY "Usuarios autenticados pueden ver vehiculos"
ON public.vehiculos
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins y planificadores pueden insertar vehiculos"
ON public.vehiculos
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'planificador_rutas')
  )
);

CREATE POLICY "Admins y planificadores pueden actualizar vehiculos"
ON public.vehiculos
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'planificador_rutas')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'planificador_rutas')
  )
);

CREATE POLICY "Solo admins pueden eliminar vehiculos"
ON public.vehiculos
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  )
);

-- Políticas RLS para remolques (mismas que vehiculos)
CREATE POLICY "Usuarios autenticados pueden ver remolques"
ON public.remolques
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins y planificadores pueden insertar remolques"
ON public.remolques
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'planificador_rutas')
  )
);

CREATE POLICY "Admins y planificadores pueden actualizar remolques"
ON public.remolques
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'planificador_rutas')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'planificador_rutas')
  )
);

CREATE POLICY "Solo admins pueden eliminar remolques"
ON public.remolques
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  )
);

-- Políticas RLS para contenedores (mismas que vehiculos)
CREATE POLICY "Usuarios autenticados pueden ver contenedores"
ON public.contenedores
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins y planificadores pueden insertar contenedores"
ON public.contenedores
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'planificador_rutas')
  )
);

CREATE POLICY "Admins y planificadores pueden actualizar contenedores"
ON public.contenedores
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'planificador_rutas')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role IN ('admin', 'planificador_rutas')
  )
);

CREATE POLICY "Solo admins pueden eliminar contenedores"
ON public.contenedores
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  )
);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_vehiculos_updated_at ON public.vehiculos;
CREATE TRIGGER update_vehiculos_updated_at
    BEFORE UPDATE ON public.vehiculos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_remolques_updated_at ON public.remolques;
CREATE TRIGGER update_remolques_updated_at
    BEFORE UPDATE ON public.remolques
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_contenedores_updated_at ON public.contenedores;
CREATE TRIGGER update_contenedores_updated_at
    BEFORE UPDATE ON public.contenedores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
