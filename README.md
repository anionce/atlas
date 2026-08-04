# Atlas

Plataforma de simulaciones financieras. No es una colección de calculadoras: es un motor de decisiones (`Decision Engine` + `Journey Engine`) sobre el que se construyen herramientas ("Journeys") que ayudan a tomar decisiones financieras (comprar vivienda, ahorrar, invertir, impuestos).

Ver la visión completa del producto y la arquitectura en [`docs/`](./docs).

## Estructura del monorepo

```
atlas/
  apps/
    web/          # Next.js App Router (frontend)
  packages/        # paquetes compartidos (decision-engine, design-system, ...) — aún vacío
  docs/            # PRD y Technical Design Documents
```

## Requisitos

- Node.js >= 20 (ver `.nvmrc`)
- pnpm (`npm install -g pnpm` si no lo tienes)

## Comandos

```bash
pnpm install       # instala dependencias de todo el workspace
pnpm dev           # arranca apps/web en modo desarrollo
pnpm lint          # ESLint en todos los paquetes
pnpm typecheck     # tsc --noEmit en todos los paquetes
pnpm test          # tests unitarios (Vitest) en todos los paquetes
pnpm --filter web test:e2e   # tests end-to-end (Playwright) de apps/web
pnpm format        # Prettier --write en todo el repo
pnpm build         # build de producción de todos los paquetes
```

## Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Testing**: Vitest + Testing Library (unit), Playwright (e2e)
- **Calidad**: ESLint + Prettier + Husky + lint-staged + commitlint (Conventional Commits)
- **CI**: GitHub Actions (`.github/workflows/ci.yml`) — lint, typecheck, test, build, e2e en cada PR

## Despliegue en Vercel

Este repo aún no está conectado a ninguna cuenta de Vercel. Para conectarlo (acción a realizar por el propietario del proyecto, no automatizable):

1. Importar el repositorio en [vercel.com/new](https://vercel.com/new).
2. En **Root Directory**, seleccionar `apps/web`.
3. Vercel detecta automáticamente Next.js y el workspace de pnpm (por `pnpm-workspace.yaml` en la raíz) — no hace falta `vercel.json`.
4. Framework Preset: Next.js (autodetectado). Build Command / Install Command: los de por defecto.

## Convenciones de commits

Los commits siguen [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, ...), validado por commitlint en el hook `commit-msg`.
