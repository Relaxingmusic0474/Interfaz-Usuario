Proyecto: mi_pagina_web

Instrucciones para abrir localmente (sin servidor)
- Abre el archivo `index.html` con tu navegador (doble clic o "Abrir archivo"). Esto funciona en la mayoría de navegadores y dispositivos.
- Nota: algunos navegadores basados en Chromium (Chrome, Edge) pueden bloquear recursos embebidos de forma diferente cuando se usan técnicas específicas. Este proyecto fue adaptado para funcionar con file:// en la medida de lo posible: el menú ahora usa enlaces directos y no iframe.

Instrucciones (recomendadas) — modo servidor (evita problemas y es recomendado para desarrollo)
- Desde la carpeta del proyecto, ejecuta:

```bash
python3 -m http.server 8000
```

- Abre en el navegador: http://localhost:8000/index.html
- El servidor evita problemas de políticas locales y facilita pruebas con móviles y tablets en la misma red.

Cambios aplicados
- Se reemplazaron los formularios del menú por enlaces directos en `index.html`.
- Se eliminó el iframe de `index.html` y se quitó `target="panel"` en las páginas internas para que funcionen con file://.
- Se corrigieron cierres incorrectos de `</img>` en `experiencias.html` y se limpiaron atributos inválidos en `<video>`.
- Se sustituyó la imagen fondo en SVG por un contenedor con `background-image` para evitar bloqueo de recursos embebidos en navegadores Chromium cuando se abre vía file://.

Siguientes pasos recomendados (opcionales)
- Validar HTML con el validador W3C.
- Optimizar imágenes y videos para dispositivos móviles.
- Si quieres, puedo revertir partes o migrar estilos sin usar CSS externo (por ejemplo, atributos inline), siguiendo la consigna del profesor.

Contacto
- Si algo no funciona en tu tablet o teléfono, copia aquí el mensaje de la consola del navegador (F12 → Consola) y lo reviso.
