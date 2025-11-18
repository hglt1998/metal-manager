-- Permitir que los administradores actualicen cualquier perfil
-- Los usuarios normales solo pueden actualizar su propio perfil

-- Eliminar la política restrictiva actual
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Crear política para que usuarios actualicen su propio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- Crear política para que administradores actualicen cualquier perfil
CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (SELECT auth.uid())
    AND role = 'admin'
  )
);
