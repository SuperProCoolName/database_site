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
  database: "railway_test",
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
  price INT NOT NULL,
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
    stations AS arr_stations ON routes.arrival_station = arr_stations.idStations;`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving routes");
      } else {
        res.render("user", { routes: results });
      }
    }
  );
});

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
    stations AS arr_stations ON routes.arrival_station = arr_stations.idStations;`,
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

app.get("/filter_user", function (req, res) {
  // Получение параметров запроса
  var idRoute = req.query.idRoute2Checkbox;
  var cityEski = req.query.cityEskiCheckbox;
  var priceMin = req.query.price_min;
  var priceMax = req.query.price_max;
  var minPrice = 0; // устанавливаем минимальную цену по умолчанию
  var maxPrice = 999999999; // устанавливаем максимальную цену по умолчанию

  var sql = `SELECT 
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
    WHERE 
      price >= ? and price <= ?`;
  var params = [priceMin || minPrice, priceMax || maxPrice];

  var conditions = [];
  if (idRoute) conditions.push("idRoutes = 2");
  if (cityEski)
    conditions.push(
      "dep_stations.city = 'Eski Qırım' OR arr_stations.city = 'Eski Qırım'"
    );
  // Соединяем условия с помощью оператора AND и добавляем их к SQL-запросу
  if (conditions.length > 0) {
    sql += " AND " + conditions.join(" AND ");
  }

  // Запрос к базе данных на получение списка квартир с применением фильтров
  db.query(sql, params, function (error, results, fields) {
    if (error) throw error;

    // Отправка списка квартир на клиент
    res.render("user", {
      routes: results,
      priceMin: priceMin,
      priceMax: priceMax,
    });
  });
});

app.get("/filter_admin", function (req, res) {
  // Получение параметров запроса
  var idRoute = req.query.idRoute2Checkbox;
  var cityEski = req.query.cityEskiCheckbox;
  var priceMin = req.query.price_min;
  var priceMax = req.query.price_max;
  var minPrice = 0; // устанавливаем минимальную цену по умолчанию
  var maxPrice = 999999999; // устанавливаем максимальную цену по умолчанию

  var sql = `SELECT 
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
    WHERE 
      price >= ? and price <= ?`;
  var params = [priceMin || minPrice, priceMax || maxPrice];

  var conditions = [];
  if (idRoute) conditions.push("idRoutes = 2");
  if (cityEski)
    conditions.push(
      "dep_stations.city = 'Eski Qırım' OR arr_stations.city = 'Eski Qırım'"
    );
  // Соединяем условия с помощью оператора AND и добавляем их к SQL-запросу
  if (conditions.length > 0) {
    sql += " AND " + conditions.join(" AND ");
  }

  // Запрос к базе данных на получение списка квартир с применением фильтров
  db.query(sql, params, function (error, results, fields) {
    if (error) throw error;

    // Отправка списка квартир на клиент
    res.render("admin", {
      routes: results,
      priceMin: priceMin,
      priceMax: priceMax,
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
