const express = require('express');
const router = express.Router();
const User = require('../models/user.js');

// INDEX - community page
router.get('/', async (req, res) => {
  try {
    const users = await User.find({});
    res.render('users/index.ejs', { users });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// SHOW - specific user's pantry
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.render('users/show.ejs', { user });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

module.exports = router;
