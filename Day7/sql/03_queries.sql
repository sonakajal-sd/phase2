-- Day7 crud queries and constraint test

SELECT *
FROM tickets
WHERE status = 'open';

SELECT * FROM tickets WHERE priority='high';
SELECT * FROM tickets WHERE priority='high';

SELECT * FROM tickets ORDER BY id DESC;
SELECT * FROM tickets ORDER BY id ASC;

SELECT * FROM tickets ORDER BY DESC LIMIT 2;

UPDATE tickets SET status='closed' WHERE id=1;

DELETE FROM tickets WHERE id=3;

-- To check
INSERT INTO tickets
(id, customer_id, category_id, title, description, priority, status)
VALUES
(6, 1, 1, 'Test invalid priority', 'Testing CHECK constraint', 'urgent', 'open');

-- unique constraint 
INSERT INTO users (id, name, email)
VALUES (4, 'Vijay', 'arun@company.com');

-- Combine WHERE + ORDER BY + LIMIT
SELECT *
FROM tickets
WHERE status = 'open'
  AND priority = 'high'
ORDER BY id DESC
LIMIT 2;