INSERT INTO departments (department_name)
VALUES
('planning'),
('water and sewer'),
('codes'),
('fire marshal'),
('security');

INSERT INTO roles (title, salary, department_id)
VALUES
('planner', '74000', 1),
('engineer', '77000', 2),
('inspector', '60000', 3),
('reviewer', '82000', 4),
('guard', '65000', 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('george', 'straight', 1, null),
('john', 'stamos', 2, null),
('rick', 'astly', 3, 1),
('leon', 'richie', 4, 1),
('jimmy', 'buffet', 5, 3);
