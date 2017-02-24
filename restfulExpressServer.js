'use strict'

var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var port = 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
var morgan = require('morgan');

app.post('/pets', function(req, res){
  if (req.body !== '{}') {
    if (req.body.age && req.body.name && req.body.kind) {
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
    }
    else {
      console.log(req.body);

      return res.sendStatus(400);
    }
  }
  else {
    return res.sendStatus(404);
  }
})

app.listen(port, function(){
  console.log('Listening on ' + port);
});

app.get('/pets', function(req, res){
  fs.readFile('pets.json', 'utf8', function(err,data){
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
      res.set('Content-Type', 'text/plain');
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'match/json');
    res.send(pets[id]);
  });
});

app.patch('/pets/:id', function(req, res){
  fs.readFile('pets.json', 'utf8', function(err, data){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    const pets = JSON.parse(data);
    let id = Number(req.params.id);
    let pet = pets[id];
    if (pet === undefined) {
      res.set('Content-Type', 'matching/json');
      res.sendStatus(400);
    }
    else if (pet !== undefined) {
      if (req.body.kind) {
        pet.kind = req.body.kind;
      }
      if (req.body.age) {
        pet.age = req.body.age;
      }
      if (req.body.name) {
        pet.name = req.body.name;
      }
    }
    let petsJSON = JSON.stringify(pets)
    fs.writeFile('pets.json', petsJSON, function(err){
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      res.set('Content-Type', 'matching/json');
      res.send(pet);
    });
  });
});

app.delete('/pets/:id', function(req, res){
  fs.readFile('pets.json', 'utf8', function(err, data){
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    const pets = JSON.parse(data);
    let id = Number(req.params.id);
    let pet = pets[id];
    if (pet === undefined) {
      res.set('Content-Type', 'matching/json');
      res.sendStatus(400);
    }
    else if (pet !== undefined) {
      pets.splice(pets.indexOf(id), 1);
    }
    let petsJSON = JSON.stringify(pets)
    fs.writeFile('pets.json', petsJSON, function(err){
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      res.set('Content-Type', 'matching/json');
      res.send(pet);
    });
  });
});

app.use(function (req, res, next){
  res.status(404).send("Sorry, can't find it!");
})


module.exports = app;
