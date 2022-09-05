//SEUDO

//PROMP WITH OPTIONS FOR : ALL DEPARTMENTS, ALL ROLES, ALL EMPLOYEES,  ADD DEPARTMENT, ADD ROLE, ADD EMPLOYEE, AND UPDATE AN EMPLOYEE ROLE

//ALL DEPARTMENTS : department names, and department ids

//ALL ROLES: job title, role id, the department that role belongs to, and the salary for that role.

//ALL EMPLOYEES: employee ids, first names, last names, job titles, departments, salaries, and managers that the emplyees report to.

//ADD DEPARTMENT: prompt to enter name of department, then department is added to db.

//ADD ROLE: prompt to enter name, salary, and deparment for the role and that role is added to db,

//ADD EMPLOYEE: prompt to enter first name, last name, role, and manager, that employee is added to db

//UPDATE AN EMPLOYEE ROLE: prompt to select an employee to update their new role and this information is updated in the db

const sql = require('mysql2');
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

db.connect(err => {
    if (err) throw err;
    console.log(('database connected'));
});


//start application function
const start = answers => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'select an option',
            choices: ['ALL DEPARTMENTS', 'ALL ROLES', 'ALL EMPLOYEES', 'ADD DEPARTMENT', 'ADD ROLE', 'ADD EMPLOYEE', 'UPDATE EMPLOYEE ROLE']
        },
    ])
        .then(answers => {
            console.log(answers.options);
            switch (answers.options) {
                case "ALL DEPARTMENTS":
                    allDepartments();
                    break;
                case "ALL ROLES":
                    allRoles();
                    break;
                case 'ALL EMPLOYEES':
                    allEmployees();
                    break;
                case 'ADD DEPARTMENT':
                    addDeparment();
                    break;
                case 'ADD ROLE':
                    addRole();
                    break;
                case 'ADD EMPLOYEE':
                    addEmployee();
                    break;
                case 'UPDATE EMPLOYEE ROLE':
                    updateEmployee();
                    break;

            }
        })
};

function allDepartments() {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        console.log(
            `====================
                        EMPLOYEES TABLE
                     ====================
            
            `);
        console.table(res);
    });
    start();
};

function allRoles() {
    db.query(`SELECT * FROM roles`, (err, res) => {
        if (err) throw err;
        console.log(
            `====================
                        EMPLOYEES TABLE
                     ====================
            
            `);
        console.table(res);
    })
    start();
};

function allEmployees() {
    db.query(`SELECT * FROM employee`, (err, res) => {
        if (err) throw err;
        console.log(
            `====================
                        EMPLOYEES TABLE
                     ====================
            
            `);
        console.table(res);
    });
    start();
}


start()