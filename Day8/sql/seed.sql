INSERT INTO users (id, name, email)
VALUES
(1, 'Aakash Kumar', 'aakash.kumar@company.com'),
(2, 'Priya Menon', 'priya.menon@company.com'),
(3, 'Rahul Sharma', 'rahul.sharma@company.com'),
(4, 'Divya Nair', 'divya.nair@company.com'),
(5, 'Arun Raj', 'arun.raj@company.com'),
(6, 'Meera Joseph', 'meera.joseph@company.com'),
(7, 'Vishnu Kumar', 'vishnu.kumar@company.com'),
(8, 'Anjali Das', 'anjali.das@company.com'),
(9, 'Kiran Babu', 'kiran.babu@company.com'),
(10, 'Sneha Thomas', 'sneha.thomas@company.com'),
(11, 'Rakesh Menon', 'rakesh.menon@company.com'),
(12, 'Nithya Raj', 'nithya.raj@company.com');


INSERT INTO customers (id, name, email)
VALUES
(1, 'Arun Kumar', 'arun.kumar@gmail.com'),
(2, 'Priya Sharma', 'priya.sharma@gmail.com'),
(3, 'Rahul Menon', 'rahul.menon@gmail.com'),
(4, 'Meena Joseph', 'meena.joseph@gmail.com'),
(5, 'Karthik Raj', 'karthik.raj@gmail.com'),
(6, 'Divya Nair', 'divya.nair@gmail.com'),
(7, 'Suresh Babu', 'suresh.babu@gmail.com'),
(8, 'Anitha Das', 'anitha.das@gmail.com'),
(9, 'Vijay Kumar', 'vijay.kumar@gmail.com'),
(10, 'Reshma Thomas', 'reshma.thomas@gmail.com');

INSERT INTO categories (id, title)
VALUES
(1, 'Technical Support'),
(2, 'Billing'),
(3, 'Account Access'),
(4, 'Payment Issues'),
(5, 'Login Problems'),
(6, 'Subscription'),
(7, 'Refunds'),
(8, 'Security'),
(9, 'General Enquiry');


INSERT INTO tickets
(id, customer_id, assigne, category_id, title, priority, description, status, created_at)
VALUES
(1, 1, 1, 1, 'Login not working', 'high',
 'Customer is unable to login to the account',
 'open', '2026-09-01 09:15:00'),

(2, 1, 2, 2, 'Wrong amount charged', 'medium',
 'Customer was charged an incorrect amount',
 'open', '2026-09-02 10:30:00'),

(3, 1, 1, 3, 'Account locked', 'high',
 'Customer account is locked',
 'open', '2026-09-03 11:00:00'),

(4, 1, 3, 4, 'Payment failed', 'high',
 'Payment transaction failed',
 'open', '2026-09-04 14:20:00'),

(5, 1, 2, 5, 'Password reset issue', 'medium',
 'Customer cannot reset password',
 'open', '2026-09-05 15:10:00'),

(6, 1, 1, 6, 'Subscription issue', 'low',
 'Subscription details are incorrect',
 'open', '2026-09-06 16:00:00'),

(7, 2, 4, 1, 'Application error', 'high',
 'Error appears while opening application',
 'open', '2026-09-07 09:45:00'),

(8, 2, 5, 2, 'Invoice missing', 'medium',
 'Customer cannot find invoice',
 'closed', '2026-09-08 10:15:00'),

(9, 3, 6, 3, 'Email update request', 'low',
 'Customer wants to update email',
 'open', '2026-09-09 11:30:00'),

(10, 3, 7, 4, 'Card payment failed', 'high',
 'Card payment was declined',
 'closed', '2026-09-10 12:00:00'),

(11, 4, 8, 5, 'Unable to login', 'high',
 'Customer cannot access account',
 'open', '2026-09-11 13:20:00'),

(12, 4, 9, 7, 'Refund pending', 'medium',
 'Customer is waiting for refund',
 'open', '2026-09-12 14:10:00'),

(13, 5, 10, 8, 'Suspicious activity', 'high',
 'Customer reported suspicious activity',
 'open', '2026-09-13 15:00:00'),

(14, 5, 11, 9, 'General enquiry', 'low',
 'Customer has a general question',
 'closed', '2026-09-14 16:30:00'),

(15, 6, 12, 1, 'Technical issue', 'medium',
 'Customer reported a technical problem',
 'open', '2026-09-15 09:00:00'),

(16, 7, 1, 2, 'Billing clarification', 'low',
 'Customer needs billing clarification',
 'closed', '2026-09-16 10:00:00'),

(17, 8, 2, 3, 'Account verification', 'medium',
 'Customer needs account verification',
 'open', '2026-09-17 11:15:00'),

(18, 9, 3, 4, 'Payment reversed', 'medium',
 'Payment was unexpectedly reversed',
 'open', '2026-09-18 12:30:00'),

(19, 10, 4, 6, 'Subscription cancellation', 'low',
 'Customer requested subscription cancellation',
 'closed', '2026-09-19 13:45:00'),

(20, 2, 5, 8, 'Security verification', 'high',
 'Customer needs security verification',
 'open', '2026-09-20 14:30:00');



 