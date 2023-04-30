const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const ejs = require("ejs");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "wtpfhm123",
  database: "dealership2",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

db.query(`
  CREATE TABLE IF NOT EXISTS car_audio (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    power INT NOT NULL,
    speakers INT NOT NULL,
    subwoofers INT NOT NULL,
    amplifier VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
  )
`,
  (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("car_audio table created");
    }
  }
);



app.get("/second", (req, res) => {
  db.query("SELECT * FROM car_audio", (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error retrieving car_audio");
    } else {
      res.render("second", { car_audio: results });
    }
  });
});

app.get("/", function (req, res) {
  res.redirect("/second");
});

app.get("/second", function (req, res) {
  // ...код для обработки запросов на маршрут /second
});


app.get('/add', function(req, res){
  res.render('add');
});

app.post('/save', function(req, res){
  let data = req.body;
  db.query('INSERT INTO car_audio SET ?', data, function(err, results){
    if(err) throw err;
    res.redirect('/second');
  });
});


app.get('/view/:id', function(req, res){
  let id = req.params.id;
  db.query('SELECT * FROM car_audio WHERE id = ?', [id], function(err, results){
    if(err) throw err;
    res.render('view', {car_audio: results[0]});
  });
});

app.get('/second', function(req, res){
  db.query('SELECT * FROM car_audio', function(err, results){
    if(err) throw err;
    res.render('second', {car_audio: results});
  });
});


// GET request to display the form
app.get("/second2", (req, res) => {
  res.render("second2");
});

// POST request to process the form data
app.post("/second2", (req, res) => {
  const carAudio = new CarAudio({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    power: req.body.power,
    speakers: req.body.speakers,
    subwoofers: req.body.subwoofers,
    amplifier: req.body.amplifier,
    brand: req.body.brand,
    image_url: req.body.image_url,
  });

  carAudio.save()
    .then(() => {
      res.send("Car audio added successfully!");
    })
    .catch((err) => {
      console.log(err);
      res.send("Error adding car audio");
    });
});

app.get('/edit/:id', function(req, res){
  let id = req.params.id;
  db.query('SELECT * FROM car_audio WHERE id = ?', [id], function(err, results){
    if(err) throw err;
    res.render('edit', {car_audio: results[0]});
  });
});

app.post('/update/:id', function(req, res){
  let id = req.params.id;
  let data = req.body;
  db.query('UPDATE car_audio SET ? WHERE id = ?', [data, id], function(err, results){
    if(err) throw err;
    res.redirect('/second');
  });
});

// маршрут для отображения страницы редактирования автомобильного аудио
app.get('/car_audio/:id/edit', (req, res, next) => {
  const carAudioId = req.params.id;
  CarAudio.findById(carAudioId)
    .then(carAudio => {
      res.render('edit', { car_audio: carAudio });
    })
    .catch(err => console.log(err));
});

// маршрут для обновления данных об автомобильном аудио в базе данных
app.put('/car_audio/:id', (req, res, next) => {
  const carAudioId = req.params.id;
  CarAudio.findByIdAndUpdate(carAudioId, req.body)
    .then(() => {
      res.redirect('/car_audio');
    })
    .catch(err => console.log(err));
});


app.get('/delete/:id', function(req, res){
  let id = req.params.id;
  db.query('DELETE FROM car_audio WHERE id = ?', [id], function(err, results){
    if(err) throw err;
    res.redirect('/second');
  });
});



function createCarAudio(req, res) {
  const { name, description, price, power, speakers, subwoofers, amplifier, brand, image_url } = req.body;
  const query = "INSERT INTO car_audio (name, description, price, power, speakers, subwoofers, amplifier, brand, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(query, [name, description, price, power, speakers, subwoofers, amplifier, brand, image_url], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error creating car audio");
    } else {
      console.log("New car audio created");
      res.redirect("/second");
    }
  });
}
app.post("/car_audio", createCarAudio);


function updateCarAudio(req, res) {
  const id = req.params.id;
  const { name, description, price, power, speakers, subwoofers, amplifier, brand, image_url } = req.body;
  const query = "UPDATE car_audio SET name=?, description=?, price=?, power=?, speakers=?, subwoofers=?, amplifier=?, brand=?, image_url=? WHERE id=?";
  db.query(query, [name, description, price, power, speakers, subwoofers, amplifier, brand, image_url, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error updating car audio");
    } else {
      console.log("Car audio updated");
      res.redirect("/second");
    }
  });
}

app.put("/car_audio/:id", updateCarAudio);
app.post("/car_audio/:id", updateCarAudio);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
