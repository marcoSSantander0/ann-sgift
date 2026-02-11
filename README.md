# Reto del 11 (Next.js + TypeScript)

App romántica con 11 juegos/retos, sellos, progreso persistente en `localStorage` y carta final bloqueada con blur hasta completar todo.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Sin backend

## Ejecutar el proyecto

### Con npm
```bash
npm install
npm run dev
```

### Con pnpm
```bash
pnpm install
pnpm dev
```

Abrir en: `http://localhost:3000`

## Build de producción
```bash
npm run build
npm run start
```

## Rutas
- `/` landing
- `/reto` hub con 11 sellos
- `/juego/[id]` juego individual (1..11)
- `/carta` carta completa con blur/bloqueo condicional

## Cómo personalizar

### 1) Config general
Editar `data/config.ts`:
- `recipientName`
- `startDateLabel`
- `endDateLabel`
- `finalPin`
- `stopClockTargetSeconds`
- `stopClockToleranceSeconds`

### 2) Carta
Editar `data/letter.ts`:
- `letterFragments` (exactamente 11 fragmentos en orden)

### 3) Quiz
Editar `data/quiz.ts`:
- preguntas/opciones/respuesta correcta
- la del gato favorito se configura aquí

### 4) Sudoku
Editar `data/sudoku.ts`:
- `sudokuPuzzleEasy`
- `sudokuSolutionEasy`

### 5) Imágenes
Colocar archivos en la carpeta raíz `assets/` con estos nombres exactos:
- `assets/memory_01.jpg`
- `assets/memory_02.jpg`
- `assets/memory_03.jpg`
- `assets/memory_04.jpg`
- `assets/puzzle_01.jpg`

La app consume esas rutas como `/assets/...` en producción mediante `app/assets/[...path]/route.ts`.

## Estado global (`localStorage`)
Implementado en `lib/storage.ts`:
- `loadState()`
- `saveState(state)`
- `resetState()`

Interfaz `GameState`:
- `completed: boolean[]` (11)
- `finalKeyUnlocked: boolean`
- `updatedAt: number`

Reglas de desbloqueo de carta en `lib/gameRules.ts`:
- juegos 1..10 completos
- `finalKeyUnlocked === true` (juego 11 con PIN correcto)

## Rejugabilidad
Todos los juegos tienen opción de reintento y se pueden abrir en cualquier orden desde el hub.

## Estructura
```text
app/
components/
  games/
  ui/
data/
lib/
assets/
```
