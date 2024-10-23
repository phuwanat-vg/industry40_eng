const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10, // Adjust the limit based on your needs
  host: 'srv1630.hstgr.io',
  user: 'u566914236_manueng',
  password: 'M4nuEn9_db',
  database: 'u566914236_ime40',
  port: 3306
});

// API route to get column names and data from a specific table
app.get('/data/:table', (req, res) => {
  const tableName = req.params.table; // Get the table name from the request params

  // Query to get column names
  const columnQuery = `SHOW COLUMNS FROM ${tableName}`;
  
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool:', err);
      res.status(500).send('Database connection error');
      return;
    }

    // Fetch column names
    connection.query(columnQuery, (err, columns) => {
      if (err) {
        if (err.code === 'ER_NO_SUCH_TABLE') {
          // Table does not exist, return a 404 response
          res.status(404).send(`Table '${tableName}' does not exist.`);
        } else {
          console.error('Error fetching columns:', err);
          res.status(500).send('An error occurred while fetching column information.');
        }
        connection.release(); // Release connection back to the pool
        return;
      }

      const columnNames = columns.map(col => col.Field); // Extract column names

      // Query to get data from the table
      const dataQuery = `SELECT * FROM ${tableName}`;
      connection.query(dataQuery, (err, data) => {
        if (err) {
          console.error('Error fetching data:', err);
          res.status(500).send('An error occurred while fetching data.');
        } else {
          res.json({
            columns: columnNames, // Send column names
            data: data // Send data rows
          });
        }
        connection.release(); // Release connection back to the pool
      });
    });
  });
});

// Serve static assets from React's build folder
app.use(express.static(path.join(__dirname, 'client/build')));

// Catch all remaining routes and send to React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
