'use strict'

var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

var port = 8000;

app.get('/pets', function(req, res) {
  fs.readFile('pets.json', 'utf8', function(err, data){
    if (err) {
      throw err;
      res.status(500).send('you goofed!');
    }
    else {
      res.send(JSON.parse(data));
    }
  });
});

app.get('/pets/:id', function(req, res){
  fs.readFile('pets.json', 'utf8', function(err, data){
    if (err) {
      console.log(err.stack);
      return res.sendStatus(500);
    }
    var id = parseInt(req.params.id);
    var pets = JSON.parse(data);

    if (id < 0 || id >= pets.length || Number.isNaN(id)) {
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'match/json');
    res.send(pets[id]);
  });
});

app.post('/pets', function(req, res){
  fs.readFile('pets.json', 'utf8', function(err, data){
    if (err) {
      console.log(err.stack);
      return res.sendStatus(500);
    }
    var pets = JSON.parse(data);
    var newPet = {
      age: req.body.age,
      name: req.body.name,
      kind: req.body.kind
    }
    pets.push(newPet);

    var petsJSON = JSON.stringify(pets);

    fs.writeFile('pets.json', petsJSON, function(writeErr) {
      if(writeErr) {
        throw writeErr;
      }
    });
  });
  res.json({
    "name": req.body.name,
    "age": req.body.age,
    "kind": req.body.kind
  });
})

app.listen(port, function(){
  console.log('Listening on ' + port);
});

module.exports = app;