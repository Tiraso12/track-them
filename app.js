//UPDATE AN EMPLOYEE ROLE: prompt to select an employee to update their new role and this information is updated in the db
const sql = require('mysql2');
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { allDepartments, addDeparment } = require('./lib/department');
const { allRoles, addRole } = require('./lib/roles');
const { allEmployees, addEmployee, updateEmployee, deleteEmployee } = require('./lib/employee');

const start = answers => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: 'select an option',
            choices: ['ALL DEPARTMENTS', 'ALL ROLES', 'ALL EMPLOYEES', 'ADD DEPARTMENT', 'ADD ROLE', 'ADD EMPLOYEE', 'UPDATE EMPLOYEE ROLE', 'DELETE EMPLOYEE']
        },
    ])
        .then(answers => {
            console.log(answers.options);
            switch (answers.options) {
                case "ALL DEPARTMENTS":
                    allDepartments().then(() => { start() });
                    break;
                case "ALL ROLES":
                    allRoles().then(() => { start() });
                    break;
                case 'ALL EMPLOYEES':
                    allEmployees().then(() => { start() });
                    break;
                case 'ADD DEPARTMENT':
                    addDeparment().then(() => { allDepartments(); start() });
                    break;
                case 'ADD ROLE':
                    addRole().then(() => { allRoles(); start() });
                    break;
                case 'ADD EMPLOYEE':
                    addEmployee().then(() => { allEmployees(); start() });
                    break;
                case 'UPDATE EMPLOYEE ROLE':
                    updateEmployee().then(() => { allEmployees(); start() });
                    break;
                case 'DELETE EMPLOYEE':
                    deleteEmployee().then(() => { allEmployees(); start() });
                    break;

            }
        })
};




start();

module.exports = { start };