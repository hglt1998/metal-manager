# Arquitectura del Módulo de Clientes

Este documento describe la arquitectura y organización del código del módulo de clientes.

## Estructura de Archivos

```
├── lib/
│   ├── constants/
│   │   └── clientes.constants.ts    # Constantes compartidas (tipos, labels)
│   ├── services/
│   │   └── clientes.service.ts      # Servicio para operaciones de base de datos
│   └── utils/
│       └── clientes.utils.ts        # Funciones utilitarias reutilizables
├── hooks/
│   ├── useClientes.ts               # Hook para lista de clientes
│   └── useCliente.ts                # Hook para cliente individual
└── components/
    └── clientes/
        ├── ClientesSection.tsx      # Tabla de clientes
        ├── ClienteFormDialog.tsx    # Formulario de creación
        ├── ClienteEditDialog.tsx    # Formulario de edición
        └── TipoClienteSelect.tsx    # Selector multi-tipo

```

## Capas de Abstracción

### 1. Constantes (`lib/constants/clientes.constants.ts`)

Define las constantes compartidas en toda la aplicación:

- `TIPOS_CLIENTE_LABELS`: Record con los labels de cada tipo de cliente
- `TIPOS_CLIENTE_OPTIONS`: Array con opciones para selectores

**Uso:**
```typescript
import { TIPOS_CLIENTE_LABELS, TIPOS_CLIENTE_OPTIONS } from "@/lib/constants/clientes.constants";

// Obtener label
const label = TIPOS_CLIENTE_LABELS["remitente"]; // "Remitente"

// Usar en select
TIPOS_CLIENTE_OPTIONS.map(option => <option value={option.value}>{option.label}</option>)
```

### 2. Utilidades (`lib/utils/clientes.utils.ts`)

Funciones reutilizables para lógica de negocio común:

- `getTipoClienteLabel(tipo)`: Obtiene el label de un tipo
- `getTiposClienteLabels(tipos)`: Obtiene labels de múltiples tipos
- `formatTiposCliente(tipos)`: Formatea para mostrar (ej: "3 tipos")
- `isClienteActivo(activo)`: Verifica si está activo
- `getClienteStatusClass(activo)`: Clase CSS del estado
- `getClienteStatusText(activo)`: Texto del estado ("Activo"/"Inactivo")
- `formatContactoCliente(persona, email, telefono)`: Formatea información de contacto
- `hasContactInfo(email, telefono)`: Verifica si tiene info de contacto

**Uso:**
```typescript
import { getClienteStatusClass, formatTiposCliente } from "@/lib/utils/clientes.utils";

// En JSX
<div className={getClienteStatusClass(cliente.activo)} />
<span>{formatTiposCliente(cliente.tipo_cliente)}</span>
```

### 3. Servicio (`lib/services/clientes.service.ts`)

Encapsula todas las operaciones de base de datos:

```typescript
class ClientesService {
  // Obtener todos los clientes con sus centros
  async getAllClientes(): Promise<ClienteWithCentros[]>

  // Obtener un cliente por ID
  async getClienteById(clienteId: string): Promise<ClienteWithCentros>

  // Crear cliente con centros asociados
  async createCliente(cliente: ClienteInsert, centroIds: string[]): Promise<ClienteWithCentros>

  // Actualizar cliente y sus centros
  async updateCliente(clienteId: string, updates: ClienteUpdate, centroIds?: string[]): Promise<ClienteWithCentros>

  // Eliminar cliente
  async deleteCliente(clienteId: string): Promise<void>

  // Obtener centros de un cliente
  async getCentrosByClienteId(clienteId: string): Promise<Centro[]>
}
```

**Uso:**
```typescript
import { createClientesService } from "@/lib/services/clientes.service";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const service = createClientesService(supabase);
const clientes = await service.getAllClientes();
```

### 4. Hooks

#### `useClientes` - Lista de clientes

Hook para manejar la lista completa de clientes:

```typescript
const {
  clientes,           // ClienteWithCentros[]
  loading,            // boolean
  error,              // Error | null
  loadClientes,       // () => Promise<void>
  createCliente,      // (cliente, centroIds) => Promise<ClienteWithCentros>
  updateCliente,      // (id, updates, centroIds) => Promise<ClienteWithCentros>
  deleteCliente,      // (id) => Promise<void>
} = useClientes({ autoLoad: true });
```

#### `useCliente` - Cliente individual

Hook para manejar un cliente específico (útil para páginas de detalle):

```typescript
const {
  cliente,            // ClienteWithCentros | null
  loading,            // boolean
  error,              // Error | null
  loadCliente,        // () => Promise<void>
  updateCliente,      // (updates, centroIds) => Promise<ClienteWithCentros>
  deleteCliente,      // () => Promise<void>
  refreshCliente,     // () => Promise<void> (alias de loadCliente)
} = useCliente({ clienteId: "xxx", autoLoad: true });
```

### 5. Componentes

Todos los componentes utilizan las capas anteriores:

- **ClientesSection**: Usa `useClientes` del parent, constantes y utils
- **ClienteFormDialog**: Usa el service para crear
- **ClienteEditDialog**: Usa el service para actualizar
- **TipoClienteSelect**: Usa constantes para opciones
- **[id]/page.tsx**: Usa `useCliente` para el detalle

## Flujo de Datos

```
┌─────────────────┐
│   Components    │
│   (UI Layer)    │
└────────┬────────┘
         │ usa
         ↓
┌─────────────────┐
│     Hooks       │
│ (State Layer)   │
└────────┬────────┘
         │ usa
         ↓
┌─────────────────┐
│    Services     │
│  (Data Layer)   │
└────────┬────────┘
         │ usa
         ↓
┌─────────────────┐
│   Supabase      │
│  (Database)     │
└─────────────────┘

┌─────────────────┐
│  Constants &    │
│   Utilities     │
│ (Shared Logic)  │
└─────────────────┘
      ↑
      │ usado por todos
```

## Principios de Diseño

1. **Separación de responsabilidades**: Cada capa tiene una responsabilidad clara
2. **Reutilización de código**: Constantes y utilidades son compartidas
3. **Tipado fuerte**: Todo está tipado con TypeScript
4. **Hooks especializados**: `useClientes` para listas, `useCliente` para detalle
5. **Consistencia**: Todos los componentes usan las mismas utilidades

## Ventajas de esta Arquitectura

✅ **Mantenibilidad**: Cambios en un lugar se propagan a toda la app
✅ **Testeable**: Cada capa puede ser testeada independientemente
✅ **Escalable**: Fácil añadir nuevas funcionalidades
✅ **DRY**: No hay código duplicado
✅ **Type-safe**: TypeScript previene errores en tiempo de compilación

## Cómo Extender

### Añadir un nuevo tipo de cliente:

1. Actualizar `TipoCliente` en `types/database.ts`
2. Añadir entrada en `TIPOS_CLIENTE_LABELS` (constants)
3. ¡Listo! Se propaga automáticamente

### Añadir nueva utilidad:

1. Crear función en `clientes.utils.ts`
2. Exportarla
3. Usar en componentes

### Añadir operación de base de datos:

1. Añadir método en `ClientesService`
2. Opcionalmente, añadir al hook correspondiente
3. Usar en componentes
