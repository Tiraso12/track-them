const { start } = require('../app');
const db = require('../db/connection');
const inquirer = require('inquirer');


//ALL DEPARTMENTS : department names, and department ids
function allDepartments() {

    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM department`, (err, res) => {
            if (err) throw err;
            console.log('\n');
            console.log('VIEW ALL DEPARTMENTS');
            console.log('======================================================');
            console.table(res);
        });
        resolve();
    })
};


//ADD DEPARTMENT: prompt to enter name of department, then department is added to db.
function addDeparment() {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: 'input',
                name: 'depName',
                message: 'What is the name of the deparment?',
            },
        ])
            .then(answers => {

                const sql = "INSERT INTO department(name) VALUES ?";
                const value = [[answers.depName]];


                db.query(sql, [value], (err, res) => {
                    if (err) throw err;
                })
                resolve();
            });
    })

};

module.exports = { allDepartments, addDeparment }