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
const emailVerify = require("./routes/emailVerify");
require('./auth/auth');
require('./auth/authAdmin');
require('./auth/authMentor');


if(process.env.NODE_ENV === 'production'){
  app.use(express.static('../client/build'));
} 
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use("/api", students);
app.use("/api/mentor", mentors);
app.use("/api/admin", admins);
app.use("/api/email", emailVerify);

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true, useFindAndModify: false})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open',() => console.log('Connected to Mongoose! Database is up!!'))

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json(err);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));