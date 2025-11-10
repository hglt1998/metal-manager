-- ============================================
-- Migración completa: Refactorización del esquema
-- ============================================
-- Esta migración incluye:
-- 1. Optimización de políticas RLS existentes
-- 2. Nueva tabla de vehículos
-- 3. Reemplazo de ubicaciones por centros
-- 4. Renombrado de cargas a rutas
-- 5. Nueva tabla de paradas_ruta
-- 6. Nuevo rol planificador_rutas
-- 7. Funciones auxiliares de validación

-- ============================================
-- PASO 1: CREAR ENUMS Y TIPOS
-- ============================================
-- IMPORTANTE: Antes de ejecutar esta migración, debes haber ejecutado:
-- 20250110120000_add_planificador_role.sql

-- Crear enum para tipos de vehículo
CREATE TYPE tipo_vehiculo AS ENUM (
  'camion_rigido',
  'furgoneta',
  'coche',
  'cabeza_tractora',
  'remolque'
);

-- Crear enum para tipos de centro
CREATE TYPE tipo_centro AS ENUM (
  'remitente',
  'destino',
  'ambos'
);

-- Crear enum para estados de ruta
CREATE TYPE estado_ruta AS ENUM (
  'planificada',
  'en_curso',
  'completada',
  'cancelada'
);

-- Crear enum para tipos de operación en paradas
CREATE TYPE tipo_operacion AS ENUM (
  'recogida',
  'entrega'
);

-- Crear enum para estados de parada
CREATE TYPE estado_parada AS ENUM (
  'pendiente',
  'completada',
  'cancelada'
);

-- Crear enum para tipos de carnet
CREATE TYPE tipo_carnet AS ENUM (
  'B',
  'C',
  'C+E',
  'C1',
  'C1+E'
);


-- ============================================
-- PASO 2: CREAR NUEVA TABLA VEHICULOS
-- ============================================

CREATE TABLE IF NOT EXISTS public.vehiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  matricula VARCHAR(20) UNIQUE NOT NULL,
  tipo tipo_vehiculo NOT NULL,
  modelo VARCHAR(100),
  tipo_carnet_requerido tipo_carnet,

  -- Capacidades
  capacidad_peso_kg DECIMAL(10, 2),
  capacidad_volumen_m3 DECIMAL(10, 2),
  capacidad_pallets INTEGER,

  -- Dimensiones
  peso_vehiculo_kg DECIMAL(10, 2),
  altura_m DECIMAL(5, 2),
  anchura_m DECIMAL(5, 2),
  longitud_m DECIMAL(5, 2),

  -- Para configuraciones de cabeza tractora + remolque
  remolque_id UUID REFERENCES public.vehiculos(id) ON DELETE SET NULL,

  -- Foto identificativa
  foto_url TEXT,

  -- Control
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Validación: solo remolques o cabezas tractoras pueden tener remolque_id
  CONSTRAINT check_remolque_config CHECK (
    (tipo = 'cabeza_tractora' AND remolque_id IS NOT NULL) OR
    (tipo != 'cabeza_tractora' AND remolque_id IS NULL)
  )
);

-- Índices para vehiculos
CREATE INDEX idx_vehiculos_tipo ON public.vehiculos(tipo);
CREATE INDEX idx_vehiculos_activo ON public.vehiculos(activo);
CREATE INDEX idx_vehiculos_matricula ON public.vehiculos(matricula);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehiculos_updated_at
  BEFORE UPDATE ON public.vehiculos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- PASO 3: CREAR TABLA CENTROS
-- ============================================

CREATE TABLE IF NOT EXISTS public.centros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  tipo tipo_centro NOT NULL,

  -- Ubicación
  direccion TEXT NOT NULL,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),

  -- Restricciones de acceso (opcionales)
  restriccion_altura_m DECIMAL(5, 2),
  restriccion_anchura_m DECIMAL(5, 2),
  restriccion_peso_kg DECIMAL(10, 2),

  -- Horarios de operación
  horario_apertura TIME,
  horario_cierre TIME,
  dias_operacion VARCHAR(50), -- Ej: "L-V" o "L,M,X,J,V,S"

  -- Información de contacto
  contacto_nombre VARCHAR(255),
  contacto_telefono VARCHAR(20),
  contacto_email VARCHAR(255),

  -- Control
  activo BOOLEAN DEFAULT true,
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para centros
CREATE INDEX idx_centros_tipo ON public.centros(tipo);
CREATE INDEX idx_centros_activo ON public.centros(activo);
CREATE INDEX idx_centros_coordenadas ON public.centros(latitud, longitud);

