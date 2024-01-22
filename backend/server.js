// server.js
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3001; // Change this to your desired port
// taking the host , user, password, database from .env file
require('dotenv').config()

app.use(cors());
app.use(bodyParser.json());

// Replace these with your MySQL connection details
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_database,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Get tables
app.get("/tables", (req, res) => {
  db.query("SHOW TABLES", (err, result) => {
    if (err) {
      console.error("Error fetching tables:", err);
      res.status(500).send("Internal Server Error");
    } else {
      const tables = result.map(
        (row) => row[`Tables_in_${db.config.database}`]
      );
      res.json(tables);
    }
  });
});

// Get data from a specific table
app.get("/data/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  db.query(`SELECT * FROM ${tableName}`, (err, result) => {
    if (err) {
      console.error(`Error fetching data from ${tableName}:`, err);
      res.status(500).send("Internal Server Error");
    } else {
      res.json(result);
    }
  });
});

// Insert record into a table
app.post("/insert/:tableName", (req, res) => {
  const tableName = req.params.tableName;
  const data = req.body;

  db.query(`INSERT INTO ${tableName} SET ?`, data, (err, result) => {
    if (err) {
      console.error(`Error inserting record into ${tableName}:`, err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).send("Record inserted successfully");

    }
  });
});

// Delete record from a table
app.delete("/delete/:tableName/:recordId", (req, res) => {
  const tableName = req.params.tableName;
  const recordId = req.params.recordId;

  db.query(
    `DELETE FROM ${tableName} WHERE id = ?`,
    [recordId],
    (err, result) => {
      if (err) {
        console.error(`Error deleting record from ${tableName}:`, err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).send("Record deleted successfully");
      }
    }
  );
});


app.put("/update/:tableName/:recordId", (req, res) => {
  const tableName = req.params.tableName;
  const recordId = req.params.recordId;
  const updatedData = req.body;

  db.query(
    `UPDATE ${tableName} SET ? WHERE id = ?`,
    [updatedData, recordId],
    (err, result) => {
      if (err) {
        console.error(`Error updating record in ${tableName}:`, err);
        res.status(500).send("Internal Server Error");
      } else {
        res.status(200).send("Record updated successfully");
      }
    }
  );
});


//to get the product based on the users input
app.get("/product/:productId", (req, res) => {
  const productId = req.params.productId;

  const query = "SELECT * FROM products WHERE id = ?";

  db.query(query, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching product by ID:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "Product not found" });
      } else {
        res.json(results[0]); // Assuming there's only one product with a given ID (primary key)
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
