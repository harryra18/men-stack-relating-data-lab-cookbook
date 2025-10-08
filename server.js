// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');

const app = express();
const PORT = 3000;

// ---------- CONTROLLERS ----------
const authController = require('./controllers/auth.js');
const foodsController = require('./controllers/foods.js');
const usersController = require('./controllers/users.js');

// ---------- MIDDLEWARE ----------
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// ---------- DATABASE CONNECTION ----------
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// ---------- EXPRESS CONFIG ----------
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ---------- SESSION ----------
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
}));

// ---------- CUSTOM MIDDLEWARE ----------
app.use(passUserToView); // makes user available in all views

// ---------- ROUTES ----------
app.use('/auth', authController);  // sign-in/sign-up routes
app.use(isSignedIn);               // protect all routes below for signed-in users
app.use('/users/:userId/foods', foodsController); // pantry routes
app.use('/users', usersController); // community routes

// ---------- HOME ROUTE ----------
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});