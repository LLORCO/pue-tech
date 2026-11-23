# PUE Tech

PUE Tech reúne en un solo lugar los eventos y las comunidades de tecnología de Puebla. El sitio público muestra los próximos eventos (con filtro por comunidad, página de detalle y archivo `.ics` para el calendario) y el directorio de comunidades. Un panel privado permite a quien edita el sitio dar de alta comunidades y eventos, publicarlos o cancelarlos, y descargar imágenes listas para redes sociales.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components, Proxy) y React 19
- Tailwind CSS 4
- PostgreSQL con [Drizzle ORM](https://orm.drizzle.team) y `postgres.js`
- [Better Auth](https://www.better-auth.com) (correo y contraseña, registro cerrado)
- Zod para validación
- Vitest (unitarias, con PGlite) y Playwright (e2e)
- `next/og` para las imágenes de redes

## Desarrollo local

Requisitos: Node 24 y un PostgreSQL local.

```bash
npm install
createdb puetech_dev   # o la base que prefieras
```

Crea `.env.local` en la raíz:

```bash
DATABASE_URL=postgres://postgres@localhost:5432/puetech_dev
BETTER_AUTH_SECRET=<cadena aleatoria, p. ej. `openssl rand -base64 32`>
SITE_URL=http://localhost:3000
```

Prepara la base y arranca:

```bash
npm run db:migrate     # aplica las migraciones de drizzle/
npm run db:seed        # datos ficticios; solo sobre una base local y vacía
ADMIN_EMAIL=tu@correo.com ADMIN_PASSWORD='una-contraseña-larga' npm run admin:create
npm run dev
```

El sitio queda en `http://localhost:3000` y el panel en `/panel`. El seed se niega a correr contra un host que no sea `localhost`/`127.0.0.1` (salvo `SEED_ALLOW_REMOTE=1`) o con `VERCEL_ENV=production`.

## Pruebas

```bash
npm test               # unitarias (Vitest + PGlite, no necesita Postgres)
npm run lint
npm run typecheck
npm run e2e            # Playwright: compila y levanta la app en el puerto 3100
```

Los e2e **vacían** la base antes de correr, así que usan una base aparte: `E2E_DATABASE_URL` (por defecto `postgres://postgres@localhost:54329/puetech_e2e`). El nombre debe terminar en `_e2e` y, fuera de CI, el host debe ser local; si no, la preparación se niega.

## Estructura

```
app/                 rutas públicas (inicio, eventos, comunidades, media kit)
app/panel/           panel privado (login y CRUD de comunidades y eventos)
app/api/auth/        endpoints de Better Auth
app/api/og/          imágenes para redes (post 1080×1080 y story 1080×1920)
components/          componentes de UI compartidos
lib/db/              esquema de Drizzle y cliente perezoso
lib/data/            consultas y mutaciones (reciben la base como parámetro)
lib/validation.ts    esquemas Zod de los formularios
lib/auth.ts, lib/auth/  configuración de Better Auth y sesión del panel
lib/ics.ts, lib/og.ts   calendario e imágenes
drizzle/             migraciones SQL
scripts/             seed de desarrollo y alta del administrador
e2e/                 pruebas de Playwright y preparación de su base
```

## Despliegue

El proyecto se despliega en Vercel con Postgres de Neon.

1. Variables en Vercel: `DATABASE_URL` (conexión con pooler), `BETTER_AUTH_SECRET` y `SITE_URL` con la URL de producción (p. ej. `https://pue-tech.vercel.app`). Los previews de Vercel se aceptan automáticamente para el login a través de `VERCEL_URL` y `VERCEL_BRANCH_URL`.
2. Antes de cada despliegue que incluya migraciones nuevas, aplícalas contra la conexión **directa** (sin pooler) de Neon. `drizzle.config.ts` usa `DATABASE_URL_UNPOOLED` si existe:
   ```bash
   DATABASE_URL_UNPOOLED=<url directa de Neon> npm run db:migrate
   ```
3. Una sola vez, crea la cuenta del administrador contra la base de producción:
   ```bash
   DATABASE_URL=<url de Neon> ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:create
   ```

Producción arranca vacía: el seed de desarrollo no se usa ahí.
