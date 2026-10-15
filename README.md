# Repte Som Professionals · Som Sostenibles

Web interactiva del proyecto educativo Zinkers FP · Som Sostenibles, con la propuesta de empresa **Hidrogota**: regeneración de aguas residuales, principalmente urbanas, para riego y otros usos no potables autorizados.

## Abrir la web

Abre `index.html` en un navegador o utiliza el servidor local con Node.js:

```sh
node preview.mjs
```

Visita http://127.0.0.1:4173. No se necesitan instalaciones adicionales ni compilación.

## Archivos

| Archivo | Contenido |
| --- | --- |
| `index.html` | Estructura y secciones de la web |
| `styles.css` | Diseño adaptable y animaciones |
| `app.js` | Datos, edición, ODS, filtros, rúbrica y descarga |
| `presentation.css` | Diseño de las diapositivas y los controles de exposición |
| `presentation.js` | Modo presentación, navegación, guion, índice y temporizador |
| `preview.mjs` | Servidor de vista previa local |

## Funcionalidades

- Identidad visual de Hidrogota en azul agua y verde menta, con ilustración SVG de una gota.
- Proceso simplificado de separación, tratamiento, regeneración y control; clientes municipales y fase agrícola por validar.
- Cuatro preguntas sobre el propósito empresarial, organizadas en pestañas accesibles.
- Síntesis del propósito y la misión de la empresa.
- Los 17 ODS seleccionables y cuatro objetivos prioritarios justificados (6, 12, 11 y 2), con el ODS 9 como conexión complementaria.
- Módulos ambientales, sociales y de gobernanza con acciones e indicadores.
- Matriz de ocho riesgos y oportunidades con filtros combinados por ASG y ODS.
- Autoevaluación basada en los cinco criterios visibles de la rúbrica facilitada: máximo conjunto de 8,5 puntos.
- Editor del nombre de empresa, equipo, curso, respuestas y síntesis.
- Guardado en el navegador mediante `localStorage`, sin sincronización entre dispositivos.
- Descarga de un dossier Markdown e impresión del proyecto completo.
- Adaptación a móvil y escritorio, navegación por teclado y respeto de la preferencia de movimiento reducido.
- Presentación de 15 diapositivas con pantalla completa, índice, temporizador y guion para una exposición de unos 15 minutos.

## Exponer el proyecto

Pulsa **Presentar proyecto** en la portada o **Presentar** en el menú. Se solicita pantalla completa si el navegador lo permite. El lienzo panorámico 16:9 se escala automáticamente para aprovechar la ventana sin recortar el contenido. Las diapositivas se desplazan horizontalmente y sus elementos entran de forma escalonada. Los controles se ocultan tras unos segundos y reaparecen al mover el puntero o usar el teclado.

Las respuestas guardadas en el editor se incorporan al abrir la presentación. Las diapositivas muestran extractos legibles y el guion conserva el texto completo.

| Control | Acción |
| --- | --- |
| Flechas izquierda y derecha | Diapositiva anterior o siguiente |
| Re Pág / Av Pág | Diapositiva anterior o siguiente |
| Espacio | Siguiente cuando el foco está en la diapositiva |
| Inicio / Fin | Primera o última diapositiva |
| N | Mostrar u ocultar el guion de apoyo |
| G | Abrir o cerrar el índice |
| F | Activar o salir de pantalla completa, si el navegador lo permite |
| Escape | Cerrar el índice o volver a la web |

El guion es visible para quienes ven la pantalla cuando se despliega. El temporizador comienza al abrir la presentación y no cambia las diapositivas automáticamente. Se puede enlazar a una diapositiva con `#presentacion/7`, por ejemplo. En móvil se puede navegar con los botones o con un gesto horizontal sobre la diapositiva; la vista horizontal permite aprovechar mejor el lienzo. El contenido de las diapositivas se adapta por escala, sin scroll vertical. La preferencia de movimiento reducido desactiva las animaciones.

## Adaptar el caso

El botón **Editar proyecto** permite cambiar las respuestas y los datos del equipo. Para adaptar el análisis a otra actividad, modifica también las estructuras `priority`, `secondary`, `asg` y `matrix` de `app.js`, y los textos de presentación de `index.html`.

Las respuestas de Hidrogota se guardan en `hidrogota-project-v2` y prevalecen sobre `defaults`. Al abrir la nueva versión por primera vez se recuperan el equipo y el curso del ejemplo anterior, si existían. Los textos, la misión y la puntuación empiezan con el nuevo proyecto; el almacenamiento antiguo permanece intacto en `som-sostenibles-project-v1` para no borrar las ediciones previas.

La rúbrica de la imagen repite los descriptores de ODS en la fila ASG. Se conservan sus niveles y puntuaciones, con una nota aclaratoria. La comprobación de riesgos es complementaria y no añade puntos. La autoevaluación no sustituye la valoración del profesorado.

## Publicación estática

Los archivos están en la raíz y pueden alojarse en un servidor estático. Si se utiliza GitHub Pages, se puede seleccionar la rama `main` y la carpeta raíz desde la configuración del repositorio. La subida del código no activa ese servicio automáticamente.

Las tipografías DM Sans y Manrope se cargan desde Google Fonts; se emplean fuentes del sistema si no están disponibles. La ilustración SVG está incluida en el HTML. Los símbolos de los ODS son una interpretación gráfica propia.

## Referencias

- [Agenda 2030 · Naciones Unidas](https://sdgs.un.org/es/goals)
- [Zinkers · Fundación Repsol](https://zinkers.fundacionrepsol.com)
- [Reutilización de aguas tratadas · MITECO](https://www.miteco.gob.es/es/agua/temas/concesiones-y-autorizaciones/reutilizacion-aguas-depuradas.html)
- Rúbrica parcial: imagen facilitada para el proyecto.

Proyecto educativo independiente basado en la idea facilitada por el equipo. Hidrogota, su piloto, sus acuerdos, instalaciones e indicadores se presentan como propuestas, sin resultados operativos acreditados. No se propone agua para beber. El origen ganadero requiere una evaluación específica y no se equipara automáticamente al urbano.
