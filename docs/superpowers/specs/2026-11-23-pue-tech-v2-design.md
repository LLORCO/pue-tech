# PUE/Tech — v2 (de demo a producto real) — Diseño

Fecha: 2026-11-23 · Parte de: `2026-11-20-hub-eventos-tech-design.md` (MVP "Cemita")

## Intención y por qué

La idea del MVP funcionó: un solo lugar para los eventos y comunidades tech
de Puebla, para que nadie tenga que estar en "mil grupos" de WhatsApp para
enterarse. El autor quiere convertir esa demo en un producto real y, a la
vez, en una **pieza de portafolio** que muestre perfil de **desarrollador
frontend con bases sólidas de backend**.

Debe sentirse como una **experiencia de primer nivel** que sucede en Puebla:
universal y cuidada, no "poblano forzado". El autor cura todo personalmente.

## Qué cambia respecto al MVP

| MVP (Cemita) | v2 (PUE/Tech) |
|---|---|
| Nombre Cemita, identidad talavera (cobalto/amarillo) | Nombre **PUE Tech**, identidad nueva (abajo) |
| Datos ficticios + `localStorage` por navegador | **Postgres** compartido; datos reales cargados por el autor |
| Cualquiera propone, el autor aprueba y se publica | El formulario público envía **solicitudes**; el autor decide y da de alta el evento él mismo |
| Moderación con contraseña fija | **Panel privado** con login real |
| Correos solo como vista previa | **Envío real** de correos (cuando haya dominio) |
| — | **Calendario semanal y mensual**, regenerables |
| — | **Calendario suscribible** (Google Calendar / iPhone) |
| — | **API REST pública documentada** |

## Metas

- Ver los próximos eventos tech de Puebla, curados, en un sitio que se sienta de primer nivel.
- El autor publica y edita eventos y comunidades desde su panel.
- Organizadores proponen eventos; el autor revisa las solicitudes.
- La gente se suscribe a comunidades (o a todo) y recibe correos reales.
- Calendario semanal (correo + imagen para redes) y mensual (imagen + página), que se regeneran y republican cuando algo cambia.
- Calendario suscribible que se actualiza solo en el calendario de la persona.
- El repositorio demuestra habilidades de backend: esquema SQL y migraciones, API REST documentada, autenticación, tareas programadas, tests y CI.

## No-metas (por ahora)

- Carga automática de eventos desde Meetup, Luma, Eventbrite, etc.
- Publicación automática en Instagram, Facebook o X (el autor descarga las imágenes y publica a mano).
- Cuentas para organizadores o para el público (solo existe la cuenta del autor).
- Otras ciudades.
- App móvil.

## Anti-metas

- Parecer un directorio frío (dev.events, Eventbrite) o un grupo de WhatsApp más: ruido, eventos no tech o spam.
- Que lo propuesto aparezca publicado sin que el autor lo revise.
- Que el sitio, los correos y las redes se vean como marcas distintas.
- Parecerse a la marca **Workbliss** (por eso no se usa naranja).
- Mandar correos que la gente no pidió o de los que no se puede salir.
- Arquitectura de más para un proyecto de una persona (no microservicios).

## Restricciones

- Una sola persona construye y opera.
- Idioma: español. Público: gente de Puebla interesada en tecnología.
- Zona horaria: `America/Mexico_City` (sin horario de verano desde 2022).
- Sigue en Vercel; el proyecto ya está vinculado (`cemita`, se puede renombrar).
- **Dominio:** por ahora se usa el de Vercel (`*.vercel.app`); `puetech.mx` se compra después. El envío de correos a suscriptores requiere un dominio propio verificado en Resend, y los feeds `.ics` suscribibles no se publican hasta tenerlo, porque sus URLs quedan fijas en el calendario de la gente (fase 5). Todas las URLs absolutas salen de una sola variable de entorno.

## Marca e identidad (decidido por el autor en mockups)

- **Nombre:** PUE Tech. **Logo:** `PUE/Tech` en **Space Grotesk** (bold), la diagonal en vino.
  Se revisó: no hay comunidad ni evento con ese nombre en Puebla; "Nodo Puebla" se descartó porque el Ayuntamiento tiene ocho "Nodos Culturales" y `nodopuebla.com` es de un medio local. "Tech Capital" es un evento estatal: evitar nombres con "Capital".
- **Sitio — estilo minimal:** fondo casi blanco, tipografía **Geist**, mucho espacio, vino solo en detalles (fechas, botones, logo). Referencia de sensación: Luma.
- **Redes — estilo nocturno:** fondos bosque profundo y cacao, Space Grotesk en titulares, vino como acento.
- **Paleta:**

