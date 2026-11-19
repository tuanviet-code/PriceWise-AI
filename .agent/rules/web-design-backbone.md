---
description: PriceWise AI frontend rules for Next.js App Router, React, TypeScript, and Tailwind files.
globs: "**/*.{tsx,ts,css}"
trigger: always_on
---

# PriceWise Frontend Rule

Use for files under `frontend/`.

## Architecture

```text
Routes and layouts: frontend/src/app
Feature code: frontend/src/features/{feature}
Shared UI: frontend/src/shared/ui
Shared technical code: frontend/src/shared/{lib,config,hooks,api}
Generated OpenAPI types: frontend/src/shared/api/schema.d.ts
```

Dependency direction is `app -> features -> shared`. Cross-feature access must use a feature public API when one exists. Do not put domain logic in `shared` and do not hand-edit generated OpenAPI types.

Read `frontend/AGENTS.md` before Next.js work and consult the installed Next.js 16 documentation when an API or convention may have changed.

## UI Direction

PriceWise is a Vietnamese financial intelligence product, not a trading terminal, brokerage, crypto dashboard, or marketing landing page.

Prefer:

```text
Source and timestamp beside market values
Explicit units, product, region, and comparison period
Scannable tables and restrained charts
Good stale, partial, unavailable, loading, empty, and error states
Accessible forms and keyboard interactions
Vietnamese copy with correct diacritics
Tabular numerals for financial values
```

Avoid:

```text
Unlabelled sample data or invented market facts
Color as the only signal for increase/decrease
Predictions presented as guarantees or financial advice
Decorative gradients, glow, excessive glass effects, or cards inside cards
Client Components when a Server Component is sufficient
Hardcoded API data after a real endpoint exists
```

## Quality Checklist

Before finishing frontend work:

```text
No implicit or unjustified `any`.
API paths and generated types match the backend contract.
Freshness, source, unit, and sample-data status are truthful.
Unauthorized/error/loading/empty/stale states are handled where relevant.
Mobile layout and financial tables do not cause accidental page overflow.
Interactive controls have labels and visible focus states.
Reuse `shared/ui` before adding primitives.
Run `pnpm lint`, `pnpm exec tsc --noEmit`, relevant tests, and `pnpm build` when practical.
```
