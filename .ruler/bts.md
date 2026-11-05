# Better Fullstack Project Rules

This is a hogwarts-fate-beyond project created with Better Fullstack CLI.

## Project Structure

This is a monorepo with the following structure:

- **`apps/web/`** - Fullstack application (TanStack Start)

- **`packages/db/`** - Database schema and utilities
- **`packages/env/`** - Shared environment variables and validation
- **`packages/config/`** - Shared TypeScript configuration

## Available Scripts

- `pnpm run dev` - Start all apps in development mode
- `pnpm run build` - Build all apps
- `pnpm run lint` - Lint all packages
- `pnpm run typecheck` - Type check all packages

## Database Commands

All database operations should be run from the web workspace:

- `pnpm run db:push` - Push schema changes to database
- `pnpm run db:studio` - Open database studio
- `pnpm run db:generate` - Generate Prisma files
- `pnpm run db:migrate` - Run database migrations

Database schema is located in `apps/web/prisma/schema.prisma`

## Project Configuration

This project includes a `bts.jsonc` configuration file that stores your Better Fullstack settings:

- Contains your selected stack configuration (database, ORM, backend, frontend, etc.)
- Used by the CLI to understand your project structure
- Safe to delete if not needed

## Key Points

- This is a monorepo using pnpm workspaces
- Each app has its own `package.json` and dependencies
- Run commands from the root to execute across all workspaces
- Run workspace-specific commands with `pnpm run command-name`
