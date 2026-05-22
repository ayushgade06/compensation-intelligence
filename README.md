# Compensation Intelligence System

Structured compensation intelligence for normalized company, role, level, and location comparisons.

This is not a salary listing website. Submissions are normalized into comparison bands so companies can be compared consistently across role, level, and geography.

## Architecture

The app uses Next.js App Router route handlers as a small backend-for-frontend API layer.

```text
app/
  api/              Request parsing and HTTP responses
  browse/           Browse UI
  compare/          Company comparison UI
components/         Minimal client-side UI islands
lib/
  db/               Prisma client
  errors/           Shared API response and error handling
  utils/            Pure normalization and compensation math
  validators/       Zod schemas for body, query, and params
prisma/
  schema.prisma     Existing normalized schema
  seed.ts           Realistic seed data
```

For this project size, the routes remain the primary orchestration layer. A larger service/repository split was avoided because it would add indirection without improving the assignment outcome.

## Schema

Core entities:

- `Company`: canonical company plus `normalized_name` and `slug`.
- `Role`: normalized job role and optional category.
- `Level`: comparison band with stable `code` and numeric `order`.
- `Location`: city, state, country, and normalized key.
- `Compensation`: base, bonus, stock, calculated total compensation, currency, verification flag, and relations.

Levels are intentionally normalized comparison bands. They should not be redesigned into company-specific ladders for this MVP.

## Normalization

Company names are lowercased, stripped of common suffixes, and reduced to alphanumeric keys. Locations are normalized from city, state, and country. Currency is uppercased during ingestion.

Duplicate compensation submissions are rejected for the same company, role, level, location, and currency combination.

## API Response Format

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

## API Docs

- `POST /api/compensation`: create a normalized compensation submission. Validates role and level existence, defaults bonus and stock to `0`, calculates total compensation, and rejects duplicates.
- `GET /api/compensation`: browse submissions with `company`, `role`, `location`, `min_tc`, `max_tc`, `page`, and `limit`.
- `GET /api/compensation/:id`: fetch one submission.
- `PATCH /api/compensation/:id/verify`: mark a submission verified.
- `GET /api/compare?companies=Google,Meta`: compare company average TC, max TC, min TC, and submission count.
- `GET /api/leaderboard?metric=avg|max|submissions`: ranked company summaries.
- `GET /api/analytics`: aggregate submission, currency, and level distribution data.
- `GET /api/companies`: company-level aggregate summaries.
- `GET /api/roles`, `GET /api/levels`, `GET /api/locations`: lookup data.

## Frontend

Pages:

- `/`: compensation submission form and recent submissions.
- `/browse`: filters, compensation table, and pagination.
- `/compare`: two company selectors and comparison summary.

The UI uses TailwindCSS only. There are no charts, dashboards, auth flows, global state libraries, or data-fetching libraries.

## Setup

```bash
npm install
npm run dev
```

Required environment:

```bash
DATABASE_URL="postgresql://..."
```

Seed data:

```bash
npx prisma db seed
```

## Verification

```bash
npm run lint
npm run build
```

Manual smoke checks:

- Create a compensation submission from `/`.
- Confirm duplicate submission returns `409`.
- Browse `/browse` and test pagination/filtering.
- Compare two companies at `/compare`.
- Call `GET /api/analytics`.
- Call `PATCH /api/compensation/:id/verify`.

## Deployment

Deploy on Vercel with `DATABASE_URL` configured for Neon. Prisma migrations are already present and should be applied before production traffic.

```bash
npx prisma migrate deploy
npm run build
```

## Tradeoffs

- Routes still contain orchestration logic because the codebase is small and readable.
- Error handling and validation were centralized because they materially improve reliability.
- The frontend is intentionally minimal so backend correctness remains the focus.
- No schema changes were made.

## Future Work

- Add role, level, and location filters to compare and analytics.
- Add admin-only verification workflow if auth becomes in scope.
- Add response caching for read-heavy aggregate endpoints.
- Add focused integration tests for API routes.
