const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const ejs = require("ejs");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.render("user");
});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "railway",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

db.query(
  `CREATE TABLE IF NOT EXISTS customers (
  idCustomers INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255) NOT NULL,
  PRIMARY KEY (idCustomers)
)`,
  (err, result) => {
    if (err) {
      console.log(err);
    }
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS stations (
  idStations INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  PRIMARY KEY (idStations)
)`,
  (err, result) => {
    if (err) {
      console.log(err);
    }
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS routes (
  idRoutes INT NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  departure_station INT NOT NULL,
  arrival_station INT NOT NULL,
  PRIMARY KEY (idRoutes)
)`,
  (err, result) => {
    if (err) {
      console.log(err);
    }
  }
);

db.query(
  `CREATE TABLE IF NOT EXISTS tickets (
  idTickets INT NOT NULL,
  purchase_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  departure_time TIME NOT NULL,
  seat INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  route INT NOT NULL,
  customer INT NOT NULL,
  PRIMARY KEY (idTickets)
)`,
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("customers, stations, routes, tickets tables created");
    }
  }
);

app.get("/user", (req, res) => {
  (err, results) => {
    let sql_query = `SELECT 
    routes.*,
    dep_stations.name AS departure_station_name,
    dep_stations.city AS departure_station_city,
    arr_stations.name AS arrival_station_name,
    arr_stations.city AS arrival_station_city
FROM
    routes
JOIN
    stations AS dep_stations ON routes.departure_station = dep_stations.idStations
JOIN
    stations AS arr_stations ON routes.arrival_station = arr_stations.idStations
WHERE 1=1`;
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving routes");
    } else {
      if (req.query.filterCheckbox) {
        sql_query += " AND " + " idRoutes = 2";
      }
      db.query(sql_query);
      res.render("user", { routes: results });
    }
  };
});

app.post("/user", (req, res) => {
  res.render("user");
});

// app.get("/user", (req, res) => {
//   const filterCheckbox = req.query.filterCheckbox;
//   if (filterCheckbox) {
//     db.query(
//       `SELECT
//     routes.*,
//     dep_stations.name AS departure_station_name,
//     dep_stations.city AS departure_station_city,
//     arr_stations.name AS arrival_station_name,
//     arr_stations.city AS arrival_station_city
// FROM
//     routes
// JOIN
//     stations AS dep_stations ON routes.departure_station = dep_stations.idStations
// JOIN
//     stations AS arr_stations ON routes.arrival_station = arr_stations.idStations
// WHERE 1=1 AND idRoutes = 2;`,
//       (err, results) => {
//         if (err) {
//           console.log(err);
//           res.status(500).send("Error processing filter");
//         } else {
//           res.render("user", { routes: results });
//         }
//       }
//     );
//   }
// });

app.get("/admin", (req, res) => {
  db.query(
    `SELECT 
    routes.*,
    dep_stations.name AS departure_station_name,
    dep_stations.city AS departure_station_city,
    arr_stations.name AS arrival_station_name,
    arr_stations.city AS arrival_station_city
FROM
    routes
JOIN
    stations AS dep_stations ON routes.departure_station = dep_stations.idStations
JOIN
    stations AS arr_stations ON routes.arrival_station = arr_stations.idStations
WHERE 1=1;`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving routes");
      } else {
        res.render("admin", { routes: results });
      }
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
