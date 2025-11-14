# Hooks Personalizados

Esta carpeta contiene todos los hooks personalizados para gestionar las peticiones recurrentes a la base de datos.

## Arquitectura

Cada entidad de la base de datos tiene:
- **Servicio** (`lib/services/*.service.ts`): Encapsula la lógica de acceso a datos
- **Hook** (`hooks/*.ts`): Proporciona una interfaz React para usar el servicio

## Hooks Disponibles

### useUsers

Gestiona los perfiles de usuario del sistema.

```typescript
import { useUsers } from "@/hooks/useUsers";

function Component() {
  const { users, loading, error, loadUsers, updateUser, updateUserRole } = useUsers();
  // ...
}
```

**Opciones:**
- `autoLoad?: boolean` - Carga automática al montar (por defecto: `true`)

**Retorna:**
- `users`: Array de perfiles de usuario
- `loading`: Estado de carga
- `error`: Error si ocurre alguno
- `loadUsers()`: Recarga la lista de usuarios
- `updateUser(userId, updates)`: Actualiza un usuario
- `updateUserRole(userId, role)`: Actualiza el rol de un usuario

---

### useProfile

Gestiona el perfil del usuario actual autenticado.

```typescript
import { useProfile } from "@/hooks/useProfile";

function Component() {
  const { profile, loading, error, loadProfile, updateProfile } = useProfile();
  // ...
}
```

**Opciones:**
- `autoLoad?: boolean` - Carga automática al montar (por defecto: `true`)

**Retorna:**
- `profile`: Perfil del usuario actual
- `loading`: Estado de carga
- `error`: Error si ocurre alguno
- `loadProfile()`: Recarga el perfil
- `updateProfile(updates)`: Actualiza el perfil (solo `full_name`)

---

### useCentros

Gestiona los centros de recogida y entrega.

```typescript
import { useCentros } from "@/hooks/useCentros";

function Component() {
  const {
    centros,
    loading,
    error,
    loadCentros,
    createCentro,
    updateCentro,
    deleteCentro
  } = useCentros();
  // ...
}
```

**Opciones:**
- `autoLoad?: boolean` - Carga automática al montar (por defecto: `true`)

**Retorna:**
- `centros`: Array de centros
- `loading`: Estado de carga
- `error`: Error si ocurre alguno
- `loadCentros()`: Recarga la lista de centros
- `createCentro(centro)`: Crea un nuevo centro
- `updateCentro(centroId, updates)`: Actualiza un centro
- `deleteCentro(centroId)`: Elimina un centro

---

### useMateriales

Gestiona los materiales reciclables.

```typescript
import { useMateriales } from "@/hooks/useMateriales";

function Component() {
  const {
    materiales,
    loading,
    error,
    loadMateriales,
    createMaterial,
    updateMaterial,
    deleteMaterial
  } = useMateriales();
  // ...
}
```

**Opciones:**
- `autoLoad?: boolean` - Carga automática al montar (por defecto: `true`)

**Retorna:**
- `materiales`: Array de materiales
- `loading`: Estado de carga
- `error`: Error si ocurre alguno
- `loadMateriales()`: Recarga la lista de materiales
- `createMaterial(material)`: Crea un nuevo material
- `updateMaterial(materialId, updates)`: Actualiza un material
- `deleteMaterial(materialId)`: Elimina un material

---

## Servicios

Los servicios están ubicados en `lib/services/` y proporcionan la lógica de acceso a datos:

- `users.service.ts` - Gestión de usuarios
- `profile.service.ts` - Gestión de perfil personal
- `centros.service.ts` - Gestión de centros
- `materiales.service.ts` - Gestión de materiales

Cada servicio sigue el mismo patrón:
1. Clase con métodos CRUD
2. Factory function para crear instancias
3. Manejo de errores consistente
4. Tipado completo con TypeScript

## Ejemplos de Uso

### Cargar datos automáticamente

```typescript
function MiComponente() {
  // Se carga automáticamente al montar
  const { centros, loading } = useCentros();

  if (loading) return <Loader />;
  return <Lista items={centros} />;
}
```

### Sin carga automática

```typescript
function MiFormulario() {
  // No carga automáticamente, solo expone las funciones
  const { createMaterial } = useMateriales({ autoLoad: false });

  const handleSubmit = async (data) => {
    await createMaterial(data);
  };
}
```

### Recargar datos manualmente

```typescript
function MiComponente() {
  const { centros, loadCentros } = useCentros();

  const handleRefresh = () => {
    loadCentros(); // Recarga los datos
  };
}
```

## Buenas Prácticas

1. **Usar `autoLoad: false`** cuando solo necesites las funciones de mutación (create, update, delete)
2. **Manejar errores** siempre con try-catch en las operaciones de mutación
3. **No duplicar estado** - Si el hook ya proporciona el estado, úsalo directamente
4. **Recargar después de mutaciones** - Los hooks ya se encargan de recargar automáticamente

## Beneficios

✅ **Centralización**: Toda la lógica de datos en un solo lugar
✅ **Reutilización**: Los mismos hooks en múltiples componentes
✅ **Consistencia**: Mismo patrón para todas las entidades
✅ **Tipado**: TypeScript en toda la cadena
✅ **Testing**: Más fácil mockear servicios que queries directas
✅ **Mantenibilidad**: Cambios en un solo lugar afectan a toda la app
