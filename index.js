const mysql = require("mysql");
const inquirer = require("inquirer");

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "employeeDB",
});

const choice = () => {
    inquirer
        .prompt({
            name: "choice",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View Departments",
                "View Roles",
                "View Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit",
            ],
        })
        .then(({ choice }) => {
            console.log(choice);
            switch (choice) {
                case "View Departments":
                    viewDepartments();
                    break;
                case "View Roles":
                    viewRoles();
                    break;
                case "View Employees":
                    viewEmployees();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                default:
                    connection.end();
                    break;
            }
        });
};

const viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, results) => {
        if (err) throw err;
        console.table(results);
        choice();
    });
};
const viewRoles = () => {
    connection.query("SELECT * FROM role", (err, results) => {
        if (err) throw err;
        console.table(results);
        choice();
    });
};
const viewEmployees = () => {
    connection.query("SELECT * FROM employee", (err, results) => {
        if (err) throw err;
        console.table(results);
        choice();
    });
};

const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message:
                    "What is the name of the department you would like to add?",
            },
        ])
        .then(({ name }) => {
            connection.query(
                "INSERT INTO department SET ?",
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
};

const addRole = () => {
    connection.query("SELECT * FROM department", (err, departments) => {
        if (err) throw err;
        const departmentNames = departments.map(({name}) => { return name })
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message:
                        "What is the title of the new role you would like to add?",
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What salary should this role have?",
                    validate(salary) {
                        return !isNaN(salary);
                    },
                },
                {
                    name: "department",
                    type: "list",
                    message: "What department should the role be under?",
                    choices: departmentNames,
                },
            ])
            .then(({ title, salary, department }) => {
                const department_id = departments.filter((departmentRow) => departmentRow.name == department )[0].id
                connection.query(
                    "INSERT INTO role SET ?",
                    {
                        title: title,
                        salary: salary,
                        department_id: department_id
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`You successfully added ${title}!`);
                        choice();
                    }
                );
            });
            
    });
};

const addEmployee = () => {
    connection.query("SELECT * FROM role", (err, roles) => {
        if (err) throw err;
        const roletitle = roles.map(({title}) => { return title })
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input",
                    message:
                        "What is the first name of the new employee you would like to add?",
                },
                {
                    name: "last_name",
                    type: "input",
                    message:
                        "What is the last name of the new employee you would like to add?",
                },
                {
                    name: "title",
                    type: "list",
                    message: "What title should the employee have?",
                    choices: roletitle,
                },
            ])
            .then(({ first_name, last_name, title }) => {
                const role_id = roles.filter((roleRow) => roleRow.title == title )[0].id
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: first_name,
                        last_name: last_name,
                        role_id: role_id
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`You successfully added ${first_name} ${last_name}!`);
                        choice();
                    }
                );
            });
            
    });
};

const updateEmployeeRole = () => {
    connection.query("SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id", (err, result) => {
        if (err) throw err;
        console.log(result)
        const roletitle = result.map(({title}) => { return title })
        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "What employee would you like to update?",
                    choices: [] //todo employee list
                },
                
                {
                    name: "title",
                    type: "list",
                    message: "What new title should the employee have?",
                    choices: roletitle,
                },
            ])
            .then(({ first_name, last_name, title }) => {
                const role_id = result.filter((roleRow) => roleRow.title == title )[0].id
                connection.query(
                    "INSERT INTO employee SET ?",
                    {
                        first_name: first_name,
                        last_name: last_name,
                        role_id: role_id
                    },
                    (err) => {
                        if (err) throw err;
                        console.log(`You successfully added ${first_name} ${last_name}!`);
                        choice();
                    }
                );
            });
            
    });
}

connection.connect((err) => {
    if (err) throw err;
    choice();
});
