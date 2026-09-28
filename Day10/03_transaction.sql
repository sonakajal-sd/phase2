-- queries

SELECT * FROM employees;

-- Find all equipment that is currently available.

SELECT * FROM equipment WHERE status='available';

-- Display each equipment name along with its category name.

SELECT equipment.name , categories.name FROM equipment
JOIN categories ON categories.id= equipment.category_id; 

-- Display each booking with the employee name and equipment name.

SELECT employee.name , equipment.name , status FROM bookings
JOIN employees ON bookings.employee_id =employees.id
JOIN equipment ON bookings.equipment_id= equipment.id;

-- Find all bookings that are currently pending.

SELECT * FROM bookings WHERE status='pending';

-- Display all approved bookings with the approver's name.

SELECT employees.name, approvals.booking_id, approvals.status FROM approvals

JOIN employees ON approvals.approver_id = employees.id;

-- Find how many times each equipment has been booked.

SELECT  equipment.name , COUNT(bookings.id)
FROM equipment
JOIN bookings ON equipment.id = bookings.equipment_id
GROUP BY equipment.name;

-- Display equipment name, maintenance date, description and maintenance cost.

SELECT equipment.name , maintenance_records.maintenance_date,maintenance_records.description,maintenance_records.cost
FROM maintenance_records
JOIN equipment ON maintenance_records.equipment_id= equipment.id;


-- Find employees who have never made a booking.

SELECT employees.name , bookings.id
FROM bookings
LEFT JOIN employees ON bookings.employee_id= employees.id;
WHERE employee_id is NULL;

-- Find the maintenance record with the highest maintenance cost.

SELECT MAX(cost) FROM maintenance_records;


-- Transaction

BEGIN

UPDATE bookings SET employee_id=2 WHERE id=1;

COMMIT;

--Indexes
EXPLAIN ANALYZE SELECT * FROM equipment WHERE status='available';

CREATE INDEX idx_tickets_status ON equipment(status);