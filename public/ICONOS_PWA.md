# Iconos para PWA

## Iconos Requeridos

Para que la PWA funcione correctamente, necesitas crear los siguientes iconos:

### Archivos necesarios:
- `icon-192.png` - 192x192 píxeles
- `icon-512.png` - 512x512 píxeles
- `apple-touch-icon.png` - 180x180 píxeles (para iOS)
- `favicon.ico` - 32x32 píxeles

## Opciones para Generar los Iconos

### Opción 1: Usar un Generador Online (Recomendado)
1. Ve a https://realfavicongenerator.net/
2. Sube tu logo o diseño
3. Genera todos los iconos necesarios
4. Descarga y reemplaza los archivos en `/public`

### Opción 2: Usando el SVG Placeholder
He creado un `icon.svg` placeholder que puedes usar como base.

Para convertirlo a PNG, puedes usar:

**Con ImageMagick:**
```bash
# Instalar ImageMagick (macOS)
brew install imagemagick

# Generar iconos
magick icon.svg -resize 192x192 icon-192.png
magick icon.svg -resize 512x512 icon-512.png
magick icon.svg -resize 180x180 apple-touch-icon.png
magick icon.svg -resize 32x32 favicon.ico
```

**Online:**
- https://cloudconvert.com/svg-to-png
- https://www.aconvert.com/image/svg-to-png/

### Opción 3: Diseñar tu Propio Logo
1. Crea tu logo en Figma, Illustrator o cualquier herramienta de diseño
2. Exporta en los tamaños requeridos
3. Asegúrate de usar fondo transparente o el color de tema (`#000000`)

## Verificar que Funciona

Después de añadir los iconos:
1. Reinicia el servidor de desarrollo
2. Abre Chrome DevTools > Application > Manifest
3. Verifica que todos los iconos se cargan correctamente
4. Prueba instalar la PWA desde el navegador
