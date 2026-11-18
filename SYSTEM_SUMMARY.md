# AGENTS.md — Smart Price Intelligence Platform

> This document is the primary project context and working agreement for AI coding agents.
> Read it before inspecting, planning, modifying, or generating code.
> Keep this document aligned with the actual repository as the project evolves.

---

## 1. Project Overview

**Project name:** Smart Price Intelligence Platform  
**Suggested product name:** PriceWise AI  
**Tagline:** Understand market movements. Make smarter decisions.

Smart Price Intelligence Platform is a full-stack fintech analytics application for users in Vietnam. It helps users monitor gold and fuel prices, explore historical price movements, understand market data, receive transparent data-driven recommendations, and configure price alerts.

The platform is an **informational and decision-support product**. It is not a brokerage, trading, payment, or transaction-execution platform.

### Core product goals

1. Collect and present reliable gold and fuel price data.
2. Preserve historical price records for analysis.
3. Make price movements understandable through charts, metrics, and comparisons.
4. Generate explainable recommendations using deterministic rules and available evidence.
5. Notify users when configured price conditions are met.
6. Provide AI-assisted explanations based on structured, verified application data.
7. Establish a maintainable foundation that can evolve as the product grows.

### Target users

- Vietnamese individuals monitoring gold prices.
- Consumers tracking fuel prices and estimating fuel expenses.
- Users who want understandable market information without needing advanced financial knowledge.
- Users who want configurable alerts when a price reaches a chosen threshold.

### Product principles

- Data credibility is more important than displaying more numbers.
- Every displayed market value should have a source and relevant timestamp when available.
- Never present stale or incomplete data as real-time data.
- Recommendations must be explainable and must communicate limitations.
- Use normal application code for deterministic calculations; do not use an LLM as a calculator.
- Do not claim guaranteed profit, guaranteed predictions, or professional financial advice.
- Prefer a small, working, tested feature over a large, unfinished implementation.

---

## 2. Current Project Status and Truthfulness Rules

This repository may initially contain only documentation and scaffolding. The feature list in this file describes the **target product**, not proof that a feature already exists.

Before making changes:

1. Inspect the actual repository structure.
2. Read the existing README, build files, source code, migrations, tests, and configuration.
3. Identify what is implemented, partially implemented, planned, or missing.
4. Do not claim that a feature, endpoint, integration, deployment, or test exists unless it is present and verified.
5. Do not replace working implementation merely to match an example in this document.
6. If the actual codebase conflicts with this document, explain the conflict and propose a minimal, safe resolution.

Use these status labels in plans and documentation:

- **Implemented:** present in code and verified by relevant tests or manual validation.
- **In progress:** implementation has started but is incomplete.
- **Planned:** part of the intended product but not implemented.
- **Blocked:** cannot proceed because a dependency, decision, or data source is unavailable.

Never fabricate live market data, API responses, screenshots, test results, or deployment status.

---

## 3. Product Scope and Functional Requirements

The following modules describe the intended product. Implement them incrementally according to the roadmap in Section 5.

### 3.1 Market Overview Dashboard

Purpose: Give users a quick, trustworthy summary of the latest available market information.

Target capabilities:

- Display latest available gold prices.
- Display latest available fuel prices.
- Show buying and selling prices when the source provides both.
- Show absolute and percentage changes against a clearly defined comparison period.
- Display historical price charts.
- Show last-updated timestamps and source information.
- Indicate whether data is current, stale, partial, or unavailable.
- Show recent price updates.
- Provide a concise market summary based on available data.
- Preview the latest recommendation status.
- Provide shortcuts to gold analytics, fuel analytics, and alerts.

UX requirements:

- Users should understand the market snapshot quickly.
- Never hide data freshness information.
- Clearly label the comparison period, such as previous record, previous day, or previous adjustment.
- Do not compare incompatible products, regions, sources, or time periods.

### 3.2 Gold Price Module

Purpose: Store, retrieve, compare, and analyze gold prices.

Target capabilities:

- Maintain supported gold product types, such as SJC gold bars or gold rings, depending on source availability.
- Store buying and selling prices where available.
- Store source and effective time for each price observation.
- Retrieve the latest available price for a product.
- Retrieve historical prices over a requested period.
- Calculate absolute price changes.
- Calculate percentage changes.
- Calculate buying-selling spread when both values are available.
- Compare products only when their units, definitions, and sources make the comparison meaningful.
- Support filters by product, source, region, and time range when the underlying data supports them.
- Allow users to create price alerts for supported products.

