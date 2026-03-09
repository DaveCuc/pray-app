# Oratio - App de Oracion

Aplicacion web construida con Next.js (App Router) para acompanar tiempos de oracion diaria con enfoque inmersivo.

## Novedades Recientes

- Arquitectura con `Route Groups`:
  - `app/(main)` contiene las pantallas principales con navegacion y swipe.
  - `app/sesion` queda aislada, sin barras ni gestos globales, para modo concentracion.
- Providers globales en `app/layout.tsx`:
  - `ClerkProvider`
  - `ThemeProvider`
  - `PrayerProvider`
  - `ReadingProvider`
- Estado global para racha y lectura mediante Context API.
- Cache local inmediata + revalidacion en segundo plano con base de datos.

## Funcionalidades

- Temporizador por fases de oracion.
- Seguimiento de racha diaria y dias totales.
- Lectura progresiva de Evangelio y Salmo.
- Modo concentracion en `/sesion`.
- Ajustes de tema (claro/oscuro/sistema).
- Pantallas de musica, perfil y configuracion.

## Tecnologias

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Clerk (autenticacion)
- Prisma + Neon/PostgreSQL

## Requisitos

- Node.js 18 o superior
- npm
- Variables de entorno configuradas para Clerk y base de datos

## Instalacion y ejecucion

1. Instala dependencias:

```bash
npm install
```

2. Ejecuta migraciones/generacion de Prisma (si aplica en tu entorno):

```bash
npx prisma generate
```

3. Inicia en desarrollo:

```bash
npm run dev
```

4. Abre:

```text
http://localhost:3000
```

## Scripts Disponibles

- `npm run dev`: desarrollo
- `npm run build`: build de produccion
- `npm run start`: ejecutar build
- `npm run lint`: analisis con ESLint

## Arquitectura de Rutas (Actual)

```text
app/
  layout.tsx                # Root layout: providers globales
  (main)/
    layout.tsx              # NavBar + LeftNav + BottomNav + SwipeWrapper
    page.tsx                # Inicio
    musica/page.tsx
    perfil/page.tsx
    settings/page.tsx
  sesion/page.tsx           # Modo concentracion (inmersivo)
  (auth)/...
  _components/
  _context/
```

## Flujo de Racha (Prayer)

- Contexto: `app/_context/PrayerContext.tsx`
- Acciones servidor: `actions/prayer.ts`
- UI de racha: `app/_components/StreakDisplay.tsx`

Comportamiento:

- Lee cache local (`oratio_stats_cache`) al montar en cliente.
- Revalida con BD via `getPrayerStats()`.
- Al completar sesion, hace actualizacion optimista y persiste con `savePrayerSession()`.
- `completedToday` controla vela/estado activo del dia.

## Flujo de Lectura (Evangelio + Salmo)

- Contexto: `app/_context/ReadingContext.tsx`
- Acciones servidor: `actions/reading.ts`

Comportamiento:

- Cache local (`oratio_lectura_cache`) para carga instantanea.
- Revalidacion con `getReadingProgress()`.
- Guardado optimista con `ajustarLectura()` + persistencia en BD con `updateReadingProgress()`.

## Modo Concentracion (`/sesion`)

- No renderiza barras de navegacion ni swipe global.
- Incluye boton salir, reloj y lectura del dia.
- Guarda racha al completar fase del reloj.

## Persistencia

La app usa dos capas:

- Base de datos (Prisma): estado canonical de usuario (racha y lectura).
- `localStorage`: cache visual para evitar esperas y mejorar UX.

Claves usadas actualmente:

- `oratio_stats_cache`
- `oratio_lectura_cache`
- `oratio-tiempo-pref`

## Creditos de Diseno

Referencia visual usada como inspiracion:
https://codepen.io/kh-mamun/pen/YLGjvx
