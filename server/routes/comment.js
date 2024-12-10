const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 * 
 * Check Login
*/


const authMiddleware = (req, res, next ) => {

  const token = req.cookies.token;
  // get token from browser 

  // check token validity
  if(!token) {
    return res.status(401).json( { message: 'Unauthorized'} );
  }

  // then try decode password, next() is middleware for debugging
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch(error) {
    res.status(401).json( { message: 'Unauthorized'} );
  }
}
/**
 * GET /
 * Admin - Create New Post
*/
router.get('admin/add-comment', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: 'Add Post',
        description: 'Simple Blog created with NodeJs, Express & MongoDb.'
      }
  
      const data = await Post.find();
      res.render('admin/add-post', {
        locals,
        layout: adminLayout
      });
  
    } catch (error) {
      console.log(error);
    }
  
});
  
  /**
   * POST /
   * Admin - Create New Post form admin
  */
router.post('/admin/add-comment', authMiddleware, async (req, res) => {
    try {
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });
  
        await Post.create(newPost);
  
        res.redirect('/admin/dashboard');
      } catch (error) {
        console.log(error);
      }
  
    } catch (error) {
      console.log(error);
    }
});
  


module.exports = router;