CREATE TRIGGER update_centros_updated_at
  BEFORE UPDATE ON public.centros
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- PASO 4: MIGRAR DATOS DE UBICACIONES A CENTROS
-- ============================================

-- Migrar ubicaciones_recogida
INSERT INTO public.centros (
  nombre,
  tipo,
  direccion,
  latitud,
  longitud,
  activo,
  created_at
)
SELECT
  nombre,
  'remitente'::tipo_centro,
  'Sin especificar', -- La tabla original no tiene direccion
  NULL, -- latitud no existe en tabla antigua
  NULL, -- longitud no existe en tabla antigua
  true,
  created_at
FROM public.ubicaciones_recogida
WHERE NOT EXISTS (
  SELECT 1 FROM public.centros WHERE centros.nombre = ubicaciones_recogida.nombre
);

-- Migrar ubicaciones_destino
INSERT INTO public.centros (
  nombre,
  tipo,
  direccion,
  latitud,
  longitud,
  activo,
  created_at
)
SELECT
  nombre,
  'destino'::tipo_centro,
  'Sin especificar', -- La tabla original no tiene direccion
  NULL,
  NULL,
  true,
  created_at
FROM public.ubicaciones_destino
WHERE NOT EXISTS (
  SELECT 1 FROM public.centros WHERE centros.nombre = ubicaciones_destino.nombre
);


-- ============================================
-- PASO 5: CREAR NUEVA TABLA RUTAS
-- ============================================

CREATE TABLE IF NOT EXISTS public.rutas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Referencias
  operario_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  vehiculo_id UUID NOT NULL REFERENCES public.vehiculos(id) ON DELETE RESTRICT,
  planificador_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,

  -- Estado y control
  estado estado_ruta DEFAULT 'planificada',
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_inicio_planificada TIMESTAMPTZ,
  fecha_inicio_real TIMESTAMPTZ,
  fecha_fin_real TIMESTAMPTZ,

  -- Información adicional
  notas TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para rutas
CREATE INDEX idx_rutas_operario ON public.rutas(operario_id);
CREATE INDEX idx_rutas_vehiculo ON public.rutas(vehiculo_id);
CREATE INDEX idx_rutas_planificador ON public.rutas(planificador_id);
CREATE INDEX idx_rutas_estado ON public.rutas(estado);
CREATE INDEX idx_rutas_fecha_inicio ON public.rutas(fecha_inicio_planificada);

CREATE TRIGGER update_rutas_updated_at
  BEFORE UPDATE ON public.rutas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- PASO 6: CREAR TABLA PARADAS_RUTA
-- ============================================

CREATE TABLE IF NOT EXISTS public.paradas_ruta (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Referencias
  ruta_id UUID NOT NULL REFERENCES public.rutas(id) ON DELETE CASCADE,
  centro_id UUID NOT NULL REFERENCES public.centros(id) ON DELETE RESTRICT,
  material_id UUID NOT NULL REFERENCES public.materiales(id) ON DELETE RESTRICT,

  -- Orden de las paradas
  orden INTEGER NOT NULL,

  -- Tipo de operación
  tipo_operacion tipo_operacion NOT NULL,

  -- Planificación temporal
  fecha_hora_planificada TIMESTAMPTZ NOT NULL,
  fecha_hora_real TIMESTAMPTZ,

  -- Cantidad
  cantidad_kg DECIMAL(10, 2) NOT NULL,

  -- Estado
  estado estado_parada DEFAULT 'pendiente',

  -- Información adicional
  observaciones TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Validaciones
  CONSTRAINT check_cantidad_positiva CHECK (cantidad_kg > 0),
  CONSTRAINT unique_ruta_orden UNIQUE (ruta_id, orden)
);

