import express from 'express'
import inquirer from 'inquirer'
import pg from 'pg'

const { Pool } = pg
const PORT = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const pool = new Pool(
    {
        host: 'localhost',
        user: 'postgres',
        password: '1612',
        database: 'employee_db'
    },
    console.log('connected to employee_db')
)

const client = await pool.connect()

const init = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'init',
            message: 'what would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'exit'
            ]
        }
    ])
        .then((answer) => {
            if (answer.init === 'view all departments') { getDepartments() }
            else if (answer.init === 'view all roles') { getRoles() }
            else if (answer.init === 'view all employees') { getEmployees() }
            else if (answer.init === 'add a department') { addDepartment() }
            else if (answer.init === 'add a role') { addRole() }
            else if (answer.init === 'add an employee') { addEmployee() }
            else if (answer.init === 'update an employee role') { updateEmployeeRole() }
            else if (answer.init === 'exit') { process.exit(0) }
            else { return }
        })
}

const getDepartments = async () => {
    const sql = `SELECT departments.id, departments.department_name FROM departments;`
    const res = await client.query(sql)
    console.table(res.rows)
    init()
}

const getRoles = async () => {
    const sql = `SELECT roles.id, roles.title, roles.salary, departments.department_name FROM roles INNER JOIN departments ON (departments.id = roles.department_id);`
    const res = await client.query(sql)
    console.table(res.rows)
    init()
}

const getEmployees = async () => {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department_name, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN employees manager on manager.id = employees.manager_id INNER JOIN roles ON (roles.id = employees.role_id) INNER JOIN departments ON (departments.id = roles.department_id) ORDER BY employees.last_name;`
    const res = await client.query(sql)
    console.table(res.rows)
    init()
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'what is the name of the new department?'
        }
    ])
        .then((answer) => {
            const sql = `INSERT INTO departments(department_name) VALUES('${answer.department}');`
            client.query(sql)
            console.log(`added ${answer.department} as a new department`)
            init()
        })
}

const addRole = async () => {
    const sql = `SELECT * FROM departments;`
    const res = await client.query(sql)
    const departmentList = res.rows.map(departments => ({
        name: departments.department_name,
        value: departments.id
    }))
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'what is the name of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'what is the salary for this role?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'which department does this role belong to?',
            choices: departmentList
        }
    ])
        .then((answers) => {
            const sql = `INSERT INTO roles(title, salary, department_id) VALUES('${answers.title}', '${answers.salary}', ${answers.department});`
            client.query(sql)
            console.log(`added ${answers.title} as a new role to the database`)
            init()
        })
}

const addEmployee = async () => {
    const sqlEmp = `SELECT * FROM employees;`
    const resEmp = await client.query(sqlEmp)
    const employeeList = resEmp.rows.map(employees => ({
        name: employees.first_name.concat(' ', employees.last_name),
        value: employees.id
    }))

    const sqlRole = `SELECT * FROM roles;`
    const resRole = await client.query(sqlRole)
    const roleList = resRole.rows.map(roles => ({
        name: roles.title,
        value: roles.id
    }))

    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'what is the first name of the employee?'
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'what is the last name of the employee?'
        },
        {
            type: 'list',
            name: 'role',
            message: 'what is the role of the employee?',
            choices: roleList
        },
        {
            type: 'list',
            name: 'manager',
            message: 'what manager does the employee report to?',
            choices: employeeList
        }
    ])
        .then((answers) => {
            const sql = `INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES('${answers.first_name}', '${answers.last_name}', ${answers.role}, ${answers.manager});`
            client.query(sql)
            console.log(`added ${answers.first_name.concat(' ', answers.last_name)} as a new role to the database`)
            init()
        })
}

const updateEmployeeRole = async () => {
    const sqlEmp = `SELECT * FROM employees;`
    const resEmp = await client.query(sqlEmp)
    const employeeList = resEmp.rows.map(employees => ({
        name: employees.first_name.concat(' ', employees.last_name),
        value: employees.id
    }))

    const sqlRole = `SELECT * FROM roles;`
    const resRole = await client.query(sqlRole)
    const roleList = resRole.rows.map(roles => ({
        name: roles.title,
        value: roles.id
    }))

    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'which employee role do you want to update?',
            choices: employeeList
        },
        {
            type: 'list',
            name: 'role',
            message: 'what is the new role for the employee?',
            choices: roleList
        },
        {
            type: 'list',
            name: 'manager',
            message: 'who is the new manager for the employee?',
            choices: employeeList
        }
    ])
        .then((answers) => {
            const sql = `UPDATE employees SET role_id=${answers.role}, manager_id=${answers.manager} WHERE id=${answers.employee};`
            client.query(sql)
            console.log(`updated employee role and manager in the database`)
            init()
        })
}

app.use((req, res) => {
    res.status(404).end()
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

init()