Important rules:

- Do not assume every provider publishes both buying and selling prices.
- Do not assume all gold products are interchangeable.
- Store monetary values using decimal/numeric types, never floating-point types.
- Preserve the original source value and normalized value when useful for auditability.
- Do not invent missing observations.

### 3.3 Fuel Price Module

Purpose: Track fuel prices and historical price adjustments in Vietnam.

Target capabilities:

- Maintain supported fuel types, such as RON 95 and E5 RON 92, based on available data.
- Store price per liter and its currency/unit.
- Store source, publication time, and effective time.
- Retrieve the latest applicable price.
- Retrieve historical price adjustments.
- Calculate absolute and percentage changes against a clearly defined previous record.
- Compare fuel types when meaningful.
- Provide a fuel-cost calculator.

Fuel-cost calculator inputs:

- Fuel type.
- Estimated quantity in liters.
- Current selected price.
- Optional hypothetical alternative price.

Calculator outputs:

- Estimated cost under the selected price.
- Estimated cost under the alternative scenario.
- Difference between scenarios.

Important rules:

- Clearly distinguish an official published price from a hypothetical scenario.
- Do not state that a future price change is confirmed unless a reliable source confirms it.
- Label the unit, normally VND/liter.
- Do not silently mix prices with different effective dates or geographic applicability.

### 3.4 Market Data and Ingestion Module

Purpose: Import external market observations into a consistent internal data model.

Target pipeline:

1. Fetch data from a configured source.
2. Record ingestion execution metadata.
3. Validate source payloads.
4. Normalize product identifiers, units, currencies, and timestamps.
5. Detect duplicates.
6. Persist valid observations.
7. Record rejected or failed records with reasons.
8. Make accepted data available to analytics and APIs.

Target capabilities:

- Configurable data-source adapters.
- Scheduled ingestion jobs.
- Manual ingestion trigger for authorized administrators, if required.
- Request timeout and retry policies.
- Duplicate prevention and idempotent processing.
- Ingestion run history.
- Source health and failure visibility.
- Detection of stale or incomplete data.

Data provenance fields should be considered for each observation:

- Source identifier.
- Source record/reference identifier, if available.
- Fetched timestamp.
- Published timestamp, if available.
- Effective timestamp, if available.
- Created/persisted timestamp.
- Validation status or ingestion run reference.

Important rules:

- Respect source terms, rate limits, and access policies.
- Prefer official or otherwise reputable sources.
- Do not scrape or bypass access controls.
- Do not assume a source is reliable merely because it is accessible.
- Keep source-specific parsing inside an adapter; do not spread parsing logic through domain services.
- Make ingestion safe to rerun.
- Never overwrite historical observations without an explicit correction policy and audit trail.

### 3.5 Analytics Module

Purpose: Calculate descriptive metrics from stored, validated data.

Potential capabilities:

- Latest available price.
- Absolute price change.
- Percentage price change.
- Historical high and low within a selected period.
- Average price over a selected period.
- Buying-selling spread, where applicable.
- Fuel cost estimates.
- Trend summaries based on defined calculations.

Important rules:

- Define formulas and comparison windows explicitly.
- Handle missing values and zero denominators safely.
- Use decimal arithmetic for monetary calculations.
- Keep calculation logic deterministic and unit-testable.
- Do not label descriptive statistics as predictions.
- Do not imply causation from simple historical correlation.

### 3.6 Recommendation Module

Purpose: Generate transparent, evidence-based informational recommendations.

Initial recommendation statuses:

- `WATCH` — Theo dõi.
- `CONSIDER` — Cân nhắc.
- `INSUFFICIENT_DATA` — Chưa đủ dữ liệu.

The exact business rules must be documented before implementation. Do not invent arbitrary thresholds and present them as validated financial rules.

Each recommendation should be traceable to:

- Product or asset category.
- Recommendation status.
- Generation timestamp.
- Observation period.
- Input data references or metrics.
- Rule identifier and rule version.
- Explanation.
- Risks, assumptions, and limitations.
- Optional model identifier/version if a validated predictive model is later used.

Requirements:

