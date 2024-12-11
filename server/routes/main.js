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

    // let perPage = 10;
    // let page = req.query.page || 1;

    // const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    // .skip(perPage * page - perPage)
    // .limit(perPage)
    // .exec();

    let data = await Post.find();
    data = data.reverse();
    // console.log(data[1].createAT)

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    // const count = await Post.countDocuments({});
    // const nextPage = parseInt(page) + 1;
    // const hasNextPage = nextPage <= Math.ceil(count / perPage);

    // console.log(data2);
    res.render('index', { 
      locals,
      data,
      // current: page,
      // nextPage: hasNextPage ? nextPage : null,
      // currentRoute: '/'
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
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Seach",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
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