-- Índices para paradas_ruta
CREATE INDEX idx_paradas_ruta_ruta ON public.paradas_ruta(ruta_id);
CREATE INDEX idx_paradas_ruta_centro ON public.paradas_ruta(centro_id);
CREATE INDEX idx_paradas_ruta_material ON public.paradas_ruta(material_id);
CREATE INDEX idx_paradas_ruta_orden ON public.paradas_ruta(ruta_id, orden);
CREATE INDEX idx_paradas_ruta_estado ON public.paradas_ruta(estado);

CREATE TRIGGER update_paradas_ruta_updated_at
  BEFORE UPDATE ON public.paradas_ruta
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- PASO 7: MIGRAR DATOS DE CARGAS A RUTAS
-- ============================================

-- IMPORTANTE: No migraremos automáticamente los datos de cargas a rutas
-- porque el nuevo modelo es significativamente diferente (múltiples paradas vs una sola carga)
--
-- Para migrar datos antiguos, deberás:
-- 1. Crear un vehículo temporal o asignar vehículos reales
-- 2. Crear una ruta por cada carga antigua
-- 3. Crear dos paradas_ruta por cada carga:
--    - Parada 1 (recogida): centro_recogida_id, tipo_operacion='recogida'
--    - Parada 2 (entrega): centro_destino_id, tipo_operacion='entrega'
--
-- Puedes hacer esto manualmente después de ejecutar la migración o mantener
-- la tabla cargas como histórico y empezar con el nuevo sistema desde cero.

-- Descomentar solo si tienes al menos un vehículo creado y quieres migrar los datos:
/*
INSERT INTO public.rutas (
  id,
  operario_id,
  vehiculo_id,
  planificador_id,
  estado,
  fecha_creacion,
  created_at
)
SELECT
  id,
  operario_id,
  (SELECT id FROM public.vehiculos LIMIT 1), -- Asignar el primer vehículo disponible
  operario_id, -- Temporal: asumimos que el operario fue el planificador
  'completada'::estado_ruta,
  created_at,
  created_at
FROM public.cargas
WHERE EXISTS (SELECT 1 FROM public.vehiculos LIMIT 1);

-- Crear paradas para cada carga migrada
INSERT INTO public.paradas_ruta (
  ruta_id,
  centro_id,
  material_id,
  orden,
  tipo_operacion,
  fecha_hora_planificada,
  cantidad_kg,
  estado
)
SELECT
  c.id as ruta_id,
  c.centro_recogida_id,
  c.material_id,
  1 as orden,
  'recogida'::tipo_operacion,
  c.created_at,
  c.peso,
  'completada'::estado_parada
FROM public.cargas c
WHERE EXISTS (SELECT 1 FROM public.rutas WHERE rutas.id = c.id)
UNION ALL
SELECT
  c.id as ruta_id,
  c.centro_destino_id,
  c.material_id,
  2 as orden,
  'entrega'::tipo_operacion,
  c.created_at + INTERVAL '1 hour', -- Asumimos 1 hora después
  c.peso,
  'completada'::estado_parada
FROM public.cargas c
WHERE EXISTS (SELECT 1 FROM public.rutas WHERE rutas.id = c.id);
*/


-- ============================================
-- PASO 8: FUNCIONES AUXILIARES
-- ============================================

-- Función para calcular carga acumulada en una ruta
CREATE OR REPLACE FUNCTION calcular_carga_acumulada(p_ruta_id UUID, p_hasta_orden INTEGER)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
  v_carga_acumulada DECIMAL(10, 2) := 0;
BEGIN
  SELECT COALESCE(SUM(
    CASE
      WHEN tipo_operacion = 'recogida' THEN cantidad_kg
      WHEN tipo_operacion = 'entrega' THEN -cantidad_kg
      ELSE 0
    END
  ), 0)
  INTO v_carga_acumulada
  FROM public.paradas_ruta
  WHERE ruta_id = p_ruta_id
    AND orden <= p_hasta_orden
  ORDER BY orden;

  RETURN v_carga_acumulada;
