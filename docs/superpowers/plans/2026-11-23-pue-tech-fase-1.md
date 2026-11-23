# PUE/Tech — Fase 1: Fundación y marca — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir la demo Cemita en PUE/Tech con datos reales en Postgres: rebrand completo, sitio público leyendo de la base, panel privado con login para dar de alta eventos y comunidades, imágenes por evento, tests y CI.

**Architecture:** Una sola app Next.js 16 (App Router). Postgres (Neon en producción) vía Drizzle ORM con el driver `postgres` (postgres.js), migraciones versionadas en `drizzle/`. Una capa de datos (`lib/data/*`) de funciones puras que reciben `db` como parámetro, probada contra Postgres en memoria (PGlite). Las páginas públicas son Server Components con render dinámico; el panel usa Server Actions que verifican la sesión de Better Auth antes de tocar datos.

**Tech Stack:** Next.js 16.4 + React 19.3 + TypeScript + Tailwind 4 · drizzle-orm 0.45 + drizzle-kit 0.31 + postgres 4 · better-auth 1.7 · zod 4 · Vitest 5 + @electric-sql/pglite 0.5 · Playwright 1.65 · GitHub Actions · tsx para scripts.

**Spec:** `docs/superpowers/specs/2026-11-23-pue-tech-v2-design.md` (sección "Fases", fase 1).

## Global Constraints

- Antes de escribir código de Next.js, leer la guía relevante en `node_modules/next/dist/docs/` (ver `AGENTS.md`). En Next 16 el middleware se llama **Proxy** (`proxy.ts`). Este proyecto **no** usa `cacheComponents`; no activarlo en esta fase.
- Antes de escribir código de Better Auth o Drizzle, verificar la API contra los paquetes instalados (`node_modules/better-auth`, `node_modules/drizzle-orm`), no contra la memoria.
- Todo el texto de la UI en español. Tono: cercano pero cuidado, sin modismos poblanos ni chistes de comida (se retira el tono "cotorro" de Cemita).
- Nombre: **PUE Tech**. Logo: `PUE/Tech` en Space Grotesk bold, la diagonal en vino. Lema: "Lo mejor de la tecnología en Puebla, en un solo lugar."
- Paleta (única fuente: `lib/brand.ts` + `@theme` en `app/globals.css`): Blanco `#FAFAF7`, Arena `#E6E1D8`, Verde `#234D3A`, Bosque profundo `#14201A`, Marrón `#6B4A35`, Cacao `#3B2418`, Vino `#8E2C3B`, Vino claro `#E8A4AE`. Texto principal Tinta `#171A17`. **Nada de naranja** (parecido con Workbliss).
- Sitio en estilo minimal: fondo Blanco, tipografía **Geist**, vino solo en detalles (fechas, botones, logo). Imágenes para redes en estilo nocturno: fondos Bosque profundo/Cacao, titulares en **Space Grotesk**, acento Vino claro.
- Desaparecen: talavera (`TalaveraPattern`), cobalto/amarillo, Bricolage Grotesque, Inter, emojis de comida.
- Zona horaria `America/Mexico_City`, UTC−6 todo el año; locale `es-MX`. En la base, fechas como `timestamptz`.
- Estados de evento: `borrador` | `publicado` | `cancelado`. Público ve `publicado` y `cancelado` (este con etiqueta "Cancelado"); `borrador` da 404.
- `events.community_id` es opcional; sin comunidad se muestra "Independiente".
- `registration_url` es opcional; si no hay, no se muestra botón de registro.
- El slug de un evento o comunidad se fija al crearlo y no cambia al editar.
- Variables de entorno: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `SITE_URL` (única fuente de URLs absolutas). Solo para scripts: `ADMIN_EMAIL`, `ADMIN_PASSWORD`. Importar el cliente de base de datos **no debe lanzar** si `DATABASE_URL` falta (el build de CI corre sin base).
- Login: correo y contraseña, **registro deshabilitado**; la cuenta del autor se crea con un script.
- `/proponer` y `/suscribete` muestran "Próximamente" y no guardan nada.
- Producción arranca vacía; los datos ficticios del MVP solo existen como seed de desarrollo.
- URL provisional: `*.vercel.app` (proyecto renombrado a `pue-tech`). Sin dominio propio en esta fase.

