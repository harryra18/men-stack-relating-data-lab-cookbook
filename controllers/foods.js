const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user.js');

// INDEX - show all foods in current user's pantry
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('foods/index.ejs', { pantry: user.pantry, user });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// NEW - add new food
router.get('/new', (req, res) => {
  res.render('foods/new.ejs');
});

// CREATE - add new food to pantry
router.post('/', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.pantry.push({ name: req.body.name });
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// EDIT
router.get('/:itemId/edit', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.pantry.id(req.params.itemId);
    res.render('foods/edit.ejs', { food, user });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// UPDATE
router.put('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const food = user.pantry.id(req.params.itemId);
    food.set(req.body);
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

// DELETE
router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.pantry.id(req.params.itemId).remove();
    await user.save();
    res.redirect(`/users/${user._id}/foods`);
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
});

module.exports = router;
