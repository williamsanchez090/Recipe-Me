const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
var passport = require('passport');
var multer = require('multer')
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId
let db

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config();

app.use(express.urlencoded( { extended: true } ));
app.use(express.static('public'));
app.use(expressLayouts);

app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGODB_URI, (err, database) => {
  if (err) return console.log(err)
  db = database
  // require('./server/routes/recipeRoutes')(app, passport, db, multer, ObjectId);
  
}); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
// end of config

const routes = require('./server/routes/recipeRoutes.js')
app.use('/', routes);

app.listen(port, ()=> console.log(`Listening to port ${port}`));