const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const methodOverride = require('method-override');
const mongoose = require('mongoose');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const app = express();
const sess = {
  secret: 'secret',
  cookie: {},
  resave: false,
  saveUninitialized: true
}

// Import Route
const blogs = require('./routes/blogs');
const users = require('./routes/users');

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/database');

app.use(favicon(path.join(__dirname, 'public', 'assets', 'favicon.ico')));

mongoose.connect(db.mongoURI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));


app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


// Static Folder
const publicPath = path.join(__dirname, 'public');
app.use('/', express.static(publicPath));


app.use(methodOverride('_method'));


app.use(session(sess));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.get('/', (req, res) => {
  const title = 'We means it';
  res.render('index', {
    title: title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

// Use Routes
app.use('/blogs', blogs);
app.use('/users', users);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on port ${port}...`));