DROP DATABASE IF EXISTS employee_tr;

CREATE DATABASE IF NOT EXISTS employee_tr;

USE employee_tr;

CREATE TABLE department (
id INTEGER AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(30)
);

CREATE TABLE role (
id INTEGER PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL,
department_id INTEGER,
INDEX dep_ind (department_id),
CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
id INTEGER PRIMARY KEY  AUTO_INCREMENT,
first_name  VARCHAR(30),
last_name VARCHAR(30),
role_id INTEGER,
CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
manager_id INTEGER,
CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);