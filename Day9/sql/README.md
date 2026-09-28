# Day 9: Transactions and Indexes

## Goal

Use transactions to protect multi-step operations and indexes to improve query performance.

## Topics Covered

- BEGIN
- COMMIT
- ROLLBACK
- Atomic transactions
- Transaction failure and rollback
- EXPLAIN
- EXPLAIN ANALYZE
- Indexes
- Composite indexes

## Transaction Task

The ticket reassignment operation contains three steps:

1. Update the ticket assignee.
2. Insert a record into ticket history.
3. Insert a system comment.

These operations are handled inside a single transaction.

If all operations succeed, `COMMIT` saves the changes.

If any operation fails, `ROLLBACK` cancels all changes made in that transaction.

## Rollback Test

A deliberate failure was introduced inside a transaction.

The transaction was rolled back, so the previous successful data remained unchanged.

This demonstrates the all-or-nothing behavior of a transaction.

## Index Task

The following query searches tickets based on status:

```sql
SELECT *
FROM tickets
WHERE status = 'open';