## Review Focus

1. Un evento a las 23:30 hora de Puebla → se muestra en el día correcto y, al editarlo, el formulario muestra la misma hora local (no la UTC). (Task 2)
2. Alguien sin sesión llama directamente a una Server Action del panel → no se modifica nada; la protección no depende solo del Proxy. (Task 6 define `requireAdmin`, Task 10 lo prueba de punta a punta)
3. Abrir la URL de un evento en `borrador` → 404; uno `cancelado` → visible con etiqueta "Cancelado". (Task 3, Task 5)
4. Dos eventos con el mismo título, o un título sin letras ("🎉🎉") → slugs distintos y válidos (`-2`, `evento`). (Task 3)
5. Evento sin comunidad y sin enlace de registro → tarjeta, página, `.ics` e imagen se ven bien, sin "undefined" ni botones vacíos. (Task 5, Task 8)

---

### Task 1: Base de datos — esquema, cliente y migraciones

**Files:**
- Create: `lib/db/schema.ts`, `lib/db/client.ts`, `lib/db/test-db.ts`, `drizzle.config.ts`, `drizzle/` (generado), `lib/db/schema.test.ts`
- Modify: `package.json` (deps y scripts)

**Interfaces:**
- Produces:
  - `eventStatus` (pgEnum `event_status`: `borrador`, `publicado`, `cancelado`); `type EventStatus`.
  - Tabla `communities`: `id` uuid pk default random, `slug` text unique, `name`, `description`, `topics` text[] default `{}`, `links` jsonb `{ label: string; url: string }[]` default `[]`, `createdAt`, `updatedAt` timestamptz.
  - Tabla `events`: `id` uuid pk, `slug` unique, `title`, `description`, `communityId` uuid nullable → `communities.id` on delete set null, `startsAt`, `endsAt` timestamptz, `venue` text default `''`, `online` bool default false, `registrationUrl` text nullable, `topics` text[], `status` default `borrador`, `publishedAt` nullable, `createdAt`, `updatedAt`.
  - Tipos `Community`, `Event` (`$inferSelect`) y `EventWithCommunity = Event & { community: Community | null }`.
  - `type Db = PgDatabase<PgQueryResultHKT, typeof schema>` y `db: Db` (postgres.js, `prepare: false` para el pooler de Neon) en `lib/db/client.ts`.
  - `createTestDb(): Promise<Db>` en `lib/db/test-db.ts`: PGlite en memoria + migraciones de `drizzle/`.
  - Scripts npm: `db:generate`, `db:migrate`, `typecheck` (`tsc --noEmit`). `drizzle.config.ts` carga `.env.local` si existe.

- [ ] **Step 1:** `npm i drizzle-orm postgres zod better-auth` y `npm i -D drizzle-kit @electric-sql/pglite tsx @playwright/test`.
- [ ] **Step 2: Test que falla** en `lib/db/schema.test.ts`:

```ts
it("crea un evento sin comunidad ni registro y lo lee", async () => {
  const db = await createTestDb();
  const [e] = await db.insert(events).values({ slug: "x", title: "X", description: "d",
    startsAt: new Date("2026-12-04T18:00:00-06:00"), endsAt: new Date("2026-12-04T20:00:00-06:00") }).returning();
  expect(e.status).toBe("borrador");
  expect(e.communityId).toBeNull();
  expect(e.registrationUrl).toBeNull();
});
it("rechaza slugs de comunidad repetidos", async () => { /* segundo insert con mismo slug → rejects */ });
```

- [ ] **Step 3:** `npx vitest run lib/db` → FAIL (módulos no existen).
- [ ] **Step 4:** Escribir `schema.ts`, `client.ts`, `test-db.ts`, `drizzle.config.ts` (schema `./lib/db/schema.ts`, out `./drizzle`, dialect `postgresql`); `npm run db:generate` produce la primera migración.
- [ ] **Step 5:** `npx vitest run lib/db` → PASS. `npm run typecheck` → sin errores.
- [ ] **Step 6:** Commit `feat(db): esquema de comunidades y eventos con Drizzle`.