| Token | Hex | Uso |
|---|---|---|
| Blanco | `#FAFAF7` | Fondo del sitio |
| Arena | `#E6E1D8` | Bordes, separadores |
| Verde | `#234D3A` | Color principal de marca |
| Bosque profundo | `#14201A` | Fondo de redes |
| Marrón | `#6B4A35` | Texto secundario |
| Cacao | `#3B2418` | Fondo alterno de redes |
| Vino | `#8E2C3B` | Acento (botones, fechas, logo) |
| Vino claro | `#E8A4AE` | Acento sobre fondos oscuros |

- Desaparecen: talavera, cobalto/amarillo, Bricolage Grotesque, el tono "cotorro".
- Los tokens viven en un solo lugar y los usan sitio, correo e imágenes.

## Enfoques considerados

| Enfoque | A favor | En contra |
|---|---|---|
| **A. Next.js full-stack con backend visible** (elegido) | Una app, un despliegue; reutiliza lo del MVP; muestra SQL, API, auth, cron y tests | Alguien podría leerlo como "solo Next.js"; se compensa con la API documentada y el esquema propio |
| B. Next.js + API aparte (Hono/NestJS) en monorepo | Separación front/back muy evidente | ~doble de trabajo y dos despliegues; arquitectura de más para una persona |
| C. Next.js + Supabase | Lo más rápido | Supabase resuelve el backend por ti; poco valor de portafolio |

El autor eligió **A**: las mismas habilidades de backend que B en la mitad de tiempo; la API documentada permite separarla después si crece.

## Stack (elección del asistente dentro del enfoque A, corregible)

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind 4**, como hoy. Leer `node_modules/next/dist/docs/` antes de escribir código (ver `AGENTS.md`).
- **Postgres en Neon** (Vercel Marketplace) + **Drizzle ORM** con migraciones versionadas en el repo.
- **Better Auth** con sesiones en la propia base de datos. Se eligió sobre Clerk porque muestra que se entiende la autenticación por dentro.
- **Resend + React Email** para correos (Resend vía Vercel Marketplace).
- **Vercel Cron Jobs** para el envío semanal.
- **next/og** para las imágenes de redes (ya se usa en el MVP).
- **Zod** para validar entradas en formularios y API, y como fuente del esquema OpenAPI.
- **Vitest** (unitarios, ya existe) + **Playwright** (flujos de punta a punta).
- **GitHub Actions:** lint, typecheck, tests y verificación de migraciones en cada PR.

## Diseño

### Datos (Postgres)

- **communities:** id, slug (único), name, description, topics (text[]), links (jsonb: label + url), timestamps.
- **events:** id, slug (único), title, description, community_id, starts_at y ends_at (timestamptz), venue, online, registration_url (opcional), topics, status (`borrador` | `publicado` | `cancelado`), published_at, timestamps.
- **proposals:** id, los mismos campos de evento en texto libre (incluido el nombre de la comunidad tal como lo escribe quien propone), registration_url (opcional), contact_name, contact_email, status (`nueva` | `aceptada` | `descartada`), event_id (si se convirtió en evento), created_at.
- **subscribers:** id, email (único), all_communities (bool), confirmed_at, confirm_token, unsubscribe_token, created_at.
- **subscriber_communities:** subscriber_id, community_id.
- **calendar_editions:** id, kind (`semanal` | `mensual`), period_start, version (entero), generated_at, sent_at. Registra cada vez que se regenera o republica un calendario.
- Tablas propias de Better Auth (usuario, sesión, cuenta, verificación).

Los eventos y comunidades ficticios del MVP quedan solo como **datos de desarrollo** (seed local); producción arranca vacía y el autor carga lo real.

### Sitio público

1. **Inicio:** propuesta de valor, eventos de la semana y próximos, filtro por comunidad, llamada a suscribirse.
2. **Evento:** toda la información, "Agregar a calendario" (.ics), enlace de registro si existe, compartir.
3. **Comunidades** y **comunidad:** descripción, sus eventos, "Seguir" (lleva a suscripción con la comunidad preseleccionada).
4. **Calendario del mes:** página con todos los eventos publicados del mes.
5. **Proponer evento:** formulario público. Campos del evento + **enlace de registro (opcional, "si tienen")** + nombre y correo de contacto. Al enviar se guarda como solicitud `nueva` y se muestra confirmación; **no publica nada**. Protección anti-spam: campo trampa (honeypot) y límite de envíos por IP.
6. **Suscribirse:** correo + comunidades o "todo". Envía correo de confirmación (doble opt-in); solo los confirmados reciben avisos. Cada correo incluye enlace de baja de un clic y enlace para cambiar preferencias.
7. **Media kit:** actualizado a la nueva marca.

### Panel privado (`/panel`)

