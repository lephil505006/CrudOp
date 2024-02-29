const express = require("express");
const mysql = require("mysql");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MySQL Connection
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "mysql",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

app.get("/", (req, res) => {
  res.send("Welcome to your CRUD API!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
