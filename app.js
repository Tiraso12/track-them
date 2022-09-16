//UPDATE AN EMPLOYEE ROLE: prompt to select an employee to update their new role and this information is updated in the db
const sql = require('mysql2');
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { allDepartments, addDeparment } = require('./lib/department');
const { allRoles, addRole } = require('./lib/roles');


// connects to data base
db.connect(err => {
    if (err) throw err;
    console.log(('database connected'));
});


//start application function
const start = answers => {
    inquirer.prompt([
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
                    allDepartments().then(()=>{start()});
                    break;
                case "ALL ROLES":
                    allRoles().then(()=>{start()});
                    break;
                case 'ALL EMPLOYEES':
                    allEmployees();
                    break;
                case 'ADD DEPARTMENT':
                    addDeparment().then(()=>{allDepartments();start()});
                    break;
                case 'ADD ROLE':
                    addRole().then(()=>{allRoles();start()});
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


//ALL EMPLOYEES: employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.
function allEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager
     from employee
     LEFT JOIN role ON role.id = employee.role_id
     LEFT JOIN department on department.id = role.department_id
     LEFT JOIN employee manager ON manager.id = employee.manager_id;`
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
    });
    start();
};


//ADD EMPLOYEE: prompt to enter first name, last name, role, and manager, that employee is added to db
const rolesArray = [];
const managerArray = [];
db.query(`SELECT title FROM role`, (err, res) => {
    if (err) throw err
    res.forEach(title => {
        rolesArray.push(title.title)
        return rolesArray;
    })
});

db.query(`SELECT * FROM employee;`, (err, res) => {
    if (err) throw err;
    res.forEach(v => {
        const x = null;

        if (v.manager_id == x) {
            const manager = v.last_name;
            managerArray.push(manager);
        } else {
            return;
        }
    })
});
function addEmployee() {
    console.log();
    inquirer.prompt([
        {
            type: 'input',
            name: 'newEmployee',
            message: 'What is the employees first name?'
        },
        {
            type: 'input',
            name: 'newLastName',
            message: 'What is the employees last name?'
        },
        {
            type: 'list',
            name: 'newEmployeeRole',
            message: 'What is the employe`s role?',
            choices: rolesArray,
        },
        {
            type: 'list',
            name: 'managerForEmployee',
            message: 'Who is the manager of the employee?',
            choices: managerArray,
        },
        {
            type: 'input',
            name: 'newLastName',
            message: 'What is the employees last name?'
        },
    ])
        .then(answers => {
            console.log(answers);
            db.query(`SELECT * FROM role;`, (err, response1) => {
                if (err) throw err;

                db.query(`SELECT * FROM employee;`, (err, response2) => {
                    if (err) throw err;
                    let roleid;
                    let manid;

                    for (let i = 0; i < response1.length; i++) {
                        if (response1[i].title == answers.newEmployeeRole) {
                            roleid = response1[i].id;
                        }
                    };

                    for (let i = 0; i < response2.length; i++) {
                        if (response2[i].last_name == answers.managerForEmployee) {
                            manid = response2[i].id;
                        }
                    };

                    db.query(`INSERT INTO employee SET ?`, {
                        first_name: answers.newEmployee,
                        last_name: answers.newLastName,
                        role_id: roleid,
                        manager_id: manid
                    }, function (err, res) {
                        if (err) throw err;
                        console.log('NEW EMPLOYEE HAS BEEN ADDED!'); c
                    });
                    
                })
                allEmployees();
            })
        })

}

function updateEmployee() {
    const employeeArray = [];
    db.query('SELECT * FROM employee;', (err, employeeDb) => {
        employeeDb.forEach(employee => {
            // employeeArray.push(employee.first_name + " " + employee.last_name);
            employeeArray.push(employee.first_name);
        });

        db.query(`SELECT * FROM role`, (err, role) => {

            inquirer.prompt([
                {
                    type: 'list',
                    name: 'listOfEmployee',
                    message: 'Select the employee that you want to update',
                    choices: employeeArray
                },
                {
                    type: 'list',
                    name: 'newRole',
                    message: 'what is the new role of the employee?',
                    choices: rolesArray,
                }])
                .then(answers => {
                    let newRoleid;
                    role.forEach(role => {
                        if (answers.newRole === role.title) {
                            newRoleid = role.id
                        }
                    });

                    let mId;

                    employeeDb.forEach(employee=>{
                        if(employee.first_name === answers.listOfEmployee){
                            mId = employee.id
                        }
                    })

                    const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
                    const params = [newRoleid,mId]
                     db.query(sql, params, (err, res)=>{
                        if (err) throw err;

                        console.log('Employee"s Role have been updated');
                     });

                     allEmployees();

                })
        })
    })
}


start();

module.exports = {start};