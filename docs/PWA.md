# Progressive Web App (PWA) - Collector Manager

## ✅ Configuración Completada

La aplicación está completamente configurada como una Progressive Web App (PWA) y lista para instalarse en dispositivos móviles y de escritorio.

## 📱 Características Implementadas

### 1. Manifest Web App
- **Archivo**: `public/manifest.json`
- **Configuración**:
  - Nombre de la app: "Collector Manager"
  - Modo de visualización: Standalone (pantalla completa)
  - Colores de tema: Blanco (light) / Negro (dark)
  - Orientación: Portrait primary
  - Atajos rápidos a Dashboard y Clientes

### 2. Iconos
- **192x192**: Para pantallas normales
- **512x512**: Para pantallas de alta resolución
- **180x180**: Apple touch icon (iOS)
- **32x32 y 16x16**: Favicons

**Ubicación**: `public/icon-*.png`

### 3. Service Worker
- **Archivo**: `public/sw.js`
- **Estrategia**: Network First, fallback to Cache
- **Funcionalidades**:
  - Cache de recursos estáticos
  - Funcionamiento offline básico
  - Actualización automática cada hora
  - Limpieza de caches antiguos

### 4. Instalación
- **Componente**: `components/PWAInstaller.tsx`
- Muestra un prompt personalizado para instalar la app
- Se oculta automáticamente si la app ya está instalada
- Permite postponer la instalación

## 🚀 Cómo Instalar la PWA

### En Chrome/Edge (Escritorio)
1. Abre la aplicación en el navegador
2. Haz click en el icono de instalar (➕) en la barra de direcciones
3. O ve a Menu > Instalar Collector Manager
4. La app se abrirá en una ventana independiente

### En Chrome (Android)
1. Abre la aplicación en Chrome
2. Toca el menú (⋮) > "Agregar a pantalla de inicio"
3. O aparecerá un banner automático de instalación
4. La app se agregará al launcher de Android

### En Safari (iOS)
1. Abre la aplicación en Safari
2. Toca el botón de compartir (⬆️)
3. Selecciona "Agregar a pantalla de inicio"
4. La app aparecerá en tu pantalla de inicio

## 🔧 Personalización de Iconos

Los iconos actuales son placeholders. Para personalizarlos:

### Opción 1: Usar un generador online
```bash
# Visita https://realfavicongenerator.net/
# Sube tu logo y genera todos los tamaños necesarios
```

### Opción 2: Crear tu propio SVG
1. Edita `public/icon.svg` con tu diseño
2. Ejecuta el script para regenerar los PNGs:
```bash
node scripts/generate-icons.js
```

### Opción 3: Reemplazar manualmente
Reemplaza estos archivos en `public/`:
- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png`
- `favicon-16x16.png`
- `favicon-32x32.png`

## 📊 Verificar la Instalación

### Chrome DevTools
1. Abre DevTools (F12)
2. Ve a la pestaña "Application"
3. Verifica:
   - **Manifest**: Todos los campos correctos
   - **Service Workers**: Debe estar "activated and running"
   - **Cache Storage**: Debe mostrar el cache de la app

### Lighthouse
1. Abre DevTools (F12)
2. Ve a la pestaña "Lighthouse"
3. Selecciona "Progressive Web App"
4. Click en "Generate report"
5. Debe pasar todos los checks principales de PWA

## 🎯 Funcionalidades PWA

### ✅ Actualmente Implementadas
- ✅ Instalable en todos los dispositivos
- ✅ Funciona offline (básico)
- ✅ Cache de recursos estáticos
- ✅ Icono personalizado
- ✅ Pantalla completa (standalone)
- ✅ Soporte para temas claro/oscuro
- ✅ Atajos de aplicación
- ✅ Actualización automática del service worker

### 🔮 Posibles Mejoras Futuras
- ⚪ Sincronización en background
- ⚪ Notificaciones push
- ⚪ Modo offline completo con IndexedDB
- ⚪ Compartir contenido nativo
- ⚪ Integración con sistema de archivos
- ⚪ Badge de notificaciones en icono

## 🛠️ Mantenimiento

### Actualizar la versión del cache
Cuando hagas cambios significativos, actualiza la versión en `public/sw.js`:

```javascript
const CACHE_NAME = 'collector-manager-v2'; // Incrementar versión
```

Esto forzará a los usuarios a actualizar el cache.

### Añadir nuevas rutas al cache estático
En `public/sw.js`, añade las rutas importantes:

```javascript
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/dashboard/clientes',
  '/dashboard/nueva-ruta', // ← Añadir aquí
];
```

## 📱 Testing

### Probar en dispositivos reales
1. **Desktop**: Usa Chrome o Edge
2. **Android**: Usa Chrome
3. **iOS**: Usa Safari (las PWA tienen limitaciones en iOS)

### Probar modo offline
1. Instala la PWA
2. Abre Chrome DevTools > Network
3. Marca "Offline"
4. Recarga la página
5. La app debe seguir funcionando (aunque con limitaciones)

## 🐛 Troubleshooting

### La app no se puede instalar
- Verifica que estás usando HTTPS (o localhost)
- Revisa que el manifest.json sea válido
- Comprueba que los iconos existen y son accesibles

### El service worker no se registra
- Abre la consola y busca errores
- Verifica que `sw.js` esté en `public/`
- Limpia el cache del navegador

### Los cambios no se ven
- El service worker cachea agresivamente
- En desarrollo, usa "Update on reload" en DevTools > Application > Service Workers
- O incrementa la versión del cache

## 🔒 Seguridad

- El service worker solo funciona en HTTPS (excepto localhost)
- No cachea datos sensibles de Supabase
- Ignora solicitudes a dominios externos
- Solo cachea solicitudes GET

## 📚 Recursos Adicionales

- [Web.dev - PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN - Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Next.js PWA Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
