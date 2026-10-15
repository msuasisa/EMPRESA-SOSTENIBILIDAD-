# Hidrogenesis · Repte Som Professionals

Proyecto educativo sobre regeneración de aguas residuales para riego y otros usos no potables autorizados. Conserva la portada del proyecto y amplía cada apartado en una página propia, con explicaciones sencillas.

## Abrir la web

Abre `index.html` o ejecuta `node preview.mjs` y visita http://127.0.0.1:4173. No hay dependencias ni compilación.

## Páginas y archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Inicio, resumen interactivo, editor y presentación |
| `proposito.html` | Las cuatro preguntas, grupos de interés, misión y modelo de servicio |
| `proceso.html` | Tratamiento paso a paso, destinos, piloto y preguntas frecuentes |
| `ods-asg.html` | ODS prioritarios, criterios ASG y explorador de los 17 objetivos |
| `riesgos.html` | Matriz filtrable, respuesta ante incidencias y seguimiento |
| `project.js` | Datos compartidos y recuperación de respuestas guardadas |
| `app.js` | Interacciones del inicio, edición, descarga e impresión |
| `matrix.js` | Filtros y tarjetas de riesgos compartidos |
| `details.js` | Contenido dinámico y navegación de las páginas interiores |
| `styles.css`, `details.css` | Diseño del inicio y de las páginas interiores |
| `presentation.js`, `presentation.css` | Presentación panorámica y controles |
| `preview.mjs` | Servidor local |

## Presentación

14 diapositivas con transiciones horizontales, índice, temporizador y guion orientativo para unos 15 minutos. El lienzo 16:9 se escala a la ventana sin scroll. El navegador debe permitir la pantalla completa para activarla con el botón o la tecla F.

- Flechas, Re Pág / Av Pág: navegar.
- Inicio / Fin: primera o última diapositiva.
- N: mostrar el guion, que será visible en la pantalla compartida.
- G: índice.
- F: pantalla completa.
- Escape: cerrar el índice o volver al inicio.

El enlace `index.html#presentacion/13` abre los indicadores. Las unidades y sus descripciones disponen de columnas independientes para evitar solapamientos. La evaluación académica se ha retirado del sitio, las diapositivas y la descarga.

## Edición y guardado

El editor del inicio permite modificar empresa, equipo, curso, las cuatro respuestas y la misión. Las páginas interiores y las diapositivas usan los mismos datos.

Los cambios se guardan en este navegador bajo `hidrogenesis-project-v3`. Si existe una versión anterior del proyecto del agua, se conservan sus respuestas y datos de equipo y se actualiza el nombre anterior. No se borran las claves antiguas. Si solo existe el primer ejemplo de mobiliario, se recuperan únicamente equipo y curso.

La descarga Markdown incluye propósito, misión, proceso, ODS, ASG y matriz. La impresión del inicio despliega los contenidos completos. El guardado local no sincroniza dispositivos.

## Publicación

Alojar juntos todos los archivos HTML, CSS y JavaScript. Las rutas interiores son archivos HTML reales y se pueden abrir directamente o recargar. En GitHub Pages, seleccionar la rama y la raíz desde la configuración del repositorio; subir el código no activa el alojamiento automáticamente.

Las fuentes DM Sans y Manrope usan Google Fonts con alternativas del sistema. La ilustración SVG está incluida en el HTML. Se respeta la preferencia de movimiento reducido.

## Fuentes

- [Agenda 2030 · Naciones Unidas](https://sdgs.un.org/es/goals)
- [Reutilización de aguas tratadas · MITECO](https://www.miteco.gob.es/es/agua/temas/concesiones-y-autorizaciones/reutilizacion-aguas-depuradas.html)
- [Zinkers · Fundación Repsol](https://zinkers.fundacionrepsol.com)

Propuesta educativa independiente, sin instalaciones, contratos ni resultados operativos acreditados. No se propone agua para beber. La solución real depende del origen del agua, del destino y de las condiciones aplicables. El origen ganadero requiere un estudio específico.
