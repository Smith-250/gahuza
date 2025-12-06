const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // body parser

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",      // shyiramo username yawe
  password: "",      // shyiramo password yawe
  database: "studentDB"
});

db.connect(err => {
  if (err) throw err;
  console.log("MySQL connected");
});

// -------------------- ROUTES -------------------- //

// Get all students
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add new student
app.post("/students", (req, res) => {
  const { name, email, course } = req.body;
  console.log("Adding student:", req.body);
  db.query(
    "INSERT INTO students (name, email, course) VALUES (?, ?, ?)",
    [name, email, course],
    (err) => {
      if (err) return res.status(500).send(err);
      db.query("SELECT * FROM students", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
      });
    }
  );
});

// Update student
app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, course } = req.body;
  db.query(
    "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?",
    [name, email, course, id],
    (err) => {
      if (err) return res.status(500).send(err);
      db.query("SELECT * FROM students", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
      });
    }
  );
});

// Delete student
app.delete("/students/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM students WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);
    db.query("SELECT * FROM students", (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    });
  });
});

// -------------------- START SERVER -------------------- //
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
