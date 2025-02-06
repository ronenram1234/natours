const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// console.log(DB);
mongoose.connect(DB).then(con => {
  // console.log(con.connections)
  // console.log('_readyState:', con.connections[0]._readyState);
  if (con.connections[0]._readyState === 1) {
    console.log('The DB connection is "connected".');
  }
});

//   read file
// console.log(__dirname)
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);

// improt data
const importData = async () => {
    try {
        await Tour.create(tours);
        process.exit()
        console.log('Data loaded');
    } catch (err) {
        console.log(err);
        process.exit()
    }
};

// delete all collection data
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data deleted');
        process.exit()
    } catch (err) {
        console.log(err);
        process.exit()
    }
};
// console.log(process.argv);
if (process.argv[2] == '--import') importData();
else if (process.argv[2] == '--delete') deleteData();