---

### Task 2: Validación y fechas

**Files:**
- Create: `lib/datetime.ts`, `lib/datetime.test.ts`, `lib/validation.ts`, `lib/validation.test.ts`
- Delete: `lib/validate.ts`, `lib/validate.test.ts` (su lógica pasa aquí)

**Interfaces:**
- Produces:
  - `localToIso(local: string): string` (se mueve de `validate.ts`, mismo comportamiento: `"2026-12-04T23:30"` → `"2026-12-04T23:30:00-06:00"`).
  - `isoToLocalInput(date: Date): string` → valor para `<input type="datetime-local">` en hora de Puebla.
  - `type EventInput = { title; description; communityId: string | null; startsAt: Date; endsAt: Date; venue: string; online: boolean; registrationUrl: string | null; topics: string[] }`
  - `type CommunityInput = { name; description; topics: string[]; links: { label: string; url: string }[] }`
  - `type FormResult<T> = { ok: true; data: T } | { ok: false; errors: Record<string, string> }`
  - `parseEventForm(fd: FormData): FormResult<EventInput>` y `parseCommunityForm(fd: FormData): FormResult<CommunityInput>`, con esquemas Zod `eventInputSchema` y `communityInputSchema` exportados (la fase 3 los reutiliza para OpenAPI).
- Reglas: título y descripción obligatorios (título ≤ 120); fin > inicio; `venue` obligatorio salvo `online`; `registrationUrl` vacío → `null`, si viene debe ser `http(s)`; `communityId` vacío → `null`; `topics` desde texto separado por comas, sin vacíos ni repetidos; `links` desde líneas `Etiqueta | https://url`, cada URL `http(s)`.

- [ ] **Step 1: Tests que fallan:**

```ts
it("ida y vuelta de hora local a las 23:30", () => {
  const iso = localToIso("2026-12-04T23:30");
  expect(isoToLocalInput(new Date(iso))).toBe("2026-12-04T23:30");
  expect(formatDate(iso)).toBe("Vie 4 de dic");
});
it("registro vacío y comunidad vacía se vuelven null", () => {
  const r = parseEventForm(fd({ title: "A", description: "d", communityId: "", startsAt: "2026-12-04T18:00",
    endsAt: "2026-12-04T20:00", venue: "Centro", registrationUrl: "", topics: "IA, Web, IA," }));
  expect(r).toMatchObject({ ok: true, data: { communityId: null, registrationUrl: null, topics: ["IA", "Web"] } });
});
it("rechaza fin antes del inicio, link no http y lugar vacío sin 'en línea'", () => { /* errors.endsAt, errors.registrationUrl, errors.venue */ });
it("parsea links 'Etiqueta | url' y rechaza una url inválida", () => { /* … */ });
```

