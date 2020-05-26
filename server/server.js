if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const students = require("./routes/students");
const mentors = require("./routes/mentors");
const admins = require("./routes/admins");
require('./auth/auth');
require('./auth/authAdmin');
require('./auth/authMentor');


if(process.env.NODE_ENV === 'production'){
  app.use(express.static('../client/build'));
} 
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use("/", students);
app.use("/mentor", mentors);
app.use("/admin", admins);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true  })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open',() => console.log('Connected to Mongoose'))

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));