- Start with deterministic, explainable business rules.
- Store recommendation evidence separately when useful.
- Make rule evaluation independently testable.
- Return `INSUFFICIENT_DATA` when required inputs are missing or stale.
- Do not generate unsupported confidence percentages.
- Do not promise returns or guaranteed outcomes.
- Do not let an LLM invent prices, metrics, sources, or historical facts.
- If an LLM explains a recommendation, provide it with structured evidence from the application and clearly separate generated explanation from verified data.

### 3.7 AI Integration (Later Phase)

AI is an enhancement, not a prerequisite for the core product.

Potential capabilities:

- Explain a recommendation using verified structured metrics.
- Summarize historical movements.
- Answer user questions about data already available in the platform.
- Provide natural-language explanations of calculations and limitations.

Possible later architecture:

- Python and FastAPI as a separately deployable AI service.
- LLM provider accessed through a server-side integration.
- Optional ML models for forecasting only after baseline evaluation.
- Optional retrieval system only if the application needs to search a meaningful document collection.

Rules:

- Never expose AI provider keys in frontend code.
- Never use an LLM for arithmetic that can be performed deterministically.
- Validate and constrain AI input/output.
- Treat model output as untrusted until validated.
- Do not send unnecessary personal or sensitive data to an external AI provider.
- Log model/provider/version metadata where appropriate, without logging secrets.
- Evaluate AI outputs with test cases before relying on them in user-facing recommendations.
- Do not introduce vector databases, agents, fine-tuning, or microservices without a concrete requirement.

### 3.8 Price Alert Module

Purpose: Let users configure conditions for price notifications.

Target capabilities:

- Create an alert for a supported product.
- Configure an above or below threshold.
- Optionally support percentage-change conditions.
- List active, paused, triggered, and expired alerts.
- Update, pause, resume, or delete alerts.
- Record when an alert was evaluated and triggered.
- Avoid repeatedly sending duplicate notifications for the same trigger condition.
- Keep an alert evaluation history where useful.

Requirements:

- Validate threshold values and product compatibility.
- Define alert evaluation behavior when data is stale or unavailable.
- Make evaluation idempotent.
- Do not send notifications before the triggering condition is verified.
- Enforce user ownership and authorization for every alert operation.

### 3.9 Notification Module

Potential channels:

- In-app notifications initially.
- Email or other channels only when explicitly implemented and configured.

Target capabilities:

- Create notification records.
- List notifications for the authenticated user.
- Mark notifications as read.
- Support pagination and filtering.
- Store notification type, content, creation time, and read state.
- Avoid exposing one user's notifications to another user.

### 3.10 Personal Portfolio Module (Later Phase)

Purpose: Let users record assets they personally own.

Potential capabilities:

- Create and manage a portfolio.
- Record user-entered gold holdings.
- Record purchase date, quantity, and purchase price.
- Estimate current value using a selected available market price.
- Calculate estimated unrealized gain/loss.
- Show holding history and allocation.

Rules:

- User-entered purchase data must remain distinguishable from external market data.
- State which market price is used for valuation.
- Explain assumptions, fees, spreads, and limitations where relevant.
- Enforce strict user-level data isolation.
- Do not imply the platform holds assets or executes transactions.

### 3.11 Identity and Security Module

Introduce authentication when user-specific features require it.

Potential capabilities:

- Registration and login.
- Secure password storage.
- Authentication and authorization.
- JWT-based access, and refresh-token handling if required.
- User profile management.
- Role-based access for administrative operations.
- Password recovery if included in scope.

Rules:

- Never store plaintext passwords.
- Never commit credentials, tokens, private keys, or production secrets.
- Validate authorization on the backend, not only in the frontend.
- Apply ownership checks to user-specific resources.
- Avoid logging passwords, tokens, or sensitive personal information.
- Use secure cookie/token handling appropriate to the chosen authentication design.

---

## 4. Technology and Architecture

### Intended technology stack

| Layer | Preferred technology |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| UI components | shadcn/ui or accessible equivalents |
| Charts | Recharts or equivalent |
| Backend | Java, Spring Boot |
| API | REST, JSON |
| Persistence | Spring Data JPA, Hibernate |
| Database | PostgreSQL |
| Database hosting | Supabase PostgreSQL |
| Migrations | Flyway |
| Security | Spring Security, JWT when needed |
| Optional AI service | Python, FastAPI |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Frontend hosting | Vercel |
| Backend hosting | Render |

