# HRIS Demo

Next.js **human resources information system** demo: workforce records, payroll, recruitment / ATS, leave, rota, outsourcing clients, accounts, and employee self-service (ESS).

Branding and public copy are managed in **Dashboard → Admin → Company setup** (stored in the database). Demo packs seed these values on reseed; admins can edit them without redeploying. Environment variables are only for infrastructure (database, auth, SMTP, site URL).

## Requirements

- Node.js 20+
- PostgreSQL (e.g. Neon) — set `DATABASE_URL`

## Quick start

```bash
cd hris-demo
npm install
cp .env.example .env.local   # configure DATABASE_URL and auth secrets
npm run demo:reseed:generic  # apply generic context + seed database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Staff dashboard: `/dashboard/login`. ESS: `/ess/login`. Careers: `/careers`.

**Generic logins** (password `Demo@2026!`): `demo@demo.example.com` (admin), `hr.demo@demo.example.com`, `employee@demo.example.com`.

## Demo contexts

Switch branding and database content for different sales leads. For **live switching in one database** (entity switcher lists all contexts), use `demo:reseed:all-contexts` instead.

| Command | Effect |
|---------|--------|
| `npm run demo:reseed:all-contexts` | Seed **all** packs — switch via top-bar entity switcher |
| `npm run demo:context -- <name>` | Merge `deployments/<name>.env` into `.env.local` |
| `npm run demo:reseed:generic` | Generic / Demo Corporation |
| `npm run demo:reseed:petroleum-retail` | Petroleum retail (Stabex-style pack) |

Full runbook: [`docs/DEMO-CONTEXTS.md`](./docs/DEMO-CONTEXTS.md).

## Useful scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run seed:demo` | Core demo seed (`DEMO_PACK` from env) |
| `npm run db:seed-all-demo` | Full module seed orchestrator |
| `npm run seed:production` | Minimal go-live seed for a client deployment |
| `npm run provision:check` | Validate production env before deploy |
| `npm run smoke:platform` | End-to-end smoke test for a deployment |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run db:migrate:deploy` | Apply migrations (CI / production) |

## Documentation

- [`docs/DEMO-CONTEXTS.md`](./docs/DEMO-CONTEXTS.md) — **switch demo context / seed packs for sales leads**
- [`docs/PRODUCT-MASTER-PLAN.md`](./docs/PRODUCT-MASTER-PLAN.md) — master roadmap to market-ready product
- [`docs/CLIENT-PROVISIONING.md`](./docs/CLIENT-PROVISIONING.md) — provision a dedicated client instance
- [`docs/RELEASE-PROCESS.md`](./docs/RELEASE-PROCESS.md) — ship updates to client fleet
- [`docs/FLEET-REGISTRY.md`](./docs/FLEET-REGISTRY.md) — track client deployments
- [`docs/MODULE_AGENTS.md`](./docs/MODULE_AGENTS.md) — module ownership and parallel workstreams
- [`docs/STAFF-LEAVE.md`](./docs/STAFF-LEAVE.md) — staff leave module notes
- [`docs/RESET-AND-GO-LIVE.md`](./docs/RESET-AND-GO-LIVE.md) — reset / go-live operations
- [`docs/archive/`](./docs/archive/) — older setup and ATS notes

## License

Private / proprietary — use and distribution per your organisation’s agreement.