END;
$$ LANGUAGE plpgsql;


-- Función para validar capacidad del vehículo en una parada
CREATE OR REPLACE FUNCTION validar_capacidad_vehiculo(p_ruta_id UUID, p_orden INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  v_carga_acumulada DECIMAL(10, 2);
  v_capacidad_vehiculo DECIMAL(10, 2);
BEGIN
  -- Obtener carga acumulada hasta esta parada
  v_carga_acumulada := calcular_carga_acumulada(p_ruta_id, p_orden);

  -- Obtener capacidad del vehículo
  SELECT v.capacidad_peso_kg
  INTO v_capacidad_vehiculo
  FROM public.rutas r
  JOIN public.vehiculos v ON r.vehiculo_id = v.id
  WHERE r.id = p_ruta_id;

  -- Validar que no exceda la capacidad
  RETURN v_carga_acumulada <= v_capacidad_vehiculo;
END;
$$ LANGUAGE plpgsql;


-- Función para verificar restricciones de centro
CREATE OR REPLACE FUNCTION verificar_restricciones_centro(p_vehiculo_id UUID, p_centro_id UUID)
RETURNS TABLE(
  cumple_restricciones BOOLEAN,
  restriccion_altura BOOLEAN,
  restriccion_anchura BOOLEAN,
  restriccion_peso BOOLEAN
) AS $$
DECLARE
  v_vehiculo RECORD;
  v_centro RECORD;
BEGIN
  -- Obtener datos del vehículo
  SELECT altura_m, anchura_m, peso_vehiculo_kg
  INTO v_vehiculo
  FROM public.vehiculos
  WHERE id = p_vehiculo_id;

  -- Obtener restricciones del centro
  SELECT restriccion_altura_m, restriccion_anchura_m, restriccion_peso_kg
  INTO v_centro
  FROM public.centros
  WHERE id = p_centro_id;

  -- Evaluar cada restricción
  RETURN QUERY SELECT
    (
      (v_centro.restriccion_altura_m IS NULL OR v_vehiculo.altura_m <= v_centro.restriccion_altura_m) AND
      (v_centro.restriccion_anchura_m IS NULL OR v_vehiculo.anchura_m <= v_centro.restriccion_anchura_m) AND
      (v_centro.restriccion_peso_kg IS NULL OR v_vehiculo.peso_vehiculo_kg <= v_centro.restriccion_peso_kg)
    ) as cumple_restricciones,
    (v_centro.restriccion_altura_m IS NULL OR v_vehiculo.altura_m <= v_centro.restriccion_altura_m) as restriccion_altura,
    (v_centro.restriccion_anchura_m IS NULL OR v_vehiculo.anchura_m <= v_centro.restriccion_anchura_m) as restriccion_anchura,
    (v_centro.restriccion_peso_kg IS NULL OR v_vehiculo.peso_vehiculo_kg <= v_centro.restriccion_peso_kg) as restriccion_peso;
END;
$$ LANGUAGE plpgsql;


-- ============================================
-- PASO 9: OPTIMIZAR POLÍTICAS RLS - PROFILES
-- ============================================

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Enable read for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;

-- Crear políticas optimizadas
CREATE POLICY "Users can read all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));


-- ============================================
-- PASO 10: OPTIMIZAR POLÍTICAS RLS - MATERIALES
-- ============================================

ALTER TABLE public.materiales ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Todos pueden ver materiales" ON public.materiales;
DROP POLICY IF EXISTS "Solo admins pueden insertar materiales" ON public.materiales;
DROP POLICY IF EXISTS "Solo admins pueden actualizar materiales" ON public.materiales;
DROP POLICY IF EXISTS "Solo admins pueden eliminar materiales" ON public.materiales;

CREATE POLICY "Todos pueden ver materiales"
ON public.materiales
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Solo admins y planificadores pueden insertar materiales"
ON public.materiales
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
    AND profiles.role IN ('admin', 'planificador_rutas')
  )
);

CREATE POLICY "Solo admins y planificadores pueden actualizar materiales"
ON public.materiales
FOR UPDATE
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