Before adding or upgrading a dependency, inspect the existing build files and project conventions. Do not upgrade major framework versions without a clear reason and explicit compatibility review.

### Initial architecture: Modular Monolith

Start with a modular monolith. Do not split the application into microservices merely to make the architecture look more advanced.

Suggested backend module boundaries:

- `identity`
- `gold`
- `fuel`
- `marketdata`
- `analytics`
- `recommendation`
- `alert`
- `notification`
- `portfolio`
- `aiintegration`
- `admin` (only if needed)

Within a module, use layers appropriate to its complexity:

- `api` — controllers and request/response DTOs.
- `application` — use cases and orchestration.
- `domain` — business rules and domain models.
- `infrastructure` — persistence, external clients, and adapters.

Do not create empty abstractions or excessive layers for trivial features. Keep the architecture understandable and proportional to the actual code.

### Module boundary rules

- A module owns its business logic and persistence behavior.
- Do not access another module's repository directly.
- Communicate through application services, interfaces, or explicit contracts.
- Avoid circular dependencies.
- Keep external provider details out of domain logic.
- Use events only when they solve a real decoupling or workflow problem.
- Document important architectural decisions in `docs/adr/`.

### Future service extraction

A module may become a separate service only when there is a practical reason, such as independent scaling, deployment, ownership, or runtime requirements.

If extraction becomes necessary:

- Define a stable API or event contract.
- Define data ownership.
- Avoid shared database table ownership across services.
- Handle network failures and retries.
- Add tracing and operational visibility.
- Consider eventual consistency explicitly.

---

## 5. Recommended Implementation Roadmap

Work in small, verifiable increments. Reassess the repository before selecting the next task.

### Phase 0 — Repository Foundation

- Establish repository structure.
- Add project documentation.
- Define coding conventions.
- Set up backend and frontend scaffolding.
- Configure environment examples.
- Add local development instructions.
- Add basic CI checks.

**Exit criteria:** The project can be cloned, configured, built, and started locally according to documented instructions.

### Phase 1 — Backend Foundation

- Create the Spring Boot application.
- Configure PostgreSQL connectivity.
- Configure Flyway.
- Establish API versioning and error response conventions.
- Add health endpoint.
- Add initial tests.
- Establish module package structure.

**Exit criteria:** Backend starts reliably, connects to the database, applies migrations, and passes baseline tests.

### Phase 2 — Core Market Data

- Define gold and fuel product models.
- Define price observation models.
- Define source and ingestion-run models.
- Implement repositories and application services.
- Add latest-price and historical-price APIs.
- Add validation and duplicate prevention.

**Exit criteria:** The backend can store and retrieve validated sample or sourced market observations.

### Phase 3 — Data Ingestion

- Select and document initial data sources.
- Implement source adapters.
- Add normalization and validation.
- Add scheduled ingestion where appropriate.
- Add retry, timeout, and failure logging.
- Add ingestion history.

**Exit criteria:** Ingestion can be run repeatedly without creating unintended duplicates, and failures are observable.

### Phase 4 — Frontend MVP

- Establish the application shell and navigation.
- Build the market overview dashboard.
- Build gold analytics.
- Build fuel analytics.
- Integrate the frontend with backend APIs.
- Add loading, empty, error, partial-data, and stale-data states.

**Exit criteria:** Users can navigate the core pages and see API-backed market data with clear freshness information.

### Phase 5 — Analytics and Rule-Based Recommendations

- Define and document initial metrics.
- Implement deterministic calculations.
- Define recommendation rules and versions.
- Store recommendation evidence.
- Expose recommendation APIs.
- Add unit and integration tests.

**Exit criteria:** Recommendation results are reproducible, explainable, and testable.

### Phase 6 — Alerts and Notifications

- Add alert persistence and APIs.
- Implement alert evaluation.
- Prevent duplicate triggers.
- Add in-app notifications.
- Add frontend management screens.

**Exit criteria:** A user can configure an alert and see a notification when a verified condition is met.

### Phase 7 — AI-Assisted Insights

- Define the AI use case and input contract.
- Integrate an AI provider server-side or introduce a separate service if justified.
- Provide only verified structured evidence to the model.
- Validate generated output.
- Add evaluation examples and failure handling.
- Clearly label AI-generated explanations.

**Exit criteria:** AI explanations are grounded in application data and do not replace deterministic calculations.

### Phase 8 — Hardening and Deployment

