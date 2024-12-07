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
            if (answer.init === 'view all departments') {
                getDepartments()
            } else if (answer.init === 'view all roles') {
                getRoles()
            } else if (answer.init === 'view all employees') {
                getEmployees()
            } else if (answer.init === 'add a department') {
                addDepartment()
            } else if (answer.init === 'add a role') {
                addRole()
            } else if (answer.init === 'exit') {
                process.exit(0)
            }
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
    console.log(res.rows)
    // departmentList.map(departments => ({
    //     name: departments.department_name,
    //     value: departments.id
    // }))
    // return inquirer.prompt([
    //     {
    //         type: 'input',
    //         name: 'title',
    //         message: 'what is the name of the role?'
    //     },
    //     {
    //         type: 'input',
    //         name: 'salary',
    //         message: 'what is the salary for this role?'
    //     },
    //     {
    //         type: 'list',
    //         name: 'department',
    //         message: 'which department does this role belong to?'
    //     }
    // ])
    //     .then((answers) => {
    //         const sql = `INSERT INTO roles(title, salary, department_id) VALUES('${answers.title}', '${answers.salary}', '${answers.department}')`
    //         client.query(sql)
    //         console.log(`added ${answers.title} as a new role to the database`)
    //         init()
    //     })
}

const addEmployee = () => { }

const updateEmployeeRole = () => { }

app.use((req, res) => {
    res.status(404).end()
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})

init()
