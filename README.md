# Oratio - App de Oracion

Aplicacion web construida con Next.js para acompanar tiempos de oracion diaria.

Incluye:

- Temporizador por fases de oracion.
- Seguimiento de racha y dias totales.
- Lectura progresiva de Evangelios y Salmos.
- Seccion de musica de apoyo.
- Preferencias de apariencia (claro/oscuro/sistema).

## Tecnologias

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- next-themes
- Framer Motion
- lucide-react

## Requisitos

- Node.js 18 o superior
- npm

## Instalacion y ejecucion

1. Instala dependencias:

```bash
npm install
```

2. Inicia el servidor de desarrollo:

```bash
npm run dev
```

3. Abre en tu navegador:

```text
http://localhost:3000
```

## Scripts disponibles

- `npm run dev`: inicia la app en modo desarrollo.
- `npm run build`: genera la version de produccion.
- `npm run start`: levanta la app compilada.
- `npm run lint`: ejecuta eslint.

## Como funciona el programa

### 1) Pantalla de Inicio (`/`)

La pantalla principal integra dos bloques:

- `Reloj`: temporizador de oracion por fases.
- `Evangelio`: lectura del dia (Evangelio + Salmo).

Cuando una fase termina en el reloj, se dispara `handleFaseCompletada` en `app/page.tsx`, que ejecuta:

- `saveProgress()` del hook `usePrayerProgress`.
- `avanzarLectura()` del hook `useLectura`.

Eso significa que al completar una fase:

- Se actualiza la racha diaria.
- Se avanza 1 posicion en la lectura biblica.

### 2) Logica de racha y progreso (`hooks/usePrayerProgress.ts`)

Este hook guarda y recupera datos desde `localStorage` usando la clave `prayer-progress`.

Datos que mantiene:

- `currentStreak`: dias seguidos orando.
- `totalDays`: total historico de dias completados.
- `lastDate`: ultima fecha registrada.
- `completedToday`: indica si ya se completo hoy.

Comportamiento:

- Al cargar, si pasaron mas de 1 dia desde `lastDate`, la racha se reinicia.
- Al guardar progreso en el dia actual, no duplica el conteo.

### 3) Logica de lectura (`hooks/useLectura.ts`)

El indice de lectura se almacena en `localStorage` con la clave `oratio-lectura`.

Con ese indice, el componente `Evangelio` calcula:

- Evangelio actual dentro de una secuencia continua:
	- Mateo (28 capitulos)
	- Marcos (16 capitulos)
	- Lucas (24 capitulos)
	- Juan (21 capitulos)
- Salmo del dia entre 1 y 150.

Ambas lecturas avanzan ciclicamente con el operador modulo.

### 4) Temporizador por fases (`app/_components/reloj.tsx`)

El reloj trabaja en 3 fases secuenciales:

- Accion de Gracias
- Alabanza
- Espiritu Santo

Cada fase tiene una duracion configurada en la constante `FASES`.

Flujo:

- Boton Play/Pause para iniciar o pausar.
- Boton Reset para volver al inicio de la fase.
- Al terminar una fase:
	- Se muestra estado completado.
	- Si no es la ultima, aparece `Siguiente Fase`.
	- Si es la ultima, muestra `Oracion Completada`.

Visualmente incluye:

- Barra/circulo de progreso.
- Animaciones con Framer Motion.
- Vela encendida cuando la fase se completa o cuando ya se oro ese dia.

### 5) Pantalla de Musica (`/musica`)

Contiene dos modulos:

- `PlataformasMusica`: accesos directos a Spotify y YouTube Music.
- `SugerenciasMusica`: ideas de busqueda musical para oracion.

### 6) Pantalla de Perfil (`/perfil`)

Incluye:

- `UserCard`: muestra estadisticas de racha y dias totales.
- `ThemeSelector`: cambia entre tema claro, oscuro o del sistema.
- `TimerPreferences`: guarda preferencia de meta (20/40/60 minutos) en `localStorage` con la clave `oratio-tiempo-pref`.

Nota: actualmente la preferencia de temporizador se guarda y se muestra en perfil, pero no modifica aun la duracion real del componente `Reloj`.

### 7) Navegacion y layout global

Desde `app/layout.tsx` se configuran:

- `ThemeProvider` para soporte de temas.
- Navegacion inferior (`BottomNav`) con rutas:
	- Inicio (`/`)
	- Musica (`/musica`)
	- Perfil (`/perfil`)

## Estructura base del proyecto

```text
app/
	page.tsx
	musica/page.tsx
	perfil/page.tsx
	_components/
hooks/
	usePrayerProgress.ts
	useLectura.ts
components/
	ui/
```

## Persistencia de datos locales

La app no usa backend actualmente. El estado principal se persiste en el navegador con `localStorage`:

- `prayer-progress`: racha y dias completados.
- `oratio-lectura`: indice de lectura biblica.
- `oratio-tiempo-pref`: preferencia de tiempo en perfil.

## Proximas mejoras sugeridas

- Conectar `TimerPreferences` con el `Reloj` para ajustar fases segun la meta elegida.
- Agregar autenticacion y sincronizacion en la nube.
- Registrar historial diario de oracion y lecturas.
- Incluir notificaciones o recordatorios.