- [ ] **Step 2:** `npx vitest run lib/datetime lib/validation` → FAIL.
- [ ] **Step 3:** Implementar ambos módulos; actualizar imports de `localToIso` (hoy en `app/proponer/page.tsx`, se retira en Task 9; mientras, que compile).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: validación con Zod y fechas en hora de Puebla`.

---

### Task 3: Capa de datos y seed de desarrollo

**Files:**
- Create: `lib/data/communities.ts`, `lib/data/events.ts`, `lib/data/communities.test.ts`, `lib/data/events.test.ts`, `scripts/seed-dev.ts`
- Modify: `lib/seed.ts` (adaptar los datos ficticios a `CommunityInput`/`EventInput`), `package.json` (script `db:seed`)

**Interfaces:**
- Consumes: `Db`, tablas y tipos de Task 1; `EventInput`, `CommunityInput` de Task 2; `uniqueSlug` de `lib/slug.ts`.
- Produces (`lib/data/events.ts`):
  - `listUpcoming(db: Db, opts: { now: Date; communitySlug?: string }): Promise<EventWithCommunity[]>`: estados `publicado` y `cancelado`, `endsAt >= now`, orden por `startsAt` ascendente.
  - `getPublicEventBySlug(db: Db, slug: string): Promise<EventWithCommunity | null>`: `null` si no existe o es `borrador`.
  - `listAllEvents(db: Db): Promise<EventWithCommunity[]>` (panel, `startsAt` descendente).
  - `getEventById(db: Db, id: string): Promise<EventWithCommunity | null>`
  - `createEvent(db: Db, input: EventInput): Promise<Event>`: nace en `borrador`, slug único.
  - `updateEvent(db: Db, id: string, input: EventInput): Promise<Event>`: no cambia el slug; actualiza `updatedAt`.
  - `setEventStatus(db: Db, id: string, status: EventStatus, now: Date): Promise<Event>`: al pasar a `publicado` fija `publishedAt = now` solo si estaba vacío.
- Produces (`lib/data/communities.ts`):
  - `listCommunities(db: Db, now: Date): Promise<(Community & { upcomingCount: number })[]>`: orden por nombre; cuenta eventos públicos no terminados.
  - `getCommunityBySlug(db: Db, slug: string): Promise<Community | null>`, `getCommunityById(db: Db, id: string): Promise<Community | null>`
  - `createCommunity(db: Db, input: CommunityInput): Promise<Community>`, `updateCommunity(db: Db, id: string, input: CommunityInput): Promise<Community>` (slug fijo).
- `npm run db:seed` (`tsx --env-file=.env.local scripts/seed-dev.ts`): inserta las comunidades y eventos ficticios (todos `publicado`); se niega a correr si `VERCEL_ENV === "production"` o si ya hay comunidades.

- [ ] **Step 1: Tests que fallan** (cada archivo crea su base con `createTestDb()`):

```ts
it("listUpcoming muestra publicados y cancelados, no borradores ni terminados", async () => {
  // crea 4 eventos: publicado futuro, cancelado futuro, borrador futuro, publicado ya terminado
  expect((await listUpcoming(db, { now })).map((e) => e.title)).toEqual(["Publicado", "Cancelado"]);
});
it("getPublicEventBySlug devuelve null para borrador", async () => { /* … */ });
it("slugs únicos: mismo título → '-2'; título sin letras → 'evento'", async () => {
  expect((await createEvent(db, input({ title: "Meetup IA" }))).slug).toBe("meetup-ia");
  expect((await createEvent(db, input({ title: "Meetup IA" }))).slug).toBe("meetup-ia-2");
  expect((await createEvent(db, input({ title: "🎉🎉" }))).slug).toBe("evento");
});
it("updateEvent no cambia el slug", async () => { /* … */ });
it("publicar dos veces conserva el primer publishedAt", async () => { /* … */ });
it("filtra por comunidad y trae community null para independientes", async () => { /* … */ });
it("listCommunities cuenta solo eventos públicos próximos", async () => { /* … */ });
```

- [ ] **Step 2:** `npx vitest run lib/data` → FAIL.
- [ ] **Step 3:** Implementar ambos módulos y el script de seed.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat(data): capa de datos de eventos y comunidades`.

---

### Task 4: Marca PUE/Tech

