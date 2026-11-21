# Hub de eventos tech de Puebla — Diseño (demo Build Day)

Fecha: 2026-11-20 · Tiempo de construcción: ~18:55 a 21:00 (≈2 h)

## Intención y por qué

Hoy, quien se interesa por la tecnología en Puebla se entera de meetups,
talleres y hackathons estando en muchos grupos de WhatsApp. El hub reúne
todos esos eventos en un solo lugar, moderado por el autor, para que nadie
necesite estar en "mil grupos" para enterarse.

Lo que se entrega hoy es una **demo navegable** para mostrar la idea, no un
producto en producción. Debe sentirse real y verse como una sola marca en
el sitio y en el material para redes.

## Metas

- Ver los próximos eventos tech de Puebla en un solo lugar.
- Que los organizadores y comunidades puedan **proponer** eventos.
- Que el autor, como **moderador**, apruebe o rechace lo propuesto.
- Que la gente se **suscriba por correo** a las comunidades que le
  interesan y reciba avisos de eventos nuevos, junto con una invitación a
  volver al hub.
- Crecimiento por promoción en persona y por redes sociales propias del
  hub: cada evento genera material listo para compartir.
- Un **sistema de diseño / media kit** uniforme entre el sitio y las redes.

## No-metas (hoy)

- Cuentas de usuario reales, login de organizadores.
- Base de datos compartida entre dispositivos (posible siguiente paso: Supabase).
- Envío real de correos (solo vista previa; envío real si sobra tiempo).
- Publicación automática en Instagram, Facebook o X.

## Anti-metas

- Que parezca un grupo de WhatsApp más: ruido, eventos que no son tech o
  spam publicado sin revisión.
- Que el sitio y el material de redes se vean como cosas distintas.
- Una demo que se rompa a la mitad de la presentación por intentar abarcar
  demasiado.

## Restricciones

- ≈2 horas de construcción, incluyendo la publicación.
- Demo en un solo dispositivo: los datos nuevos viven en el navegador.
- Idioma: español. Público: gente de Puebla interesada en tecnología.

## Enfoques considerados

| Enfoque | A favor | En contra |
|---|---|---|
| **A. Next.js + datos de ejemplo + navegador** (elegido) | Rápido; Next.js genera imágenes PNG del media kit con el mismo diseño del sitio; se publica en Vercel en minutos | Lo propuesto en un dispositivo no se ve en otro |
| B. Next.js + Supabase | Datos compartidos; aprobar en vivo desde otro dispositivo | 30–45 min de configuración y riesgo de no terminar |
| C. HTML/CSS sin framework | Arranque inmediato | Media kit y uniformidad a mano; menos pulido |

El autor eligió **A**. B queda como evolución si sobra tiempo o después
del evento, sin rehacer lo demás.

## Lo que el autor decidió

- El autor modera personalmente; los organizadores proponen.
- Los avisos llegan por correo, según las comunidades que la persona sigue,
  e invitan a visitar el hub.
- El hub tendrá redes propias donde se comparten los eventos.
- Entregables de hoy: la plataforma web + sistema de diseño/media kit, con
  uniformidad en todo.
- Enfoque A.

## Diseño

### Datos
- **Comunidad:** id/slug, nombre, descripción, temas, logo o inicial, links.
- **Evento:** id/slug, título, descripción, comunidad, fecha/hora de inicio
  y fin, lugar (o en línea), link de registro, temas, estado
  (`pendiente` | `aprobado` | `rechazado`), quién lo propuso.
- **Suscripción:** email, comunidades seguidas o "todos los eventos".
- Datos de ejemplo en un archivo del proyecto: ~6 comunidades y ~10–12
  eventos en Puebla, **ficticios pero creíbles** (indicado en el sitio
  como datos de demostración). Lo nuevo y los cambios de estado se guardan
  en `localStorage` y se combinan con los datos de ejemplo.

### Pantallas
1. **Inicio:** propuesta de valor en una línea, próximos eventos aprobados
   en orden cronológico, filtro por comunidad (y por fecha si alcanza),
   llamada a suscribirse.
2. **Evento:** toda la información, botón "Agregar a calendario" (.ics),
   copiar link, descargar post y story para redes.
3. **Comunidad:** descripción, sus eventos, botón "Seguir" (lleva a la
   suscripción con la comunidad preseleccionada).
4. **Proponer evento:** formulario; al enviar queda `pendiente` y se
   muestra confirmación.
5. **Moderación:** protegida con contraseña simple (demo); lista de
   pendientes con aprobar/rechazar. Al aprobar, el evento aparece en el
   inicio y se ofrece la vista previa del correo que recibirían los
   suscriptores de esa comunidad.
6. **Suscripción:** email + selección de comunidades o "todos"; al
   confirmar, muestra la vista previa del correo de bienvenida.
7. **Vista previa de correo:** el correo de aviso de evento nuevo,
   renderizado como se vería, con la invitación a visitar el hub.
8. **Media kit:** página con logo, colores, tipografía, tono de voz y
   ejemplos de las plantillas de redes.

### Media kit / sistema de diseño
- Tokens únicos (colores, tipografía, radios, espaciado) usados por el
  sitio, el correo y las imágenes, para mantener la uniformidad.
- Imágenes generadas con `next/og` a partir de cada evento:
  **post** 1080×1080 y **story** 1080×1920, descargables como PNG.

### Orden de construcción y recortes
Orden: datos y diseño → inicio y evento → proponer + moderación →
suscripción + vista previa de correo → media kit → publicar en Vercel.
Si el tiempo no alcanza, se recorta en este orden: envío real de correo →
filtro por fecha → página de comunidad (se queda como filtro en el inicio).
El media kit es lo último que se recorta.

## Decisiones del asistente (corregibles)

- **Nombre e identidad** (el autor pidió un nombre "muy cotorro" sin la
  palabra "hub" y dejó la identidad a criterio del asistente):
  **Cemita** — como la cemita poblana, "trae de todo adentro": todos los
  eventos tech de Puebla en un solo pan. Tono: cercano, poblano, con humor,
  sin perder claridad. Visual inspirado en la **Talavera**: azul cobalto,
  amarillo y blanco, con patrones de azulejo como recurso gráfico; tipografía
  display con carácter (Bricolage Grotesque) + texto legible (Inter).
- Lo propuesto por organizadores siempre pasa por moderación.
- Opción "todos los eventos" para quien aún no sigue comunidades.
- Next.js (App Router) + TypeScript + Tailwind; diseño mobile-first.
- Contraseña de moderador fija para la demo.
- Comunidades de ejemplo con **nombres inventados**, para no atribuir
  eventos falsos a grupos reales de Puebla frente al público.

## Publicación

Link público en Vercel (`*.vercel.app`, sin dominio propio), desde la
cuenta del autor. El autor inicia sesión en la CLI de Vercel al inicio de
la construcción, no al final.

## Queda al criterio de quien construye

Estructura de carpetas, componentes, textos de ejemplo, detalles visuales
dentro del sistema de diseño y el formato exacto del archivo .ics.
