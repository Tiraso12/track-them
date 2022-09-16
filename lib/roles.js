const db = require('../db/connection');
const inquirer = require('inquirer');

//ALL ROLES: job title, role id, the department that role belongs to, and the salary for that role.
function allRoles() {
    return new Promise((resolve, reject) => {
        const sql = `SELECT role.id, role.title, role.salary, department.name FROM role LEFT JOIN department ON role.department_id = department.id;`

        db.query(sql, (err, res) => {
            if (err) throw err;
            console.log('\n');
            console.log('VIEW ALL ROLES');
            console.log('======================================================');
            console.table(res);
        })
        resolve();
    })

};

//ADD ROLE: prompt to enter name, salary, and deparment for the role and that role is added to db

function addRole() {

    return new Promise((resolve, reject) => {

        const sql = `SELECT * FROM department`
        db.query(sql, (err, res) => {
            if (err) throw err;
            const departmentArray = []
            const storeRes = res;

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
                    console.log('New Role Added!');
                    resolve();
                })
            })
        })
    })

};
module.exports = { allRoles, addRole };