# Oratio - App de Oracion

Aplicacion web construida con Next.js para acompañar tiempos de oracion diaria.

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
- shadcn/ui
- next-themes
- Framer Motion
- lucide-react
- Prisma

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

Funciones disponibles:

- `avanzarLectura()`: incrementa el indice en 1 (se ejecuta al completar una fase de oracion).
- `reiniciarLectura()`: reinicia el indice a 0 (vuelve a Mateo 1 y Salmo 1).
- `ajustarLectura(nuevoIndice)`: permite establecer manualmente el punto de inicio de las lecturas.

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

- `UserCard`: informacion del usuario con Clerk.
- `Statistics`: muestra estadisticas de racha y dias totales.
- `Upcoming`: proximas funcionalidades.

### 7) Pantalla de Ajustes (`/settings`)

Accesible desde el perfil, permite configurar:

- `ThemeSelector`: cambia entre tema claro, oscuro o del sistema.
- `TimerPreferences`: guarda preferencia de meta (20/40/60 minutos) en `localStorage` con la clave `oratio-tiempo-pref`.
- `BiblePreferences`: ajusta el punto de inicio de las lecturas biblicas (libro del evangelio, capitulo y salmo). Incluye interfaz con selects de shadcn/ui y modo de edicion activado con boton de lapiz.
- `RestartSection`: reinicia las lecturas al inicio (Mateo 1 y Salmo 1).

Nota: actualmente la preferencia de temporizador se guarda y se muestra en ajustes, pero no modifica aun la duracion real del componente `Reloj`.

### 8) Navegacion y layout global

Desde `app/layout.tsx` se configuran:

- `ThemeProvider` para soporte de temas.
- Navegacion inferior (`BottomNav`) con rutas:
	- Inicio (`/`)
	- Musica (`/musica`)
	- Perfil (`/perfil`)
	- Settings (`/settings`) - accesible desde el perfil

Diseño responsive: las pantallas de perfil y settings se muestran centradas con ancho maximo de 768px en escritorio, mejorando la legibilidad.

## Estructura base del proyecto

```text
app/
	page.tsx
	musica/page.tsx
	perfil/page.tsx
	settings/page.tsx
	_components/
		Reloj.tsx
		Evangelio.tsx
		BottomNav.tsx
		...
	(auth)/
hooks/
	usePrayerProgress.ts
	useLectura.ts
components/
	ui/
		button.tsx
		select.tsx
		theme-provider.tsx
prisma/
	schema.prisma
```

## Persistencia de datos locales

La app no usa backend actualmente. El estado principal se persiste en el navegador con `localStorage`:

- `prayer-progress`: racha y dias completados.
- `oratio-lectura`: indice de lectura biblica.
- `oratio-tiempo-pref`: preferencia de tiempo en perfil.

## Proximas mejoras sugeridas

- Conectar `TimerPreferences` con el `Reloj` para ajustar fases segun la meta elegida.
- Registrar historial diario de oracion y lecturas.
- Incluir notificaciones o recordatorios.
- Sincronizacion de progreso en la nube con Prisma.


## Uso de diseños
Gracias al diseñador de quien tome prestado su diseño en css para mi proyecto no se como se llama pero dejo el enlace del creador
https://codepen.io/kh-mamun/pen/YLGjvx
