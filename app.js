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
  boughtTicketID INT NOT NULL,
  email VARCHAR(255) NOT NULL,
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
  `CREATE TABLE IF NOT EXISTS users (
  idUser INT NOT NULL,
  userLogin VARCHAR(255) NOT NULL,
  userPassword VARCHAR(255) NOT NULL,
  userboughtTicketsId INT NOT NULL,
  isAdmin BOOL NOT NULL,
  PRIMARY KEY (idUser)
)`,
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("customers, stations, routes, users tables created");
    }
  }
);

db.query(
  `INSERT INTO stations VALUES (0,'Kipushnaya','Keriç'),
  (1,'Kavkazskaya','Aqyar'),
  (2,'Eşıl-adayskaya','Aqmescıt'),
  (3,'Osmanskaya','Eski Qırım'),
  (4,'Bebrito','Kefe'),
  (5,'Mussolini','Kezlev'),
  (6,'Elvino','Aqyar')`,
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("inserted into stations");
    }
  }
);

db.query(
  `INSERT INTO customers VALUES (0,1,'email0@gmail.com'),
  (1,7,'my_email@yahoo.com'),
  (2,8,'totally_real_user@zvonite.mne'),
  (3,3,'elvin@loh.ru'),
  (4,4,'bebra@amogus.sus'),
  (5,7,'vova_loshara@gmail.com')`,
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("inserted into stations");
    }
  }
);

db.query(
  `INSERT INTO users VALUES (0,'totally@mail.ru','normal',NULL,0),
  (1,'admin@mail.ru','admin_password',NULL,1),
  (2,'email@gmail.com','password',3,0)`,
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("inserted into stations");
    }
  }
);

db.query(
  `INSERT INTO routes VALUES (0,'2022-07-01','22:15:36',6,4,250),
  (1,'2022-07-02','22:15:36',0,3,300),
  (2,'2022-07-03','22:15:36',4,2,350),
  (3,'2022-07-04','22:15:36',3,1,400),
  (4,'2022-07-05','22:15:36',1,0,450),
  (5,'2022-07-06','22:15:36',2,5,500),
  (6,'2022-08-10','22:15:37',4,6,550),
  (7,'2022-08-11','22:15:38',4,5,600),
  (8,'2023-05-03','00:00:00',0,2,50),
  (9,'2023-05-03','03:34:00',6,4,300)`,
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("inserted into stations");
    }
  }
);

const allCities = [];

db.query(`SELECT DISTINCT city FROM stations`, (err, result) => {
  if (err) throw err;
  allCities.push(...result.map((result) => result.city));
});

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
    stations AS arr_stations ON routes.arrival_station = arr_stations.idStations`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving routes");
      } else {
        res.render("user", {
          routes: results,
          cities: allCities,
          isFirstChecked: false,
          isSecondChecked: false,
          priceMin: 0,
          priceMax: 1000,
        });
      }
    }
  );
});

app.get("/admin_login", function (req, res) {
  res.render("admin_login");
});

app.post("/admin_login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const sql = `SELECT idUser, userEmail, userPassword, userboughtTicketsId, isAdmin FROM users WHERE userEmail = ? AND userPassword = ?`;
  params = [email, password];
  db.query(sql, params, function (err, results) {
    if (results.length > 0) {
      if (results[0].isAdmin) {
        res.redirect("/admin");
      }
    } else {
      res.redirect("/user");
    }
  });
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
    stations AS arr_stations ON routes.arrival_station = arr_stations.idStations`,
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error retrieving routes");
      } else {
        res.render("admin", {
          routes: results,
          cities: allCities,
          isFirstChecked: false,
          isSecondChecked: false,
          priceMin: 0,
          priceMax: 1000,
        });
      }
    }
  );
});

