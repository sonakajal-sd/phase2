# Day 12 – Prisma, Migrations and Seed Data

## Overview

In Day 12, the Support Ticket API from Day 11 was migrated from hand-written SQL (`pg` Pool) to **Prisma ORM**.

The layered architecture stays the same. Only the repository layer changed, so the routes, controllers and services work as before.

### Previous Architecture (Day 11)

Route → Controller → Service → Repository (raw SQL with `pg`) → PostgreSQL

### New Architecture (Day 12)

Route → Controller → Service → Repository (Prisma Client) → PostgreSQL

All schema changes now go through **versioned migrations**, so the database can be rebuilt the same way on any machine.

---

## Today's Goal

Introduce an ORM while still understanding the SQL and migrations it generates.

- Define Prisma models and relations
- Create and apply migrations
- Write a seed script
- Replace repository queries with Prisma Client
- Run tests

---

## Tech Stack

| Tool | Purpose |
| --- | --- |
| Node.js + TypeScript | Runtime and language |
| Express 5 | HTTP server |
| PostgreSQL | Database |
| Prisma 7 | ORM, migrations, seeding |
| `@prisma/adapter-pg` | Driver adapter that Prisma 7 uses to connect to PostgreSQL |
| `node:test` | Built-in test runner |
| `tsx` | Runs TypeScript directly |

---

## Folder Structure

```
Day12/
├── prisma/
│   ├── migrations/
│   │   ├── 20260930063559_init/                         # creates the Ticket table
│   │   ├── 20260930084440_add_timestamps_and_comments/  # timestamps + Comment table
│   │   └── migration_lock.toml
│   ├── schema.prisma        # data models
│   └── seed.ts              # seed script
├── src/
│   ├── controllers/ticketController.ts   # request validation + HTTP responses
│   ├── db/prisma.ts                      # single shared PrismaClient
│   ├── generated/prisma/                 # generated client (git-ignored)
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── logger.ts
│   ├── repositories/ticketRepository.ts  # all database access (Prisma)
│   ├── routes/ticketRoutes.ts
│   ├── services/ticketService.ts         # business rules
│   ├── app.ts                            # Express app (used by server + tests)
│   └── server.ts                         # starts the HTTP server
├── tests/tickets.test.ts                 # API tests
├── prisma.config.ts                      # Prisma CLI configuration
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure the database connection
cp .env.example .env
# edit DATABASE_URL in .env

# 3. Create the database schema from migrations
npm run db:migrate

# 4. Generate the Prisma Client
npm run db:generate

# 5. Load sample data
npm run db:seed

# 6. Start the API
npm run dev
```

The API runs on `http://localhost:3000`. Set `PORT` in `.env` to use a different port.

`.env` example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/day12?schema=public"
```

---

## Database Commands

Prisma 7 reads its settings from `prisma.config.ts`: the schema path, the migrations folder, the seed command and the `DATABASE_URL`.

| npm script | Prisma command | What it does |
| --- | --- | --- |
| `npm run db:generate` | `prisma generate` | Generates the typed client into `src/generated/prisma`. Run it after every schema change. |
| `npm run db:migrate` | `prisma migrate dev` | **Development only.** Compares `schema.prisma` with the database, creates a new migration if needed, applies it, and regenerates the client. |
| `npm run db:migrate -- --name <name>` | `prisma migrate dev --name <name>` | Same, with the migration name set. |
| `npm run db:migrate -- --create-only --name <name>` | `prisma migrate dev --create-only` | Creates the migration SQL **without applying it**, so it can be reviewed first. |
| `npm run db:deploy` | `prisma migrate deploy` | **Production / CI.** Applies pending migrations only. Never generates new ones and never resets data. |
| `npm run db:status` | `prisma migrate status` | Shows which migrations are applied or pending. |
| `npm run db:seed` | `prisma db seed` | Runs `prisma/seed.ts`. |
| `npm run db:reset` | `prisma migrate reset` | **Development only.** Drops the database, re-applies every migration and runs the seed again. |
| `npm run db:studio` | `prisma studio` | Opens a web UI for browsing the data. |
| – | `npx prisma validate` | Checks `schema.prisma` for errors. |
| – | `npx prisma format` | Formats `schema.prisma`. |

### Workflow for a schema change

1. Edit `prisma/schema.prisma`.
2. `npm run db:migrate -- --create-only --name describe_the_change`
3. **Review** the generated `prisma/migrations/<timestamp>_describe_the_change/migration.sql`.
4. `npm run db:migrate` to apply it.
5. Commit both `schema.prisma` and the new migration folder.
6. In production, `npm run db:deploy` applies it.

> The production schema is **never** changed by hand (no manual `ALTER TABLE`). Every change is a committed migration. This keeps every environment in sync and lets the history be replayed.

---

## Prisma Schema

```prisma
model Ticket {
  id          Int       @id @default(autoincrement())
  title       String    @db.VarChar(255)
  description String
  priority    String    @db.VarChar(20)
  status      String    @default("open") @db.VarChar(20)
  assignee    String?   @db.VarChar(100)
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @default(now()) @updatedAt @map("updated_at")
  comments    Comment[]
}

model Comment {
  id        Int      @id @default(autoincrement())
  ticketId  Int      @map("ticket_id")
  author    String   @db.VarChar(100)
  body      String
  createdAt DateTime @default(now()) @map("created_at")
  ticket    Ticket   @relation(fields: [ticketId], references: [id], onDelete: Cascade)

  @@index([ticketId])
}
```

### Relation: Ticket 1 ─── * Comment

- `Comment.ticketId` is the foreign key. `Comment.ticket` and `Ticket.comments` are the relation fields, which exist only in Prisma, not as database columns.
- `onDelete: Cascade`: deleting a ticket also deletes its comments.
- `@@index([ticketId])` speeds up "all comments for a ticket" lookups.
- `@map("created_at")` keeps camelCase in TypeScript and snake_case in the database.
- `@updatedAt`: Prisma sets this field automatically on every update.

---

## Generated Migration SQL (reviewed)

### 1. `20260930063559_init`

```sql
CREATE TABLE "Ticket" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "priority" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'open',
    "assignee" VARCHAR(100),
    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
