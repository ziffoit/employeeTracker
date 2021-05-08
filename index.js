const mysql = require('mysql');
const inquirer = require('inquirer');

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: '',
  database: 'employeeDB',
});

const choice = () => {
    inquirer
      .prompt({
        name: 'choice',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View Departments',
            'View Roles',
            'View Employees',
            'Add Departments',
            'Add Roles',
            'Add Employees',
            'Update Employee Roles',
            'Exit'
    
        ],
      })
      .then(({choice}) => {
        console.log(choice)
        switch (choice) {
            case 'View Departments':
                viewDepartments()
                break
            case 'View Roles':
                viewRoles()
                break
            case 'View Employees':
                viewEmployees()
                break
            case 'Add Department':
                addDepartment()
                break
            case 'Add Role':
                addRole()
                break
            case 'Add Employee':
                addEmployee()
                break
            case 'Update Employee Role':
                updateEmployeeRole()
                break
            default:
                connection.end()
                break
        }
      });
};  

  connection.connect((err) => {
    if (err) throw err;
    choice();
  });