app.get("/filter_user", function (req, res) {
  // Получение параметров запроса
  var priceMin = req.query.minPriceInput;
  var priceMax = req.query.maxPriceInput;
  var departure_station_city = req.query.departure_station_city;
  var arrival_station_city = req.query.arrival_station_city;
  var minPrice = 0; // устанавливаем минимальную цену по умолчанию
  var maxPrice = 9999; // устанавливаем максимальную цену по умолчанию
  let cityConditionDeparture = "";
  let cityConditionArrival = "";
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
      price >= ? and price <= ?
      ${cityConditionDeparture}${cityConditionArrival}`;
  var params = [priceMin || minPrice, priceMax || maxPrice];
  if (departure_station_city && departure_station_city !== "") {
    sql += " AND dep_stations.city = ?";
    params.push(departure_station_city);
  } else {
    sql += " AND dep_stations.city IS NOT NULL";
  }
  if (arrival_station_city && arrival_station_city !== "") {
    sql += " AND arr_stations.city = ?";
    params.push(arrival_station_city);
  } else {
    sql += " AND arr_stations.city IS NOT NULL";
  }
  var conditions = [];
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
      cities: allCities,
      priceMin: priceMin,
      priceMax: priceMax,
    });
  });
});

app.get("/filter_admin", function (req, res) {
  // Получение параметров запроса
  var priceMin = req.query.minPriceInput;
  var priceMax = req.query.maxPriceInput;
  var departure_station_city = req.query.departure_station_city;
  var arrival_station_city = req.query.arrival_station_city;
  var minPrice = 0; // устанавливаем минимальную цену по умолчанию
  var maxPrice = 9999; // устанавливаем максимальную цену по умолчанию
  let cityConditionDeparture = "";
  let cityConditionArrival = "";
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
      price >= ? and price <= ?
      ${cityConditionDeparture}${cityConditionArrival}`;
  var params = [priceMin || minPrice, priceMax || maxPrice];
  if (departure_station_city && departure_station_city !== "") {
    sql += " AND dep_stations.city = ?";
    params.push(departure_station_city);
  } else {
    sql += " AND dep_stations.city IS NOT NULL";
  }
  if (arrival_station_city && arrival_station_city !== "") {
    sql += " AND arr_stations.city = ?";
    params.push(arrival_station_city);
  } else {
    sql += " AND arr_stations.city IS NOT NULL";
  }
  var conditions = [];
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
      cities: allCities,
      priceMin: priceMin,
      priceMax: priceMax,
    });
  });
});