```

What I noticed:

- `@default(autoincrement())` becomes `SERIAL`.
- `String` without `@db.*` becomes `TEXT`. `@db.VarChar(n)` becomes `VARCHAR(n)`.
- `String?` (optional) is the only column without `NOT NULL`.

### 2. `20260930084440_add_timestamps_and_comments`

```sql
ALTER TABLE "Ticket" ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "ticket_id" INTEGER NOT NULL,
    "author" VARCHAR(100) NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Comment_ticket_id_idx" ON "Comment"("ticket_id");

ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ticket_id_fkey"
  FOREIGN KEY ("ticket_id") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

What I checked before applying it (created with `--create-only`):

- **Non-destructive**: only `ADD COLUMN` and `CREATE TABLE`. No `DROP`, so existing ticket data is safe.
- `updated_at` has a `DEFAULT`. Without one, adding a `NOT NULL` column to a table with existing rows would fail.
- `@updatedAt` does **not** create a database trigger. Prisma Client sets the value, so raw SQL updates won't change it.
- `onDelete: Cascade` becomes `ON DELETE CASCADE` on the foreign key.
- `@@index` becomes a normal `CREATE INDEX`.

---

## Seed Script

`prisma/seed.ts`:

1. Deletes all tickets (comments are removed by the cascade), so the seed can be re-run safely.
2. Creates 4 tickets. Two of them get comments through a **nested write**:

```ts
await prisma.ticket.create({
  data: {
    title: "Payment failed",
    // ...
    comments: { create: [{ author: "Priya", body: "Gateway returned a timeout." }] },
  },
});
```

Run it with `npm run db:seed`. `npm run db:reset` also runs it automatically.

---

## Repository: SQL → Prisma

| Operation | Day 11 (raw SQL) | Day 12 (Prisma) |
| --- | --- | --- |
| List | `SELECT * FROM tickets ORDER BY id` | `prisma.ticket.findMany({ orderBy: { id: "asc" } })` |
| Get one | `SELECT * FROM tickets WHERE id=$1` | `prisma.ticket.findUnique({ where: { id }, include: { comments: true } })` |
| Create | `INSERT INTO tickets (...) VALUES ($1,$2,$3) RETURNING *` | `prisma.ticket.create({ data })` |
| Update status | `UPDATE tickets SET status=$1 WHERE id=$2 RETURNING *` | `prisma.ticket.update({ where: { id }, data: { status } })` |
| Update assignee | `UPDATE tickets SET assignee=$1 WHERE id=$2 RETURNING *` | `prisma.ticket.update({ where: { id }, data: { assignee } })` |
| Delete | `DELETE FROM tickets WHERE id=$1 RETURNING *` | `prisma.ticket.delete({ where: { id } })` |
| Add comment | – | `prisma.comment.create({ data: { ticketId, author, body } })` |

Differences from raw SQL:

- Queries are **type-checked**. A typo in a column name is a compile error, not a runtime error.
- `update` and `delete` **throw** error `P2025` when the row doesn't exist, where raw SQL just returns 0 rows. The repository catches `P2025` and returns `null`, so services and controllers still just check "not found".
- `include` loads related rows (comments) in the same call.
- Prisma 7 needs a **driver adapter** (`new PrismaClient({ adapter: new PrismaPg(...) })`). It no longer connects by itself.

---

## API Endpoints

| Method | Endpoint | Body | Description |
| --- | --- | --- | --- |
| GET | `/tickets` | – | List all tickets |
| GET | `/tickets/:id` | – | Get a ticket with its comments |
| POST | `/tickets` | `{ title, description, priority? }` | Create a ticket (`priority` defaults to `medium`) |
| PATCH | `/tickets/:id/status` | `{ status }` | Update status |
| PATCH | `/tickets/:id/assignee` | `{ assignee }` | Assign a ticket |
| DELETE | `/tickets/:id` | – | Delete a ticket (and its comments) |
| GET | `/tickets/:id/comments` | – | List comments of a ticket |
| POST | `/tickets/:id/comments` | `{ author, body }` | Add a comment |

Allowed values:

- `priority`: `low`, `medium`, `high`
- `status`: `open`, `in_progress`, `resolved`, `closed`

Status codes: `200` OK, `201` created, `204` deleted, `400` invalid input, `404` not found, `500` server error.

Example:

```bash
curl -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"title":"VPN down","description":"Cannot connect to VPN","priority":"high"}'
```

---

## Tests

```bash
npm test         # API tests (node:test), against the database in DATABASE_URL
npm run typecheck
```

The tests start the Express app on a random port and call every endpoint over HTTP: success cases, validation errors and 404s. They also check that deleting a ticket removes its comments. Each test creates its own tickets and deletes them at the end, so the seed data is left untouched.

---

## What I Learned

- **Prisma schema** is the single source of truth for models, column types, defaults and relations.
- **Migrations** are plain SQL files committed to git. `migrate dev` is for development and `migrate deploy` is for production.
- Always **review the generated SQL** (`--create-only`) before applying it, especially for drops, renames and new `NOT NULL` columns.
- **Relations** are declared with `@relation`. The foreign key column, the index and the cascade behaviour are all visible in the migration SQL.
- **Seed scripts** give every developer the same starting data and can be re-run safely.
- Prisma returns typed results and replaces hand-written SQL, but knowing the SQL it generates is still essential.
