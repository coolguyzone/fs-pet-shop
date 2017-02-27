#!/usr/bin/env node


'use strict';


const fs = require('fs');
const cmd = process.argv[2];
const path = require('path');
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);



if (cmd === 'read')
{
  fs.readFile('pets.json', 'utf8', function(err, data) {
    if (err) {
      throw err;
    }

    if (process.argv[3]) {
      if (JSON.parse(data)[process.argv[3]] === undefined) {
        console.error(`Usage: ${node} ${file} read INDEX`);
        process.exit(1);
      }
      else {
        console.log(JSON.parse(data)[process.argv[3]]);
      }
    }
    else {
      console.log(JSON.parse(data));
    }
  });
}

else if (cmd === 'create') {
  fs.readFile('pets.json', 'utf8', function(err, data) {
     if (err) {
       throw err;
     }
     if (process.argv[3] && process.argv[4] && process.argv[5]) {
       let pets = JSON.parse(data);
       let newPet = {
         age: parseInt(process.argv[3]),
         kind: process.argv[4],
         name: process.argv[5]
       }
       pets.push(newPet);

       let petsJSON = JSON.stringify(pets);

       fs.writeFile('pets.json', petsJSON, function(writeErr) {
         if (writeErr) {
           throw writeErr;
         }
         console.log(newPet);
       });
     }
     else {
       console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
       process.exit(1);
     }
  });
}

else if (cmd === 'update') {
  fs.readFile('pets.json', 'utf8', function(err, data) {
     if (err) {
       throw err;
     }
     if (process.argv[3] && process.argv[4] && process.argv[5] && process.argv[5]) {
       let pets = JSON.parse(data);
       pets[process.argv[3]] = {
         age: parseInt(process.argv[4]),
         kind: process.argv[5],
         name: process.argv[6]
       }

     let petsJSON = JSON.stringify(pets);
     console.log(petsJSON)

     fs.writeFile('pets.json', petsJSON, function(writeErr) {
       if (writeErr) {
         throw writeErr;
       }
     })
    }

     else {
       console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
       process.exit(1);
      }
  });
}

else if (cmd === 'destroy') {
  fs.readFile('pets.json', 'utf8', function(err, data) {
   if (err) {
     throw err;
   }
   if (process.argv[3]) {
    let pets = JSON.parse(data);
    pets.splice(parseInt(process.argv[3]), 1);
    let petsJSON = JSON.stringify(pets);
    console.log(petsJSON);

    fs.writeFile('pets.json', petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
   })
 }
   else {
     console.error(`Usage: ${node} ${file} destroy INDEX`);
     process.exit(1);
   }
 });
}

else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
