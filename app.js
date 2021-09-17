const express = require('express');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/database');
const PORT = process.env.PORT ||8700;


//database connection

connectDB();

// Init App
const app = express();

// Bring in Models
let { Article } = require('./models/article');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse application/json
app.use(express.json());


// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));


// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Passport Config
require('./middleware/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});


// Route Files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

// Start Server
app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
