# Day 11 - Node.js with PostgreSQL

## Overview

In Day 11, the Support Ticket API from Day 5 was upgraded to use a real PostgreSQL database instead of storing ticket data in a JSON file.

The existing architecture was kept mostly unchanged by replacing only the repository layer.

### Previous Architecture

Route → Controller → Service → File Repository → JSON

### New Architecture

Route → Controller → Service → PostgreSQL Repository → PostgreSQL

---

## Today's Goal

Connect the Support Ticket API to PostgreSQL through a repository layer.

---

## What I Learned

### 1. Connecting Node.js with PostgreSQL

Used the `pg` package to connect the Node.js application with PostgreSQL.

A PostgreSQL connection pool was created using environment variables.

```ts
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});