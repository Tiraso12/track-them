



//UPDATE AN EMPLOYEE ROLE: prompt to select an employee to update their new role and this information is updated in the db

const sql = require('mysql2');
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

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

//ALL DEPARTMENTS : department names, and department ids
function allDepartments() {
    db.query(`SELECT * FROM department`, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL DEPARTMENTS');
        console.log('======================================================');
        console.table(res);
    });
    start();
};
//ALL ROLES: job title, role id, the department that role belongs to, and the salary for that role.
function allRoles() {
    db.query(`SELECT role.id, role.title, role.salary, department.name
                                FROM role
                                LEFT JOIN department
                                ON role.department_id = department.id;`, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL ROLES');
        console.log('======================================================');
        console.table(res);
    })
    start();
};
//ALL EMPLOYEES: employee ids, first names, last names, job titles, departments, salaries, and managers that the emplyees report to.
function allEmployees() {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department,CONCAT()
    FROM employee 
    LEFT JOIN role 
    ON employee.role_id = role.id
    LEFT JOIN department
    ON department.id = role.department_id;`
    db.query(sql, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.table(res);
    });
    start();
};
//ADD DEPARTMENT: prompt to enter name of department, then department is added to db.
function addDeparment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'depName',
            message: 'What is the name of the deparment?',
        },
    ])
        .then(answers => {

            const insert = "INSERT INTO department(name) VALUES ?";
            const value = [[answers.depName]];


            db.query(insert, [value], (err, res) => {
                if (err) throw err;
                console.log(res);
                allDepartments();
            })
        });

};

//ADD ROLE: prompt to enter name, salary, and deparment for the role and that role is added to db

function addRole() {

    const sql = `SELECT * FROM department`
    db.query(sql, (err, res) => {
        if (err) throw err;
        const departmentArray = []
        const storeRes = res;
        console.log(res);

        res.forEach((department) => { departmentArray.push(department.name) });

        inquirer.prompt([
            {
                type: 'input',
                name: 'nameOfRole',
                message: 'What is the name of the role?'
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the salary for the role?'
            },
            {
                type: 'list',
                name: 'departmentForRole',
                message: 'In what department does the role belong?',
                choices: departmentArray
            }
        ]).then(data => {
            let departmentId;
            storeRes.forEach((index) => {
                if (index.name === data.departmentForRole) {
                    departmentId = index.id;
                };
            })
            const values = {
                title: data.nameOfRole,
                salary: data.salary,
                department_id: departmentId
            }

            const sql = `INSERT INTO role SET ?`;
            db.query(sql, values, (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows);
                start();
            })
        })
    })
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
            return;
        } else {
            const manager = v.last_name;
            managerArray.push(manager);
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
                            manid = response2[i].manager_id;
                        }
                    };

                    db.query(`INSERT INTO employee SET ?`, {
                        first_name: answers.newEmployee,
                        last_name: answers.newLastName,
                        role_id: roleid,
                        manager_id: manid
                    }, function (err) {
                        if (err) throw err;
                    });
                    allEmployees();

                })
            })
        })

}


start()