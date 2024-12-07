const express = require('express')
const { Pool } = require('pg')
const PORT = process.env.PORT || 3001
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const pool = new Pool(
    {
        user: 'postgres',
        password: '1612',
        host: 'localhost',
        database: 'employee_db'
    },
    console.log('connected to employee_db')
)

pool.connect()

app.get()

app.post()

app.put()

app.delete()

app.use((req, res) => {
    res.status(404).end()
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
