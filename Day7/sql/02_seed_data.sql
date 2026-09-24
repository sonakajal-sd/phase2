--sample data

-- Users
INSERT INTO users (id, name, email)
VALUES
(1, 'Arun', 'arun@company.com'),
(2, 'Priya', 'priya@company.com'),
(3, 'Rahul', 'rahul@company.com');


-- Customers
INSERT INTO customers (id, name, email)
VALUES
(1, 'Karthik', 'karthik@gmail.com'),
(2, 'Meena', 'meena@gmail.com'),
(3, 'Suresh', 'suresh@gmail.com'),
(4, 'Divya', 'divya@gmail.com');


-- Categories
INSERT INTO categories (id, name)
VALUES
(1, 'Technical'),
(2, 'Billing'),
(3, 'Account'),
(4, 'Payment');


-- Tickets
INSERT INTO tickets
(id, customer_id, category_id, title, description, priority, status)
VALUES
(1, 1, 1, 'Login not working',
 'Customer cannot login to the account',
 'high', 'open'),

(2, 2, 2, 'Wrong amount charged',
 'Customer was charged an incorrect amount',
 'medium', 'open'),

(3, 3, 3, 'Update email address',
 'Customer wants to change registered email',
 'low', 'open'),

(4, 4, 4, 'Payment failed',
 'Payment transaction is failing',
 'high', 'open'),

(5, 1, 1, 'Application error',
 'Error appears when opening the application',
 'medium', 'closed');