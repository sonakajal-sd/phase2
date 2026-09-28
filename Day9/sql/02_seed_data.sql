INSERT INTO users (id, name, email)
VALUES
(1, 'Aakash Kumar', 'aakash@company.com'),
(2, 'Priya Menon', 'priya@company.com'),
(3, 'Rahul Sharma', 'rahul@company.com');

INSERT INTO customers (id, name, email)
VALUES
(1, 'Arun Kumar', 'arun@gmail.com'),
(2, 'Meena Joseph', 'meena@gmail.com');

INSERT INTO categories (id, title)
VALUES
(1, 'Technical Support'),
(2, 'Billing');

INSERT INTO tickets
(id, customer_id, assigne, category_id, title, priority, description, status)
VALUES
(1, 1, 1, 1, 'Login issue', 'high',
 'Customer cannot login', 'open'),

(2, 1, 2, 2, 'Billing issue', 'medium',
 'Customer has a billing problem', 'open'),

(3, 2, 3, 1, 'Application error', 'high',
 'Application shows an error', 'open');