- Review authentication and authorization.
- Improve test coverage for critical business rules.
- Add Docker configuration.
- Add CI/CD.
- Configure deployment environments and secrets.
- Add logging and health checks.
- Document deployment and operational limitations.

**Exit criteria:** The implemented MVP can be deployed reproducibly and its operational state can be inspected.

### Later enhancements

- Personal portfolio.
- ML-based forecasting after baseline evaluation.
- More data providers.
- Advanced analytics.
- Additional notification channels.
- Service extraction only when justified.

---

## 6. API Conventions

Use versioned routes under `/api/v1`.

Illustrative endpoint names:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/v1/gold/products` | List supported gold products |
| GET | `/api/v1/gold/prices/latest` | Retrieve latest gold prices |
| GET | `/api/v1/gold/prices/history` | Retrieve gold price history |
| GET | `/api/v1/fuel/products` | List supported fuel products |
| GET | `/api/v1/fuel/prices/latest` | Retrieve latest fuel prices |
| GET | `/api/v1/fuel/prices/history` | Retrieve fuel price history |
| GET | `/api/v1/analytics/overview` | Retrieve market overview |
| GET | `/api/v1/recommendations/latest` | Retrieve latest recommendations |
| GET | `/api/v1/recommendations/{id}` | Retrieve recommendation details |
| GET | `/api/v1/alerts` | List current user's alerts |
| POST | `/api/v1/alerts` | Create an alert |
| PUT | `/api/v1/alerts/{id}` | Update an alert |
| DELETE | `/api/v1/alerts/{id}` | Delete an alert |
| GET | `/api/v1/notifications` | List current user's notifications |

These are proposed contracts, not proof that endpoints already exist. Inspect current code before implementing or renaming routes.

### API rules

- Use appropriate HTTP methods and status codes.
- Validate request parameters and bodies.
- Use DTOs instead of exposing persistence entities.
- Define a consistent error response format.
- Support pagination for potentially large collections.
- Define filtering and sorting parameters explicitly.
- Use ISO-8601 timestamps with timezone information.
- Document units and currency in API contracts.
- Do not expose internal exception details or secrets.
- Enforce authentication, authorization, and resource ownership where required.

---

## 7. Database and Data Modeling Rules

- Use PostgreSQL as the primary relational database.
- Use Flyway for schema migrations.
- Store monetary values using `NUMERIC`/`DECIMAL` with an intentional precision and scale.
- Never use Java `float` or `double` for persisted financial amounts or critical financial calculations.
- Prefer `BigDecimal` for monetary calculations in Java.
- Use timezone-aware timestamps for event and observation times.
- Define units and currency explicitly.
- Add indexes based on actual query patterns.
- Add unique constraints for natural idempotency keys where appropriate.
- Use foreign keys to protect referential integrity.
- Avoid destructive migrations unless explicitly required and reviewed.
- Never edit an already-applied migration in a shared or deployed environment; create a new migration instead.
- Avoid storing derived values if they can be safely calculated, unless caching or historical reproducibility requires persistence.
- Document how historical corrections are handled.

### Price observation concepts

Keep these concepts distinct:

- **Fetched time:** when the application retrieved the source data.
- **Published time:** when the source published the information, if known.
- **Effective time:** when the price becomes applicable, if known.
- **Recorded time:** when the application persisted the observation.

Do not treat these timestamps as interchangeable.

---

## 8. Frontend and UX Rules

The intended frontend is a Vietnamese-language fintech analytics dashboard.

### Primary navigation

- Tổng quan
- Giá vàng
- Giá xăng dầu
- Phân tích thị trường
- Khuyến nghị AI
- Cảnh báo giá
- Danh mục cá nhân (later phase)
- Thông báo
- Cài đặt

### Visual direction

- Professional, clean, trustworthy fintech SaaS interface.
- Dark navy/charcoal surfaces with restrained emerald and gold accents.
- Readable charts, tables, and financial numbers.
- Clear hierarchy and consistent spacing.
- Responsive desktop, tablet, and mobile layouts.
- Accessible contrast and visible keyboard focus.

### UX requirements

Every data-driven screen should consider:

- Loading state.
- Empty state.
- Error state.
- Stale-data state.
- Partial-data state.
- Success state for user actions.

Additional rules:

- Format VND consistently.
- Label units such as VND, VND/liter, grams, or other supported units.
- Use tabular numerals for price displays.
- Do not use color as the only way to communicate increase/decrease/status.
- Do not display fake live data in production.
- Keep mock data clearly separated from production API data.
- Preserve user input when a request fails where practical.
- Make interactive controls keyboard-accessible.
- Avoid decorative controls that do not perform an action.

---

## 9. Coding Standards

### General

- Follow the conventions already present in the repository.
- Prefer readable, maintainable code over clever or overly compact code.
- Use meaningful names for classes, methods, variables, and components.
- Keep functions focused on one responsibility.
- Avoid unnecessary abstractions and premature optimization.
- Do not duplicate business rules across controllers and frontend components.
- Keep configuration outside source code.
- Add comments to explain non-obvious decisions, not to narrate every line.
- Do not introduce a dependency when the existing stack already solves the problem adequately.

### Java and Spring Boot

- Use constructor injection.
- Keep controllers thin.
- Put business rules in application/domain services, not controllers.
- Use request and response DTOs.
- Validate inputs at API boundaries.
- Use centralized exception handling.
- Use transactions at appropriate application-service boundaries.
- Use repositories for persistence access.
- Keep external API calls behind dedicated clients/adapters.
- Avoid returning JPA entities directly from controllers.
- Use `BigDecimal` for financial calculations.
- Write unit tests for business rules and integration tests for persistence/API behavior.
- Follow the Java version and Spring Boot version already configured in the project.

### TypeScript and Next.js

- Use TypeScript types for API responses and component props.
- Avoid `any`; if unavoidable, explain and constrain it.
- Keep API communication in a reusable client/service layer.
- Keep components focused and reusable.
- Separate server and client components intentionally.
- Handle loading, empty, and error states.
- Do not put secrets in `NEXT_PUBLIC_` variables.
- Avoid duplicating backend business logic in the frontend.
- Use accessible labels and semantic elements.

### Python AI service (if introduced)

- Keep provider integration behind a service abstraction.
- Validate request and response schemas.
- Keep secrets in environment configuration.
- Add tests for deterministic preprocessing and output validation.
- Do not treat model output as trusted application data.
- Keep AI service dependencies separate from the Java backend.

---

## 10. Security and Privacy

Security is required even for a personal portfolio project.

- Never commit `.env` files or secrets.
- Provide `.env.example` files with placeholders only.
- Validate and sanitize user input.
- Enforce backend authorization for protected operations.
- Enforce ownership checks on user-specific data.
- Hash passwords using an appropriate password-hashing algorithm.
- Do not log passwords, access tokens, refresh tokens, or API keys.
- Use HTTPS in deployed environments.
- Configure CORS narrowly for known frontend origins.
- Use secure database connection settings.
- Avoid exposing database credentials or service-role keys to the browser.
- Minimize personal data collection.
- Do not send unnecessary personal information to external AI services.
- Review dependency vulnerabilities and update dependencies deliberately.

---

## 11. Testing and Quality Gates

Before declaring a task complete, run the relevant checks available in the repository.

### Backend checks

- Compile/build.
- Unit tests.
- Integration tests where available.
- Migration validation.
- API validation.
- Critical business-rule tests.

### Frontend checks

- Type checking.
- Linting.
- Build.
- Component or integration tests where available.
- Manual responsive and interaction checks where relevant.

### Critical domain cases

Always consider tests for:

- Missing or stale price data.
- Duplicate ingestion.
- Invalid source payload.
- Different effective dates.
- Zero denominator in percentage calculations.
- Decimal precision and rounding.
- Missing buying or selling price.
- Unsupported product.
- Invalid alert threshold.
- Repeated alert evaluation.
- User accessing another user's resource.
- AI provider timeout or malformed response.

Never say tests passed unless they were actually run and the result was observed. If a check cannot be run, state why.

---

## 12. Git and Change Management

- Make focused changes.
- Avoid unrelated refactoring in feature tasks.
- Use descriptive commit messages.
- Do not rewrite shared Git history unless explicitly requested.
- Do not force-push unless explicitly authorized.
- Do not commit generated build output, local databases, credentials, or IDE-specific files unless intentionally required.
- Update documentation when changing architecture, APIs, environment variables, setup steps, or behavior.
- Keep migrations and code changes consistent.
- Review `git diff` before finishing.

Suggested commit message format:

- `feat: add gold price history API`
- `fix: prevent duplicate fuel price ingestion`
- `test: cover recommendation rule boundaries`
- `docs: update local development instructions`
- `refactor: isolate external market data client`

---

## 13. Required AI Agent Workflow

For every task, follow this process.

### Step 1 — Understand

- Read this file.
- Inspect relevant source files and project conventions.
- Check current Git status.
- Identify existing implementation and dependencies.
- Do not assume the repository matches the planned structure.

### Step 2 — Clarify Scope Internally

Summarize:

- The requested outcome.
- Relevant modules and files.
- Dependencies or risks.
- Acceptance criteria.
- Whether database migrations or API contract changes are required.

Ask the user a concise question only when a decision is genuinely blocking or a destructive/ambiguous change requires approval.

### Step 3 — Plan

- Propose a small implementation plan.
- Reuse existing patterns.
- Avoid changing unrelated modules.
- Consider failure, empty, stale, and invalid-data cases.
- Identify tests before coding.

For a small, clear task, a short plan is sufficient; do not create unnecessary process overhead.

### Step 4 — Implement

- Make focused changes.
- Preserve existing working behavior.
- Keep module boundaries.
- Add or update tests.
- Add migrations only when required.
- Do not silently change public API contracts.

### Step 5 — Verify

- Run relevant build, lint, type-check, and test commands.
- Inspect the final diff.
- Check for secrets, accidental files, and unrelated modifications.
- Verify documentation is consistent with the code.

### Step 6 — Report

At the end of the task, report:

1. What was implemented.
2. Important files changed.
3. Database/API/configuration changes.
4. Commands and tests executed, including actual outcomes.
5. Known limitations or remaining work.
6. Any decisions that need user approval.

Do not claim deployment, external data access, or successful integration unless verified.

---

## 14. Non-Goals and Things Agents Must Not Do

Unless explicitly requested and justified, do not:

- Turn the application into a trading or brokerage platform.
- Add payment or order execution functionality.
- Claim guaranteed investment outcomes.
- Invent market data or sources.
- Treat scraped data as official without verification.
- Use an LLM for deterministic arithmetic.
- Generate unsupported AI confidence scores.
- Add microservices before a concrete need exists.
- Add Redis, Kafka, Kubernetes, vector databases, or complex agent frameworks just for architectural appearance.
- Introduce a machine-learning forecasting model without a baseline and out-of-sample evaluation.
- Expose secrets in frontend code or repository files.
- Replace the existing framework versions without approval.
- Rewrite large parts of the application for a small feature.
- Mark planned features as implemented.
- Remove tests or weaken validation merely to make a build pass.

---

## 15. Documentation Maintenance

Keep project documentation synchronized with the implementation.

Update relevant documentation when:

- Adding or removing a feature.
- Changing module boundaries.
- Changing API contracts.
- Adding or changing environment variables.
- Adding database migrations or changing the data model.
- Changing the local setup process.
- Changing deployment architecture.
- Introducing an external data provider or AI provider.

Suggested documentation structure:

```text
docs/
├── architecture/
│   └── system-overview.md
├── api/
│   └── api-conventions.md
├── database/
│   └── data-model.md
├── data-sources/
│   └── source-register.md
└── adr/
    ├── 0001-modular-monolith.md
    └── 0002-postgresql-and-flyway.md
```

Use Architecture Decision Records (ADRs) for significant decisions. Each ADR should explain context, decision, alternatives, and consequences.

---

## 16. Definition of Done

A task is complete only when applicable conditions are satisfied:

- The requested behavior is implemented.
- Existing conventions and module boundaries are respected.
- Inputs and failure cases are handled.
- Relevant tests are added or updated.
- Relevant tests/checks have been run, or inability to run them is reported.
- No secrets or unrelated files are introduced.
- API, database, and configuration changes are documented.
- The final diff has been reviewed.
- Remaining limitations are explicitly reported.

---

## 17. Final Instruction to AI Agents

Treat this repository as a real, evolving software product rather than a code-generation exercise.

Your priorities, in order:

1. Correctness and data integrity.
2. Security and privacy.
3. Clear business behavior.
4. Maintainable architecture.
5. Testability and observability.
6. User experience.
7. Performance and optimization when supported by evidence.

When uncertain, inspect the code and documentation first. Prefer explicit assumptions and small reversible changes over guessing or large rewrites.

**Build a reliable market-data product first. Add intelligence only when the underlying data and evaluation justify it.**