**Files:**
- Modify: `lib/brand.ts`, `app/globals.css`, `app/layout.tsx`, `components/Logo.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `components/Field.tsx`, `components/EmptyState.tsx`
- Create: `assets/fonts/space-grotesk-latin-500-normal.ttf`, `space-grotesk-latin-700-normal.ttf`, `geist-latin-400-normal.ttf`, `geist-latin-600-normal.ttf`
- Delete: `components/TalaveraPattern.tsx` (cuando nadie lo importe; si aún lo usan páginas del MVP, se borra en Task 9), `assets/fonts/bricolage-*`, `assets/fonts/inter-*` (en Task 8, cuando la ruta OG ya no los use)

**Interfaces:**
- Produces: `brand = { name: "PUE Tech", tagline, colors: { blanco, arena, verde, bosque, marron, cacao, vino, vinoClaro, tinta } }`; clases Tailwind `bg-blanco`, `text-vino`, `border-arena`, etc. con los mismos nombres; `--font-sans` = Geist y `--font-display` = Space Grotesk (vía `next/font/google`: `Geist`, `Space_Grotesk`); `<Logo light?: boolean />` renderiza `PUE/Tech` (diagonal en vino; en vino claro si `light`).

- [ ] **Step 1:** Descargar los TTF de `https://cdn.jsdelivr.net/fontsource/fonts/<familia>@latest/latin-<peso>-normal.ttf` (`space-grotesk` 500 y 700, `geist` 400 y 600) a `assets/fonts/`.
- [ ] **Step 2:** Reescribir tokens, layout (metadata: título `"PUE Tech · Eventos tech de Puebla"`, plantilla `"%s · PUE Tech"`, `metadataBase` desde `SITE_URL`), logo, header (Eventos, Comunidades, Proponer, botón Suscríbete en vino), footer (lema, enlace al media kit; sin "Datos de demostración" ni enlace a moderación), `Field` y `EmptyState` sin emoji ni tono cotorro.
- [ ] **Step 3:** `npm run typecheck && npm run lint && npm run build` → sin errores.
- [ ] **Step 4:** Abrir el sitio (`npm run dev`) y comparar header/footer/tipografías contra el mockup aprobado (sitio estilo C, logo de B).
- [ ] **Step 5:** Commit `feat: identidad PUE/Tech`.

---

### Task 5: Sitio público desde Postgres

**Files:**
- Modify: `app/page.tsx`, `app/eventos/[slug]/page.tsx`, `app/comunidades/page.tsx`, `app/comunidades/[slug]/page.tsx`, `components/EventCard.tsx`, `components/CommunityFilter.tsx`, `lib/ics.ts`, `lib/ics.test.ts`
- Create: `app/eventos/[slug]/ics/route.ts`, `components/CopyLinkButton.tsx`, `components/EventStatusBadge.tsx`
- Delete: `components/HomeEvents.tsx`, `components/EventDetail.tsx`, `components/CommunityList.tsx`, `components/CommunityDetail.tsx` (pasan a Server Components dentro de las páginas o se reescriben sin `useStore`)

**Interfaces:**
- Consumes: `db`, `listUpcoming`, `getPublicEventBySlug`, `listCommunities`, `getCommunityBySlug` (Task 3).
- Produces: `toICS(event: EventWithCommunity, now: Date): string` con `UID:<event.id>@puetech`, `PRODID:-//PUE Tech//Eventos tech de Puebla//ES`, `STATUS:CANCELLED` si está cancelado, "Organiza: Independiente" sin comunidad, líneas de registro y `URL:` solo si hay enlace. `GET /eventos/[slug]/ics` → `text/calendar` como adjunto; 404 si no es público.
- Comportamiento: páginas con render dinámico (leen la base en cada petición). Inicio filtra con `?comunidad=<slug>` (enlaces, no estado de cliente). Página de evento: `notFound()` si es `null`; etiqueta "Cancelado"; "Agregar a calendario" → ruta `.ics`; "Registrarme" solo con enlace; "Copiar link" (único componente cliente). Comunidad: "Seguir" lleva a `/suscribete?comunidad=<slug>`. `generateMetadata` con título del evento o comunidad. Sin descargas de imágenes en la página pública (pasan al panel, Task 8).

- [ ] **Step 1: Tests que fallan** en `lib/ics.test.ts`:

```ts
it("evento cancelado sin comunidad ni registro", () => {
  const ics = toICS({ ...ev, status: "cancelado", community: null, communityId: null, registrationUrl: null }, now);
  expect(ics).toContain("STATUS:CANCELLED");
  expect(ics).toContain("Organiza: Independiente");
  expect(ics).not.toMatch(/^URL:/m);
  expect(ics).not.toContain("undefined");
  expect(ics).toContain(`UID:${ev.id}@puetech`);
});
```

(Mantener el test existente de DTSTART en UTC y CRLF, adaptado a `EventWithCommunity`.)
- [ ] **Step 2:** `npx vitest run lib/ics` → FAIL.
- [ ] **Step 3:** Actualizar `toICS`; reescribir las páginas y componentes como Server Components.
- [ ] **Step 4:** `npm test && npm run typecheck && npm run build` → PASS.
- [ ] **Step 5:** Con `npm run db:seed` sobre una base de desarrollo: el inicio lista eventos, el filtro funciona, un evento cancelado muestra etiqueta, el slug de un borrador da 404, un evento sin comunidad dice "Independiente" y no tiene botón de registro.
- [ ] **Step 6:** Commit `feat: sitio público lee de Postgres`.

