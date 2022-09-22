const db = require('../db/connection');
const inquirer = require('inquirer');

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

//ALL EMPLOYEES: employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to.
function allEmployees() {
    return new Promise((resolve, reject) => {

        const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name,' ', manager.last_name) AS manager
         FROM employee
         LEFT JOIN role ON role.id = employee.role_id
         LEFT JOIN department on department.id = role.department_id
         LEFT JOIN employee manager ON manager.id = employee.manager_id;`

        db.query(sql, (err, res) => {
            if (err) throw err;
            console.log('\n');
            console.table(res);
        });
        resolve();
    })
};


function addEmployee() {
    return new Promise((resolve, reject) => {

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
                            console.log('\n',
                                'NEW EMPLOYEE HAS BEEN ADDED!');
                            resolve();
                        });

                    })
                })
            })
    })

}

function updateEmployee() {
    return new Promise((resolve, reject) => {
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

                        employeeDb.forEach(employee => {
                            if (employee.first_name === answers.listOfEmployee) {
                                mId = employee.id
                            }
                        })

                        const sql = `UPDATE employee SET role_id = ? WHERE employee.id = ?`;
                        const params = [newRoleid, mId]
                        db.query(sql, params, (err, res) => {
                            if (err) throw err;
                            resolve();
                        });
                    })
            })
        })
    })
}

//DELETE OPTION FOR EMPLOYEE

function deleteEmployee() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM employee`;

        db.query(sql, (err,employees)=>{
            const employeeNames = [];
            employees.forEach(employees=>{employeeNames.push(employees.first_name)});

            inquirer.prompt([
                {
                    type:'list',
                    name:'employeeChosen',
                    message:'which employee would you like to remove',
                    choices:employeeNames
                }
            ]).then(choice=>{
                let empId;
                employees.forEach((employees)=>{
                    if(employees.first_name === choice.employeeChosen){
                        empId = employees.id
                    }
                })
                db.query('DELETE FROM employee WHERE ?',{id: empId}, (err,res)=>{
                    if (err) throw err;
                    
                    console.log('\n',
                    `Employee have been removed!`);
                    resolve();
                });
                
            })
        })

    })
}

module.exports = { allEmployees, addEmployee, updateEmployee, deleteEmployee }