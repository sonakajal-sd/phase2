CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE customers (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    title VARCHAR(150) NOT NULL
);

CREATE TABLE tickets (
    id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    assigne INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL
        CHECK (priority IN ('low', 'medium', 'high')),
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (assigne) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE ticket_history (
    id INTEGER PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    old_assignee INTEGER,
    new_assignee INTEGER NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id),
    FOREIGN KEY (old_assignee) REFERENCES users(id),
    FOREIGN KEY (new_assignee) REFERENCES users(id)
);

CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    ticket_id INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ticket_id) REFERENCES tickets(id)
);