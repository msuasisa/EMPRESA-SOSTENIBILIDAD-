# Hidrogenesis · Repte Som Professionals

Proyecto educativo sobre regeneración de aguas residuales para riego y otros usos no potables autorizados. El menú lleva a las secciones de la página de inicio y permite abrir la presentación.

## Abrir la web

Abre `index.html` o ejecuta `node preview.mjs` y visita http://127.0.0.1:4173. No hay dependencias ni compilación.

## Páginas y archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Inicio, resumen interactivo, editor y presentación |
| `project.js` | Datos compartidos y recuperación de respuestas guardadas |
| `app.js` | Interacciones del inicio y edición del proyecto |
| `matrix.js` | Filtros y tarjetas de riesgos compartidos |
| `styles.css` | Diseño adaptable de la página de inicio |
| `presentation.js`, `presentation.css` | Presentación panorámica y controles |
| `preview.mjs` | Servidor local |
| `respaldo-apartados/` | Copias TXT de los contenidos ampliados y sus fuentes originales; no se publican |

Las páginas ampliadas se conservan en `respaldo-apartados/proposito.txt`, `proceso.txt`, `ods-asg.txt` y `riesgos.txt`, con sus fuentes originales en `fuentes/`, para poder recuperarlas. La carpeta permanece fuera de `dist`, no tiene enlaces en la web y el servidor local no permite acceder a ella.

## Presentación

11 diapositivas con transiciones horizontales, índice, temporizador y guion orientativo para unos 15 minutos. Las cuatro preguntas del propósito se reúnen en la diapositiva 4, con respuestas breves en una cuadrícula y el texto completo en el guion. El lienzo 16:9 se escala a la ventana sin scroll. El navegador debe permitir la pantalla completa para activarla con el botón o la tecla F.

Los títulos de las diapositivas 6 y 7 desarrollan las siglas: ODS, Objetivos de Desarrollo Sostenible; ASG, Ambiental, Social y Gobernanza. No se repite la definición en las tarjetas.

- Flechas, Re Pág / Av Pág: navegar.
- Inicio / Fin: primera o última diapositiva.
- N: mostrar el guion, que será visible en la pantalla compartida.
- G: índice.
- F: pantalla completa.
- Escape: cerrar el índice o volver al inicio.

El enlace `index.html#presentacion/10` abre los indicadores. Las unidades y sus descripciones disponen de columnas independientes para evitar solapamientos. La evaluación académica se ha retirado del sitio y de las diapositivas.

## Edición y guardado

El editor del inicio permite modificar empresa, equipo, curso, las cuatro respuestas y la misión. El inicio y las diapositivas usan los mismos datos.

Los cambios se guardan en este navegador bajo `hidrogenesis-project-v3`. Si existe una versión anterior del proyecto del agua, se conservan sus respuestas y datos de equipo y se actualiza el nombre anterior. No se borran las claves antiguas. Si solo existe el primer ejemplo de mobiliario, se recuperan únicamente equipo y curso.

El guardado local no sincroniza dispositivos.

## Publicación

Alojar juntos `index.html`, `styles.css`, `project.js`, `matrix.js`, `app.js`, `presentation.css` y `presentation.js`. Mantener `respaldo-apartados/` fuera del directorio publicado. El alojamiento actual publica únicamente `dist`; los TXT se conservan en el repositorio, fuera de esa carpeta. Subir el código a GitHub no activa GitHub Pages automáticamente.

Las fuentes DM Sans y Manrope usan Google Fonts con alternativas del sistema. La ilustración SVG está incluida en el HTML. Se respeta la preferencia de movimiento reducido.

## Fuentes

- [Agenda 2030 · Naciones Unidas](https://sdgs.un.org/es/goals)
- [Reutilización de aguas tratadas · MITECO](https://www.miteco.gob.es/es/agua/temas/concesiones-y-autorizaciones/reutilizacion-aguas-depuradas.html)
- [Zinkers · Fundación Repsol](https://zinkers.fundacionrepsol.com)

Propuesta educativa independiente, sin instalaciones, contratos ni resultados operativos acreditados. No se propone agua para beber. La solución real depende del origen del agua, del destino y de las condiciones aplicables. El origen ganadero requiere un estudio específico.
