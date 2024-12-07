INSERT INTO departments (department_name)
VALUES
('engineering'),
('customer service'),
('maintenance');

INSERT INTO roles (title, salary, department_id)
VALUES
('programmer', '80000', 1),
('cashier', '60000', 2),
('custodian', '55000', 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('jeff', 'kaplan', 3, null),
('george', 'bush', 1, 1),
('steve', 'martin', 2, null);