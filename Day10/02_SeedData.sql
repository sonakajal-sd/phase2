-- Equipment Booking System
-- Seed Data

-- Employees

INSERT INTO employees (id, name, email, department)
VALUES
(1, 'Arun Kumar', 'arun@company.com', 'IT'),
(2, 'Priya Menon', 'priya@company.com', 'Marketing'),
(3, 'Rahul Sharma', 'rahul@company.com', 'Design'),
(4, 'Meena Joseph', 'meena@company.com', 'HR');


-- Categories

INSERT INTO categories (id, name, description)
VALUES
(1, 'Laptop', 'Company laptops'),
(2, 'Camera', 'Photography cameras'),
(3, 'Projector', 'Presentation projectors'),
(4, 'Audio', 'Audio recording equipment');


-- Equipment

INSERT INTO equipment
(id, category_id, name, serial_number, status, location)
VALUES
(1, 1, 'Dell Latitude 5520', 'DL5520-001', 'available', 'Office A'),
(2, 1, 'HP ProBook 450', 'HP450-002', 'available', 'Office A'),
(3, 2, 'Sony A7 IV', 'SONY-A7-003', 'available', 'Studio'),
(4, 2, 'Canon EOS R6', 'CANON-R6-004', 'maintenance', 'Studio'),
(5, 3, 'Epson Projector', 'EPS-PRO-005', 'available', 'Meeting Room'),
(6, 4, 'Rode Microphone', 'RODE-MIC-006', 'available', 'Studio');


-- Bookings

INSERT INTO bookings
(id, employee_id, equipment_id, start_date, end_date, purpose, status)
VALUES
(1, 1, 1, '2026-09-29', '2026-10-01', 'Development work', 'approved'),
(2, 2, 3, '2026-09-30', '2026-10-02', 'Marketing shoot', 'pending'),
(3, 3, 5, '2026-10-03', '2026-10-03', 'Client presentation', 'approved'),
(4, 4, 2, '2026-10-05', '2026-10-07', 'Training session', 'pending');


-- Approvals

INSERT INTO approvals
(id, booking_id, approver_id, status, approved_at, remarks)
VALUES
(1, 1, 4, 'approved', '2026-09-28 10:30:00', 'Approved for development work'),
(2, 3, 1, 'approved', '2026-09-28 11:00:00', 'Approved for client presentation');


-- Maintenance Records

INSERT INTO maintenance_records
(id, equipment_id, maintenance_date, description, cost, status, completed_date)
VALUES
(1, 4, '2026-09-25', 'Camera sensor cleaning', 2500.00, 'completed', '2026-09-27'),
(2, 1, '2026-09-20', 'Laptop general service', 1200.00, 'completed', '2026-09-21'),
(3, 5, '2026-09-28', 'Projector lamp inspection', 800.00, 'in_progress', NULL);