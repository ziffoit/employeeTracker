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

const viewDepartments = () => {
    connection.query('SELECT * FROM department', (err, results) => {
      if (err) throw err;
      console.log(results)
      choice()
    }
    )
}
const viewRoles = () => {
    connection.query('SELECT * FROM role', (err, results) => {
      if (err) throw err;
      console.log(results)
      choice()
    }
    )
}
const viewEmployees = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
      if (err) throw err;
      console.log(results)
      choice()
    }
    )
}

const addDepartment = () => {
    inquirer
        .prompt([
            {
            name: 'name',
            type: 'input',
            message: 'What is the name of the department you would like to add?',
            },
        ])
        .then(({name}) => {
            connection.query(
              'INSERT INTO department SET ?',
              {
                name: name,
              },
              (err) => {
                if (err) throw err;
                console.log(`You successfully added ${name}!`);
                start();
              }
            );
          });
}      
const addRole = () => {
    const departmentList = []
    inquirer
        .prompt([
            {
            name: 'title',
            type: 'input',
            message: 'What is the title of the new role you would like to add?',
            },
            {
            name: 'salary',
            type: 'input',
            message: 'What salary should this role have?',
            validate(salary) {
                return !isNaN(salary)
              },    
            },
            {
            name: 'department',
            type: 'list',
            message: 'What department should the role be under?',
            choices: departmentList    
        },
        ])
        .then(({title, salary, department}) => {

            connection.query(
              'INSERT INTO role SET ?',
              {
                title: title,
                salary: salary,

              },
              (err) => {
                if (err) throw err;
                console.log(`You successfully added ${name}!`);
                start();
              }
            );
          });
}

  connection.connect((err) => {
    if (err) throw err;
    choice();
  });