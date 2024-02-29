const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MySQL Connection Pooling
const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "students",
});

// Database Connection Error Handling
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database!");

  connection.release();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Root URL
app.get("/", (req, res) => {
  res.send(
    "<h1>Welcome to Philip Student Database, Please use the ' /students ' in the url </h1>"
  );
});

//CRUD OPS

// Create
app.post("/students", (req, res) => {
  const { firstName, lastName, email } = req.body;
  const student = { firstName, lastName, email };

  pool.query("INSERT INTO students SET ?", student, (err, result) => {
    if (err) {
      console.error("Error creating student:", err);
      res.status(500).json({ error: "Error creating student" });
      return;
    }
    res.status(201).json({
      message: "Student created successfully",
      studentId: result.insertId,
    });
  });
});

// Read
app.get("/students", (req, res) => {
  pool.query("SELECT * FROM students", (err, results) => {
    if (err) {
      console.error("Error fetching students:", err);
      res.status(500).json({ error: "Error fetching students" });
      return;
    }
    res.json(results);
  });
});

// Get student by ID
app.get("/students/:id", (req, res) => {
  const studentId = req.params.id;
  pool.query(
    "SELECT * FROM students WHERE id = ?",
    studentId,
    (err, results) => {
      if (err) {
        console.error("Error fetching student:", err);
        res.status(500).json({ error: "Error fetching student" });
        return;
      }
      if (results.length === 0) {
        res.status(404).json({ error: "Student not found" });
        return;
      }
      res.json(results[0]);
    }
  );
});

// Update
app.put("/students/:id", (req, res) => {
  const studentId = req.params.id;
  const { firstName, lastName, email } = req.body;

  const updatedStudent = { firstName, lastName, email };
  pool.query(
    "UPDATE students SET ? WHERE id = ?",
    [updatedStudent, studentId],
    (err, result) => {
      if (err) {
        console.error("Error updating student:", err);
        res.status(500).json({ error: "Error updating student" });
        return;
      }
      res.json({ message: "Student updated successfully" });
    }
  );
});

// Delete
app.delete("/students/:id", (req, res) => {
  const studentId = req.params.id;
  pool.query("DELETE FROM students WHERE id = ?", studentId, (err, result) => {
    if (err) {
      console.error("Error deleting student:", err);
      res.status(500).json({ error: "Error deleting student" });
      return;
    }
    res.json({ message: "Student deleted successfully" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
