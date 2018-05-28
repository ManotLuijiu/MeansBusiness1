const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {
  ensureAuthenticated
} = require('../helpers/auth');



require('../models/Blog');
const Blog = mongoose.model('blogs');

// Blogs Index Page
router.get('/', ensureAuthenticated, (req, res) => {
  Blog.find({
    user: req.user.id
  }).sort({
    date: 'desc'
  }).then(blogs => {
    res.render('blogs/index', {
      blogs: blogs
    });
  });
});

// Add Blog Form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('blogs/add');
});

// Edit Blog Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Blog.findOne({
    _id: req.params.id
  }).then(blog => {
    if (blog.user != req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/blogs');
    } else {
      res.render('blogs/edit', {
        blog
      });
    }
  });
});

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      text: 'Please add a title'
    });
  };

  if (!req.body.details) {
    errors.push({
      text: 'Please add some details'
    });
  };

  if (errors.length > 0) {
    res.render('blogs/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Blog(newUser).save().then(blog => {
      req.flash('success_msg', 'Blog added');
      res.redirect('/blogs');
    })
  }
});

// Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Blog.findOne({
    _id: req.params.id
  }).then(blog => {
    // New values
    blog.title = req.body.title;
    blog.details = req.body.details;

    blog.save().then(blog => {
      req.flash('success_msg', 'Blog updated');
      res.redirect('/blogs');
    });
  });
});

// Delete Blog
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Blog.remove({
    _id: req.params.id
  }).then(() => {
    req.flash('success_msg', 'Blog removed');
    res.redirect('/blogs');
  });
});

module.exports = router;