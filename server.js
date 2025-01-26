const mongoose = require('mongoose');
const app = require(`./app`);

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

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

// console.log(process.env);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port - ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(
    ` error message from server.js unhandledRejection - ${err.name} ${err.message}`
  );
  server.close(() => {
    process.exit(1);
  });
});


process.on('uncaughtException', err => {
    console.log(
        ` error message from server.js uncaughtException - ${err.name} ${err.message}`
      );
      server.close(() => {
          process.exit(1);
        });
      });
      
      // console.log(`${1/0}`)
      // console.log(x)