app.get("/buy_ticket/ticket_id_:id", function (req, res) {
  let id = req.params.id;
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
    WHERE idRoutes = ?`,
    [id],
    function (err, results) {
      if (err) throw err;
      res.render("buy_ticket", { routes: results[0], isBought: false });
    }
  );
});

app.post("/buy_ticket", function (req, res) {
  let ticket_id = req.body.ticket_id;
  let email = req.body.email;

  let sql = "SELECT MAX(idCustomers) AS maxId FROM customers";
  db.query(sql, function (error, results, field) {
    if (error) throw error;
    let nextCustomerId = results[0].maxId + 1;
    let sql =
      "INSERT INTO customers (idCustomers, boughtTicketID, email) VALUES (?, ?, ?)";
    let params = [nextCustomerId, ticket_id, email];
    db.query(sql, params, function (error, results, fields) {
      if (error) throw error;
      let sql = `SELECT
    routes.idRoutes,
    routes.departure_date,
    routes.departure_time,
    departure_station.city AS departure_city,
    arrival_station.city AS arrival_city,
    routes.price,
    customers.email
FROM
    routes
        JOIN
    customers ON routes.idRoutes = customers.boughtTicketID
        JOIN
    stations AS departure_station ON routes.departure_station = departure_station.idStations
        JOIN
    stations AS arrival_station ON routes.arrival_station = arrival_station.idStations
      WHERE idRoutes = ?`;
      let params = [ticket_id];
      db.query(sql, params, function (error, results, fields) {
        if (error) throw error;
        let ticket = results.length > 0 ? results[0] : null;
        res.render("user_panel", {
          ticket: ticket,
          email: email,
        });
      });
    });
  });
});

app.get("/user_panel", function (req, res) {
  res.render("user_panel", {
    ticket: null,
    email: null,
  });
});

app.get("/create_route", function (req, res) {
  db.query(`SELECT * FROM stations`, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving routes");
    } else {
      res.render("create_route", {
        stations: results,
      });
    }
  });
});

app.post("/create_route", function (req, res) {
  let departureDate = req.body.departure_date;
  let departureTime = req.body.departure_time;
  let departureStation = req.body.departure_station;
  let arrivalStation = req.body.arrival_station;
  let price = req.body.price;

  if (departureStation === arrivalStation) {
    res
      .status(400)
      .send(`Departure station cannot be the same as arrival station`);
    return;
  }

  let sql = `SELECT MAX(idRoutes) AS maxId FROM routes`;
  db.query(sql, function (err, results, field) {
    if (err) throw error;
    let nextRouteId = results[0].maxId + 1;
    sql = `INSERT INTO routes (idRoutes, departure_date, departure_time, departure_station, arrival_station, price) VALUES (?, ?, ?, ?, ?, ?)`;
    let params = [
      nextRouteId,
      departureDate,
      departureTime,
      departureStation,
      arrivalStation,
      price,
    ];
    db.query(sql, params, function (error, results, fields) {
      if (error) throw error;
      res.redirect("/admin");
    });
  });
});

app.get("/delete_route/route_id_:id", function (req, res) {
  let id = req.params.id;
  let sql = `DELETE FROM routes WHERE idRoutes = ?`;
  db.query(sql, [id], function (err, results) {
    if (err) throw err;
    console.log(`route with ID = ${id} deleted`);
    res.redirect("/admin");
  });
});

app.get("/edit_route/route_id_:id", function (req, res) {
  let route_id = req.params.id;
  let sql = `SELECT
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
  WHERE routes.idRoutes = ?`;
  let params = [route_id];
  db.query(sql, params, function (err, results) {
    if (err) throw err;
    let route = results[0];
    route.departure_station_city =
      route.departure_station_name + ", " + route.departure_station_city;
    route.arrival_station_city =
      route.arrival_station_name + ", " + route.arrival_station_city;
    sql = `SELECT * FROM stations`;
    db.query(sql, function (err, results, fields) {
      if (err) throw err;
      let departure_station = results.find(
        (station) => station.idStations === route.departure_station
      );
      let arrival_station = results.find(
        (station) => station.idStations === route.arrival_station
      );
      res.render("edit_route", {
        route: route,
        stations: results,
        departure_station: departure_station,
        arrival_station: arrival_station,
      });
    });
  });
});

app.post("/edit_route/route_id_:id", function (req, res) {
  let route_id = req.params.id;
  let departure_date = req.body.departure_date;
  let departure_time = req.body.departure_time;
  let departure_station = req.body.departure_station;
  let arrival_station = req.body.arrival_station;
  let price = req.body.price;

  let sql = `UPDATE routes SET departure_date = ?, departure_time = ?, departure_station = ?, arrival_station = ?, price = ? WHERE idRoutes = ?`;
  let params = [
    departure_date,
    departure_time,
    departure_station,
    arrival_station,
    price,
    route_id,
  ];
  db.query(sql, params, function (err, result) {
    if (err) throw err;
    console.log(`Route ${route_id} updated successfully`);
    res.redirect("/admin");
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/reports", function (req, res) {
  res.render("reports", {
    table_data: [],
    field_names: [],
    route: [],
    route_info: [],
  });
});

app.post("/report_users", function (req, res) {
  db.query(`SELECT * FROM users`, function (err, results, fields) {
    if (err) throw err;
    const fieldNames = fields.map((field) => field.name);
    res.render("reports", {
      table_data: results,
      field_names: fieldNames,
      route: "users",
      route_info: [],
    });
  });
});

app.post("/report_customers", function (req, res) {
  db.query(`SELECT * FROM customers`, function (err, results, fields) {
    if (err) throw err;
    const fieldNames = fields.map((field) => field.name);
    res.render("reports", {
      table_data: results,
      field_names: fieldNames,
      route: "customers",
      route_info: [],
    });
  });
});

app.post("/report_route_:id", function (req, res) {
  let id = req.params.id;
  db.query(`SELECT * FROM customers`, function (err, results, fields) {
    if (err) throw err;
    const fieldNames = fields.map((field) => field.name);
    let sql = `SELECT
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
  WHERE routes.idRoutes = ?`;
    let params = [id];
    db.query(sql, params, function (err, result) {
      res.render("reports", {
        table_data: results,
        field_names: fieldNames,
        route: "customers",
        route_info: result,
      });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
