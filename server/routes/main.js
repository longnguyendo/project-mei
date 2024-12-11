const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let data = await Post.find();
    data = data.reverse();
    res.render('index', { 
      locals,
      data,

    });

  } catch (error) {
    console.log(error);
  }

});



/**
 * GET /
 * Read Post from admin
 * /post/id
*/
router.get('/post/:id', async (req, res) => {
  try {

    let slug = req.params.id;
    console.log("slug: ", slug);
    const data = await Post.findById({ _id: slug });
    const comments_ = await Comment.find();
    let comments_2 = new Array();
    comments_.forEach(comment => {
      if (data._id.equals(comment.postId)) {
        comments_2.push(comment);
      }
    });
    comments_2 = comments_2.reverse();
    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      comments: comments_2,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});



/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', {
    currentRoute: '/contact'
  });
});



module.exports = router;