CREATE POLICY "Solo admins pueden eliminar materiales"
ON public.materiales
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
    AND profiles.role = 'admin'
  )
);


-- ============================================
-- PASO 11: POLÍTICAS RLS - VEHICULOS
-- ============================================

ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver vehiculos"
ON public.vehiculos
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Solo admins y planificadores pueden gestionar vehiculos"
ON public.vehiculos
FOR ALL
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


-- ============================================
-- PASO 12: POLÍTICAS RLS - CENTROS
-- ============================================

ALTER TABLE public.centros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver centros"
ON public.centros
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Solo admins y planificadores pueden gestionar centros"
ON public.centros
FOR ALL
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


-- ============================================
-- PASO 13: POLÍTICAS RLS - RUTAS
-- ============================================

ALTER TABLE public.rutas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Operarios pueden ver sus propias rutas"
ON public.rutas
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
    AND (
      profiles.role IN ('admin', 'planificador_rutas')
      OR rutas.operario_id = profiles.id
    )
  )
);

CREATE POLICY "Solo planificadores y admins pueden crear rutas"
ON public.rutas
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
    AND profiles.role IN ('admin', 'planificador_rutas')
  )
);

CREATE POLICY "Solo planificadores y admins pueden actualizar rutas"
ON public.rutas
FOR UPDATE
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

CREATE POLICY "Solo admins pueden eliminar rutas"
ON public.rutas
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = (SELECT auth.uid())
    AND profiles.role = 'admin'
  )
);


-- ============================================
-- PASO 14: POLÍTICAS RLS - PARADAS_RUTA
-- ============================================

ALTER TABLE public.paradas_ruta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver paradas de rutas accesibles"
ON public.paradas_ruta
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.rutas r
    JOIN public.profiles p ON p.id = (SELECT auth.uid())
    WHERE r.id = paradas_ruta.ruta_id
    AND (
      p.role IN ('admin', 'planificador_rutas')
      OR r.operario_id = p.id
    )
  )
);

CREATE POLICY "Solo planificadores y admins pueden gestionar paradas"
ON public.paradas_ruta
FOR ALL
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


-- ============================================
-- PASO 15: COMENTARIOS Y DOCUMENTACIÓN
-- ============================================

COMMENT ON TABLE public.vehiculos IS 'Tabla de vehículos de la empresa con sus especificaciones técnicas';
COMMENT ON TABLE public.centros IS 'Centros de recogida y/o destino con restricciones de acceso';
COMMENT ON TABLE public.rutas IS 'Rutas planificadas para operarios con múltiples paradas';
COMMENT ON TABLE public.paradas_ruta IS 'Detalle de cada parada en una ruta con operaciones de recogida/entrega';

COMMENT ON FUNCTION calcular_carga_acumulada IS 'Calcula la carga acumulada en una ruta hasta una parada específica';
COMMENT ON FUNCTION validar_capacidad_vehiculo IS 'Valida que la carga no exceda la capacidad del vehículo';
COMMENT ON FUNCTION verificar_restricciones_centro IS 'Verifica si un vehículo cumple con las restricciones de acceso de un centro';


-- ============================================
-- PASO 16: NOTAS FINALES
-- ============================================

-- IMPORTANTE: Después de ejecutar esta migración:
-- 1. Las tablas ubicaciones_recogida y ubicaciones_destino pueden eliminarse manualmente si ya no se necesitan
-- 2. La tabla cargas puede eliminarse después de migrar completamente los datos a rutas/paradas_ruta
-- 3. Asignar vehículos reales a las rutas migradas
-- 4. Actualizar los planificador_id en las rutas migradas con el usuario correcto
-- 5. Crear paradas_ruta para las cargas antiguas si es necesario

-- Para eliminar las tablas antiguas (descomentar cuando estés listo):
-- DROP TABLE IF EXISTS public.cargas CASCADE;
-- DROP TABLE IF EXISTS public.ubicaciones_recogida CASCADE;
-- DROP TABLE IF EXISTS public.ubicaciones_destino CASCADE;
