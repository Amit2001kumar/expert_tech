const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Database connection settings
const db = mysql.createConnection({
  host: "103.228.83.115",
  user: "root",
  password: "Cylsys@678",
  database: "hrms",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database!");
});

// Middleware to parse request bodies
app.use(bodyParser.json());

// Create an employee
app.post("/employees", (req, res) => {
  const { name, title, department, annual_salary } = req.body;
  const sql =
    "INSERT INTO expert (name, title, department, annual_salary) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, title, department, annual_salary], (err, result) => {
    if (err) {
      console.error("Error creating employee:", err);
      res.status(500).json({ error: "Error creating employee" });
    } else {
      res
        .status(201)
        .json({ id: result.insertId, name, title, department, annual_salary });
    }
  });
});

// Read all employees
app.get("/employees", (req, res) => {
  const sql = "SELECT * FROM expert WHERE deleted = false";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching employees:", err);
      res.status(500).json({ error: "Error fetching employees" });
    } else {
      res.status(200).json(result);
    }
  });
});

// Read a single employee by ID
app.get("/employees/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM expert WHERE id = ? AND deleted = false";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error fetching employee:", err);
      res.status(500).json({ error: "Error fetching employee" });
    } else if (result.length === 0) {
      res.status(404).json({ error: "Employee not found" });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// Update an employee by ID
app.put("/employees/:id", (req, res) => {
  const id = req.params.id;
  const { title, department, annual_salary } = req.body;
  const sql =
    "UPDATE expert SET title = ?, department = ?, annual_salary = ? WHERE id = ?";
  db.query(sql, [title, department, annual_salary, id], (err, result) => {
    if (err) {
      console.error("Error updating employee:", err);
      res.status(500).json({ error: "Error updating employee" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Employee not found" });
    } else {
      res.status(200).json({ id, title, department, annual_salary });
    }
  });
});

// Delete an employee by ID
app.delete("/employees/:id", (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE expert SET deleted = true WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting employee:", err);
      res.status(500).json({ error: "Error deleting employee" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: "Employee not found" });
    } else {
      res.status(204).end();
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