- Login con correo y contraseña de Better Auth; **registro deshabilitado**. La cuenta del autor se crea con un script usando variables de entorno.
- **Eventos:** crear, editar, publicar, despublicar, cancelar.
- **Comunidades:** crear y editar.
- **Solicitudes:** bandeja de propuestas; ver detalle, **convertir en evento** (abre el formulario de evento prellenado) o descartar.
- **Calendarios:** vista previa del semanal y del mensual con los datos actuales; descargar imágenes (post y story); "Regenerar y republicar" (crea una nueva versión en `calendar_editions`).
- **Suscriptores:** lista y conteos (sin exportar por ahora).
- **Imágenes por evento:** post 1080×1080 y story 1080×1920 en estilo nocturno, como en el MVP.

### Calendarios

- **Semanal:** cubre lunes a domingo. Cada **lunes por la mañana** (hora de CDMX) un cron arma y envía un correo a cada suscriptor confirmado con los eventos de **sus** comunidades (o todos). También existe como imagen para redes.
- **Mensual:** imagen para redes + página en el sitio.
- **Regenerar (decidido por el autor):** las imágenes y la página siempre reflejan los datos actuales; "regenerar" en el panel crea una versión nueva para descargar y volver a publicar en redes. **El correo semanal nunca se reenvía:** si algo cambia después del lunes, el correo del lunes siguiente ya sale correcto.
- **Correos a suscriptores (decidido por el autor):** solo el de confirmación, el de bienvenida y el semanal. No hay avisos por evento; se retira el correo por evento del MVP.
- **Calendario suscribible:** feed `.ics` general y uno por comunidad, que la persona agrega una vez en Google Calendar o iPhone.

### API REST pública (`/api/v1`)

- Solo lectura y solo eventos publicados: lista de eventos (filtros por comunidad y rango de fechas), detalle de evento, comunidades, detalle de comunidad, feeds `.ics`.
- Esquema **OpenAPI** generado desde los esquemas Zod, con una página de documentación en el sitio.
- Las acciones del panel y del formulario usan Server Actions o rutas internas; no forman parte de la API pública.

## Fases

Cada fase termina desplegada y usable; cada una tiene su propio plan.

1. **Fundación y marca:** base de datos y migraciones, rebrand completo a PUE/Tech, sitio público leyendo de Postgres, panel con login y alta de eventos y comunidades, imágenes por evento, CI. Se retira `localStorage` y la moderación con contraseña fija.
2. **Solicitudes:** formulario público nuevo, bandeja en el panel, convertir en evento. El aviso por correo al autor usa el modo de prueba de Resend (solo puede escribirle al dueño de la cuenta), que funciona sin dominio.
3. **API pública documentada:** `/api/v1` + OpenAPI + página de documentación.
4. **Calendarios para redes y sitio:** semanal y mensual como imágenes, página del mes, regenerar en el panel.
5. **Correo y feeds (requiere dominio propio):** suscripciones con doble opt-in, preferencias, baja, bienvenida, correo semanal por cron y feeds `.ics` suscribibles. Empieza cuando el autor compre y verifique el dominio.

## Decisiones del asistente (corregibles)

- Pedir correo y nombre de contacto en el formulario de propuestas.
- Doble opt-in y baja de un clic en todos los correos.
- Login con correo y contraseña, registro deshabilitado, cuenta creada por script.
- Better Auth en lugar de Clerk; Neon y Resend vía Vercel Marketplace.
- Datos ficticios solo para desarrollo; producción arranca vacía.
- El media kit se conserva y se actualiza a la nueva marca.
- Envío semanal los lunes por la mañana, hora de CDMX.
- Orden de fases arriba (la API se adelanta y el correo va al final porque depende del dominio).
- Renombrar el proyecto de Vercel de `cemita` a `pue-tech`, para que la URL provisional sea `pue-tech.vercel.app`.
- **Eventos cancelados:** siguen visibles con la etiqueta "Cancelado" (página, API, imágenes); en los feeds `.ics` salen con `STATUS:CANCELLED` para que se actualicen en el calendario de la gente. Los despublicados (de vuelta a `borrador`) sí desaparecen.
- **Eventos sin comunidad:** `events.community_id` es opcional desde la primera migración; se muestran como "Independiente". Solo llegan a quienes siguen "todo".
- **Entre fases:** en la fase 1, `/proponer` y `/suscribete` muestran "Próximamente" y no guardan nada; cada uno se activa en su fase (no se juntan correos antes de tener doble opt-in).
- **Solicitudes:** al llegar una propuesta, el autor recibe un aviso por correo. A quien propone no se le manda nada automático; el autor le escribe a mano si hace falta. Si el dominio aún no está listo en la fase 2, el aviso se agrega en cuanto lo esté.

## Queda al criterio de quien construye

Estructura de carpetas, nombres de componentes, detalles visuales dentro del sistema de marca, textos, diseño exacto de los correos y de las imágenes de calendario, límites concretos del rate limit, formato exacto de los `.ics` y de la documentación OpenAPI.
