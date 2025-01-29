const express = require("express");
const bodyParse = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParse.json());


const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'todo_db',
    port: 5432,
});

pool
    .connect()
    .then(() => console.log("Successful connection to the database."))
    .catch((err) => console.error("Erro ao conectar com o banco de dados:", err));


//Return all tasks
app.get("/tasks", async (req, res) => {
    try{
        const {rows} = await pool.query("SELECT * FROM tasks");
        res.json(rows)
    }catch (err){
        res.status(500).json({error: "Error fetching tasks"});
    }
});


//Create a task
app.post("/tasks", async (req, res) => {
    const {title, short, description, completed} = req.body;

    if (!title || !description || !completed){
        return res.status(400).json({error: "Title and Description and Completed are mandatory"});
    }

    try{
        const query = "INSERT INTO tasks (title, short, description, completed) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [title, short, description, completed];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0])

    } catch(err) {
        console.error("Error to add task")
        res.status(500).json({err: "Internal server error"})
    }
});




//Started server
const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server in http://localhost:${PORT}`);
});