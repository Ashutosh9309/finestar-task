const express = require('express');
const router = express.Router();
const { Article } = require('../models/article');
const { User } = require('../models/user');



// Add Submit POST Route
router.post('/add', async (req, res) => {
  try {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Get Errors
    let errors = req.validationErrors();

    if (errors) {
      res.render('add_article', {
        title: 'Add Article',
        errors: errors
      });
    } else {
      let article = await Article.create({
        title: req.body.title,
        author: req.user._id,
        body: req.body.body,
      });
      article.save();
      res.send(article);
    }
  } catch (e) {
    res.send(e);
  }

});


// Update Submit POST Route
router.post('/edit/:id', async (req, res) => {
  try {
    const article = {
      title: req.body.title,
      author: req.body.name,
      body: req.body.body
    };

    let query = { _id: req.params.id }

    const update = await Article.update(query, article);
    if (update) {
      res.redirect('Updated');
    } return;

  } catch (e) {
    res.send(e);
  }

});

// Delete Article
router.delete('/:id', async (req, res) => {

  try {
    if (!req.user._id) {
      res.status(500).send();
    }
    let query = { _id: req.params.id }
    const article = await Article.findById(req.params.id);

    if (article.author != req.user._id) {
      res.status(500).send();
    } else {
      remove = await Article.findByIdAndRemove(query);
      if (remove) {
        res.send('Success');
      }
    };
  } catch (e) {
    res.send(e);
  }

});



// Get Single Article
router.get('/:id', async (req, res) => {

  const article = await Article.findById(req.params.id);
  const user = await User.findById(article.author);
  if (user) {
    res.send({
      article: article,
      author: user.name
    });
  }
});

module.exports = router;
