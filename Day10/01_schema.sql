-- Equipment Booking system
CREATE DATABASE equipment_booking;

CREATE TABLE employees (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL
);

CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE equipment (
    id INTEGER PRIMARY KEY,
    category_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(100),

    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE bookings (
    id INTEGER PRIMARY KEY,
    employee_id INTEGER NOT NULL,
    equipment_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    purpose TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',

    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);

CREATE TABLE approvals (
    id INTEGER PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    approver_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    approved_at TIMESTAMP,
    remarks TEXT,

    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (approver_id) REFERENCES employees(id)
);

CREATE TABLE maintenance_records (
    id INTEGER PRIMARY KEY,
    equipment_id INTEGER NOT NULL,
    maintenance_date DATE NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    status VARCHAR(50) NOT NULL,
    completed_date DATE,

    FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);
