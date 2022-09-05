INSERT INTO department(name)
VALUES
("finance"),
("customer_Services"),
("sales"),
("food_Beverage");

INSERT INTO roles(title,salary,department_id)
VALUES
('manager',80.000,1),
('assistant_manager',60.000,2),
('supervisor', 42.000,3),
('assistant_supervisor',40.000, 4);

INSERT INTO employee(first_name, last_name, role_id,manager_id)
VALUES
('Ricardo','Braga',1,1),
('Ramon','Braga',4,3),
('Richard','Ferreira',1,4),
('Yzamirth','Morales',2,2),
('Sebastian','Centeno',4,1);