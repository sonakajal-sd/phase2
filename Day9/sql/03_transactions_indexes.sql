-- transaction ticket reAssignMent 
-- Reassign ticket 1 from user 1 to user 2

BEGIN;

UPDATE tickets
SET assigne = 2
WHERE id = 1;

INSERT INTO ticket_history
(id, ticket_id, old_assignee, new_assignee)
VALUES
(2, 1, 1, 2);

INSERT INTO comments
(id, ticket_id, comment)
VALUES
(2, 1, 'System: Ticket reassigned from user 1 to user 2');

COMMIT;



-- Rollback demonstration

-- Demonstrate rollback when an operation fails

BEGIN;

UPDATE tickets
SET assigne = 3
WHERE id = 1;

INSERT INTO ticket_history
(id, ticket_id, old_assignee, new_assignee)
VALUES
(3, 1, 2, 3);

-- Deliberate failure
INSERT INTO ticket_history
(id, ticket_id, old_assignee, new_assignee)
VALUES
(3, 1, 2, 3);

ROLLBACK;


-- index comaparion

-- Search query before index

EXPLAIN ANALYZE
SELECT *
FROM tickets
WHERE status = 'open';

-- Create index because the query filters by status

CREATE INDEX idx_tickets_status
ON tickets(status);

-- Search query after index

EXPLAIN ANALYZE
SELECT *
FROM tickets
WHERE status = 'open';

-- stretch -composite index


-- Composite index for queries filtering by status and assignee

CREATE INDEX idx_tickets_status_assignee
ON tickets(status, assigne);