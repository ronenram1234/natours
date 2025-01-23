
const mongoose = require('mongoose');
const app = require(`./app`);

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// console.log(DB);
mongoose.connect(DB)
  .then(con => {
    // console.log(con.connections)
    // console.log('_readyState:', con.connections[0]._readyState);
    if (con.connections[0]._readyState === 1) {
      console.log('The DB connection is "connected".');
    }
  });


// const testTour = new Tour({
//   name:'the Forest Hicker',
//   rating:4.7,
//   price: 497,
// })

// testTour.save().then(
//   doc=>{
//     console.log(doc)
//   }).catch(err=>
//     console.log('Errorsave db',err)
  
// )
// console.log(module)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port - ${port}`);
});