---

### Task 6: Autenticación y base del panel

**Files:**
- Create: `lib/auth.ts`, `lib/auth-client.ts`, `lib/auth/session.ts`, `lib/db/auth-schema.ts` (generado por el CLI de Better Auth), `app/api/auth/[...all]/route.ts`, `proxy.ts`, `app/panel/login/page.tsx`, `components/panel/LoginForm.tsx`, `components/panel/SignOutButton.tsx`, `app/panel/(admin)/layout.tsx`, `app/panel/(admin)/page.tsx` (placeholder que Task 8 completa), `scripts/create-admin.ts`
- Modify: `drizzle.config.ts` (agregar `auth-schema.ts`), `lib/db/schema.ts` (re-exportar tablas de auth), `package.json` (script `admin:create`), nueva migración en `drizzle/`

**Interfaces:**
- Produces:
  - `auth` (Better Auth: adaptador Drizzle `pg`, `emailAndPassword: { enabled: true, disableSignUp: true }`, `baseURL: SITE_URL`, plugin `nextCookies`).
  - `getAdminSession(): Promise<Session | null>` (memoizada con `cache` de React) y `requireAdmin(): Promise<Session>` que redirige a `/panel/login` sin sesión. **Toda Server Action y página del panel llama `requireAdmin()` primero**; `proxy.ts` solo hace la redirección optimista con la cookie de sesión para `/panel/:path*` excepto `/panel/login`.
  - `npm run admin:create`: crea la cuenta con `ADMIN_EMAIL`/`ADMIN_PASSWORD` aunque el registro esté deshabilitado (usar la API interna de Better Auth para crear usuario y cuenta con contraseña hasheada; verificar el método en `node_modules/better-auth`). Si el correo ya existe, avisa y no hace nada.
  - Login: correo + contraseña; error genérico "Correo o contraseña incorrectos"; al entrar va a `/panel`. Botón "Salir" en el layout del panel.

- [ ] **Step 1:** Configurar Better Auth y generar `auth-schema.ts` con su CLI; `npm run db:generate` → segunda migración.
- [ ] **Step 2: Test que falla** `lib/auth/session.test.ts`: con `getSession` simulado devolviendo `null`, `requireAdmin()` llama `redirect("/panel/login")` (mock de `next/navigation`); con sesión, la devuelve.
- [ ] **Step 3:** Implementar `session.ts`, ruta de auth, `proxy.ts`, login, layout y script.
- [ ] **Step 4:** `npm test && npm run typecheck && npm run build` → PASS.
- [ ] **Step 5:** Manual: `npm run db:migrate && npm run admin:create`; `/panel` sin sesión redirige al login; con credenciales correctas entra; "Salir" vuelve al login; la ruta de registro de Better Auth responde error.
- [ ] **Step 6:** Commit `feat(panel): login con Better Auth`.

---

### Task 7: Panel — comunidades

**Files:**
- Create: `app/panel/(admin)/comunidades/page.tsx`, `app/panel/(admin)/comunidades/nueva/page.tsx`, `app/panel/(admin)/comunidades/[id]/page.tsx`, `app/panel/(admin)/comunidades/actions.ts`, `components/panel/CommunityForm.tsx`

**Interfaces:**
- Consumes: `requireAdmin` (Task 6), `parseCommunityForm` (Task 2), `listCommunities`, `getCommunityById`, `createCommunity`, `updateCommunity` (Task 3).
- Produces: `createCommunityAction(prev: FormState, fd: FormData): Promise<FormState>` y `updateCommunityAction(id: string, prev: FormState, fd: FormData): Promise<FormState>`, con `type FormState = { errors?: Record<string, string>; values?: Record<string, string> }`. Orden dentro de cada acción: `requireAdmin()` → parsear → guardar → `revalidatePath("/", "layout")` → `redirect("/panel/comunidades")`. Con errores devuelve `errors` y los valores enviados para no perder lo escrito.
- `CommunityForm` (cliente, `useActionState`): nombre, descripción, temas (separados por coma), enlaces (uno por línea `Etiqueta | https://url`); errores bajo cada campo; botón deshabilitado mientras envía.

