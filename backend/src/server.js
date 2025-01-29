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

app.get("/tasks", async (req, res) => {
    try{
        const {rows} = await pool.query("SELECT * FROM tasks");
        res.json(rows)
    }catch (err){
        res.status(500).json({error: "Error fetching tasks"});
    }
});




//Started server
const PORT = 5000
app.listen(PORT, () => {
    console.log(`Server in http://localhost:${PORT}`);
});