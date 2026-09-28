-- Ticket count by status and assignee.

SELECT users.name, status ,COUNT(tickets.id) AS count 
FROM tickets
JOIN users ON tickets.assigne = users.id
GROUP BY users.name ,status;

-- Customers with more than five open tickets.

SELECT customers.name AS Customers ,COUNT(customer_id) as StatusCount 
FROM tickets
JOIN customers ON customer_id=customers.id
WHERE status='open'
GROUP BY customers.name
HAVING COUNT(*)>5;

-- Users with no assigned tickets.
SELECT users.name , COUNT(tickets.assigne)
FROM users
LEFT JOIN tickets ON users.id =tickets.assigne
WHERE tickets.id IS NULL
GROUP BY users;

-- Customer name + their ticket title
SELECT customers.name ,tickets.title
FROM customers
JOIN tickets ON customers.id= tickets.customer_id;

SELECT customers.name , tickets.title
FROM customers
JOIN tickets ON customers.id=tickets.customer_id

SELECT customers.name,tickets.title
FROM customers
FULL OUTER JOIN tickets
ON customers.id= tickets.customer_id;

SELECT COUNT(*) FROM tickets;
SELECT COUNT(id) FROM tickets;


SELECT customers.name
FROM customers
LEFT JOIN tickets
ON customers.id = tickets.customer_id
WHERE tickets.id IS NULL;