# Repte Som Professionals · Som Sostenibles

Web interactiva del proyecto educativo Zinkers FP · Som Sostenibles, con un caso ilustrativo editable: **ReVerda**, un taller ficticio de recuperación y reparación de mobiliario.

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
| `preview.mjs` | Servidor de vista previa local |

## Funcionalidades

- Cuatro preguntas sobre el propósito empresarial, organizadas en pestañas accesibles.
- Síntesis del propósito y la misión de la empresa.
- Los 17 ODS seleccionables y cuatro objetivos prioritarios justificados para el caso.
- Módulos ambientales, sociales y de gobernanza con acciones e indicadores.
- Matriz de ocho riesgos y oportunidades con filtros combinados por ASG y ODS.
- Autoevaluación basada en los cinco criterios visibles de la rúbrica facilitada: máximo conjunto de 8,5 puntos.
- Editor del nombre de empresa, equipo, curso, respuestas y síntesis.
- Guardado en el navegador mediante `localStorage`, sin sincronización entre dispositivos.
- Descarga de un dossier Markdown e impresión del proyecto completo.
- Adaptación a móvil y escritorio, navegación por teclado y respeto de la preferencia de movimiento reducido.

## Adaptar el caso

El botón **Editar proyecto** permite cambiar las respuestas y los datos del equipo. Para adaptar el análisis a otra actividad, modifica también las estructuras `priority`, `secondary`, `asg` y `matrix` de `app.js`, y los textos de presentación de `index.html`.

Las respuestas guardadas en el navegador prevalecen sobre los valores iniciales de `defaults`. Para revisar nuevos valores iniciales, utiliza un perfil limpio o elimina únicamente la clave `som-sostenibles-project-v1` del almacenamiento local de esta web.

La rúbrica de la imagen repite los descriptores de ODS en la fila ASG. Se conservan sus niveles y puntuaciones, con una nota aclaratoria. La comprobación de riesgos es complementaria y no añade puntos. La autoevaluación no sustituye la valoración del profesorado.

## Publicación estática

Los archivos están en la raíz y pueden alojarse en un servidor estático. Si se utiliza GitHub Pages, se puede seleccionar la rama `main` y la carpeta raíz desde la configuración del repositorio. La subida del código no activa ese servicio automáticamente.

Las tipografías DM Sans y Manrope se cargan desde Google Fonts; se emplean fuentes del sistema si no están disponibles. La ilustración SVG está incluida en el HTML. Los símbolos de los ODS son una interpretación gráfica propia.

## Referencias

- [Agenda 2030 · Naciones Unidas](https://sdgs.un.org/es/goals)
- [Zinkers · Fundación Repsol](https://zinkers.fundacionrepsol.com)
- Rúbrica parcial: imagen facilitada para el proyecto.

Proyecto educativo independiente. ReVerda, sus compromisos y sus indicadores son ejemplos propuestos, sin resultados reales verificados.