- [ ] **Step 1:** Implementar páginas, acciones y formulario.
- [ ] **Step 2:** `npm run typecheck && npm run lint && npm run build` → PASS.
- [ ] **Step 3:** Manual: crear una comunidad, editarla (el slug no cambia), ver errores con un enlace inválido; aparece en `/comunidades`.
- [ ] **Step 4:** Commit `feat(panel): alta y edición de comunidades`.

---

### Task 8: Panel — eventos e imágenes para redes

**Files:**
- Create: `app/panel/(admin)/eventos/nuevo/page.tsx`, `app/panel/(admin)/eventos/[id]/page.tsx`, `app/panel/(admin)/eventos/actions.ts`, `components/panel/EventForm.tsx`, `components/panel/EventStatusActions.tsx`
- Modify: `app/panel/(admin)/page.tsx` (lista de eventos), `app/api/og/route.tsx`, `lib/og.ts`, `lib/og.test.ts`
- Delete: `assets/fonts/bricolage-*`, `assets/fonts/inter-*`

**Interfaces:**
- Consumes: `requireAdmin`, `parseEventForm`, `isoToLocalInput`, funciones de eventos y comunidades de Task 3, `FormState` de Task 7.
- Produces:
  - `createEventAction(prev, fd)`, `updateEventAction(id, prev, fd)`, `setEventStatusAction(id: string, status: EventStatus): Promise<void>`; mismo orden que en Task 7 (`requireAdmin` primero, `revalidatePath("/", "layout")` al final).
  - `ogUrl(event: EventWithCommunity, format: "post" | "story"): string`; sin comunidad manda `community=Independiente`.
- Panel `/panel`: eventos con fecha, comunidad, estado y enlace a editar; botón "Nuevo evento".
- Edición: `EventForm` (comunidad como select con opción "Independiente", fechas `datetime-local` en hora de Puebla vía `isoToLocalInput`, casilla "En línea", enlace de registro opcional); botones Publicar / Volver a borrador / Cancelar evento según el estado; enlace "Ver en el sitio" si es público; descargas "Post 1080×1080" y "Story 1080×1920".
- `/api/og`: estilo nocturno (fondo Bosque profundo, titular Space Grotesk 700, acento Vino claro, `PUE/Tech` como firma, texto en Geist); conserva `clampTitle` y los tamaños.

- [ ] **Step 1: Test que falla** en `lib/og.test.ts`: `ogUrl` con `community: null` contiene `community=Independiente`; se conservan los tests de `clampTitle` y de codificación del título.
- [ ] **Step 2:** `npx vitest run lib/og` → FAIL.
- [ ] **Step 3:** Implementar acciones, páginas, formulario y nueva ruta OG.
- [ ] **Step 4:** `npm test && npm run typecheck && npm run build` → PASS.
- [ ] **Step 5:** Manual: crear un evento a las 23:30 sin comunidad ni registro → al editarlo muestra 23:30; publicarlo → aparece en el inicio; cancelarlo → etiqueta "Cancelado"; volver a borrador → su URL da 404; post y story se descargan con la identidad nocturna y título largo recortado.
- [ ] **Step 6:** Commit `feat(panel): eventos e imágenes para redes`.

---

### Task 9: Retirar el MVP y actualizar el media kit

**Files:**
- Delete: `lib/store.ts`, `lib/store.test.ts`, `lib/useStore.ts`, `lib/types.ts` (si ya nadie lo importa), `app/moderar/`, `app/correo/`, `components/SubscribeForm.tsx`, `components/EmailPreview.tsx`, `components/EventEmail.tsx`, `components/WelcomeEmail.tsx`, `components/TalaveraPattern.tsx`
- Modify: `app/proponer/page.tsx`, `app/suscribete/page.tsx`, `app/media-kit/page.tsx`
- Create: `components/ComingSoon.tsx`

**Interfaces:**
- Produces: `<ComingSoon title: string; text: string />`. `/proponer`: "Muy pronto podrás proponer eventos para PUE Tech." `/suscribete`: "Muy pronto podrás recibir cada lunes los eventos de las comunidades que sigues." Ninguna guarda datos.
- Media kit: logo `PUE/Tech` (claro y oscuro), paleta completa con nombre, hex y uso, tipografías (Geist para el sitio, Space Grotesk para titulares y redes), tono de voz con ejemplos "sí / no" nuevos, y ejemplo de post y story generados con `/api/og` usando un evento de muestra fijo (no de la base).

- [ ] **Step 1:** Borrar lo listado y escribir las páginas nuevas.
- [ ] **Step 2:** `grep -rn "useStore\|localStorage\|cemita\|Cemita\|cobalt\|Talavera" app components lib` → sin resultados (salvo `lib/seed.ts` si conserva algún nombre de ejemplo).
- [ ] **Step 3:** `npm test && npm run typecheck && npm run lint && npm run build` → PASS.
- [ ] **Step 4:** Commit `refactor: retira la demo Cemita`.

---

### Task 10: Pruebas de punta a punta y CI

**Files:**
- Create: `playwright.config.ts`, `e2e/publico.spec.ts`, `e2e/panel.spec.ts`, `.github/workflows/ci.yml`
- Modify: `package.json` (script `e2e`), `vitest.config.ts` (excluir `e2e/`), `.gitignore` (`/test-results`, `/playwright-report`)

**Interfaces:**
- Consumes: todo lo anterior; `db:migrate`, `db:seed`, `admin:create`.
- Playwright levanta la app con `npm run build && npm start` contra `DATABASE_URL` de una base desechable (en CI, un servicio `postgres:17`); el setup migra, siembra y crea la cuenta de prueba.

- [ ] **Step 1: Tests:**
  - `publico.spec.ts`: el inicio muestra eventos sembrados; el filtro por comunidad cambia la lista; un evento cancelado muestra "Cancelado"; la URL de un borrador responde 404; el `.ics` de un evento se descarga como `text/calendar`.
  - `panel.spec.ts`: `/panel` sin sesión → `/panel/login`; login correcto → crear evento → publicar → aparece en `/`; **acción sin sesión:** iniciar sesión, abrir "Nuevo evento", borrar las cookies, enviar el formulario → termina en `/panel/login` y el evento no existe en `/`.
- [ ] **Step 2:** `npm run e2e` con una base local desechable → PASS.
- [ ] **Step 3:** `ci.yml` en cada push y PR: `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npx drizzle-kit check` (migraciones consistentes), `npm run build`, y Playwright con el servicio Postgres.
- [ ] **Step 4:** Commit `ci: lint, tipos, tests, migraciones y e2e`.

---

### Task 11: Provisionar y publicar

Requiere acciones del autor en su cuenta; el agente las pide y espera.

- [ ] **Step 1 (autor):** Instalar la CLI (`npm i -g vercel`), `vercel login`, renombrar el proyecto a `pue-tech` en el dashboard.
- [ ] **Step 2:** `vercel integration add neon` (Marketplace) y `vercel env pull .env.local --yes`; agregar `BETTER_AUTH_SECRET` (aleatorio) y `SITE_URL=https://pue-tech.vercel.app` con `vercel env add` para Production y Preview.
- [ ] **Step 3:** `npm run db:migrate` contra producción; `ADMIN_EMAIL=… ADMIN_PASSWORD=… npm run admin:create` (el autor elige la contraseña; no se guarda en el repo).
- [ ] **Step 4 (autor, opcional):** Crear el repositorio en GitHub y hacer push para que corra el CI (hoy el repo no tiene remoto).
- [ ] **Step 5:** `vercel --prod`; verificar en la URL pública: inicio vacío con mensaje amable, login del panel, crear y publicar una comunidad y un evento reales, imágenes descargables.
- [ ] **Step 6:** Commit de cualquier ajuste y merge de `pue-tech-v2` según `superpowers:finishing-a-development-branch`.
