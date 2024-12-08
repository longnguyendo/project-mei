const express = require('express');
const routes = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
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
 * Admin - Login Page
*/
// routes.get => neu nhan dc routes (hppt adress), 
// ('dia chia', bien , fn() => {})
routes.get('/admin', async (req, res) => {

    try {
        const locals = {
            title: "Admin Panel",
            description: "Admin panel for managing blog posts and users (include admin)"
        }

        // const data = await Post.find({});

        // response .render = chay chtrinh o dia chi nay,
        // response .send = gui tinh hieu cho web
        // response.json = gui du lieu json cho web
        // response.redirect = chuyen huong den mot trang khac

        // const data = await Post.find({});
        // res.render('admin/index', { locals, data, adminLayout });
        //                'dia chi', { gui bien vao trong dia chi }
        // render admin/index.ejs
        res.render('admin/index', { locals, layout: adminLayout });
    } catch (err) { 
        console.log(err); 
    }
})



/**
 * POST /
 * Admin - Check Login
*/
routes.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne( { username } );

    if(!user) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
      return res.status(401).json( { message: 'Invalid credentials' } );
    }

    const token = jwt.sign({ userId: user._id}, jwtSecret );
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/admin/dashboard');

  } catch (error) {
    console.log(error);
  }
});

/**
 * GET /
 * Admin Dashboard
*/

routes.get('/admin/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await Post.find();
    // const user = await User.findOne({ username });
    res.render('admin/dashboard', {
      locals,
      data,
      // user,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }
//-
});

/**
 * GET /
 * Admin - Create New Post
*/
routes.get('/admin/add-post', authMiddleware, async (req, res) => {
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
routes.post('/admin/add-post', authMiddleware, async (req, res) => {
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

/**
 * GET /
 * Read Post from admin
 * /posts
*/
routes.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });
    const comments = await Comment.find({ postId: data._id });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      comments,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * Read Post from admin
 * admin/post/:id
*/
routes.get('/admin/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });
    const comments = await Comment.find({ postId: data._id });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('admin/post', { 
      locals,
      data,
      comments,
      layout: adminLayout 
    });
  } catch (error) {
    console.log(error);
  }

});
/**
 * GET /
 * Read update edit-post/:id form admin
*/
routes.get('/admin/edit-post/:id', authMiddleware, async (req, res) => {
  try {

    const locals = {
      title: "Edit Post",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout
    })

  } catch (error) {
    console.log(error);
  }

});

/**
 * PUT /
 * Update edit-post/:id from admin
*/
routes.put('/admin/edit-post/:id', authMiddleware, async (req, res) => {
  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });

    res.redirect(`/admin/post/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }

});

/**
 * DELETE /
 * Delete post/:id from admin
*/
routes.delete('/admin/delete-post/:id', authMiddleware, async (req, res) => {

  try {
    await Post.deleteOne( { _id: req.params.id } );
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.log(error);
  }

});

/**
 * POST /
 * Admin - Register
*/
routes.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password:hashedPassword });
      res.redirect('/admin/dashboard');
    } catch (error) {
      if(error.code === 11000) {
        res.status(409).json({ message: 'User already in use'});
      }
      res.status(500).json({ message: 'Internal server error'})
    }

  } catch (error) {
    console.log(error);
  }
});


/**
 * USERRSSS
 * GET /
 * CRUD accounts from admin
*/

routes.get('/admin/users', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }
    
    // const data = await Post.find();
    const users = await User.find();
    res.render('admin/users', {
      locals,
      users,
      layout: adminLayout
    });

  } catch (error) {
    console.log(error);
  }
//-
});


/**
 * GET /
 * Read user from admin
 * admin/user/:id
*/
routes.get('/admin/user/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('admin/', { 
      locals,
      data,
      currentRoute: `/users/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});
/**
 * GET /
 * Read update post/:id form admin
*/
routes.get('/admin/edit-user/:id', authMiddleware, async (req, res) => {
  try {

    const locals = {
      title: "Edit User",
      description: "Free NodeJs User Management System",
    };

    const data = await Post.findOne({ _id: req.params.id });

    res.render('admin/users/edit-user', {
      locals,
      data,
      layout: adminLayout
    })

  } catch (error) {
    console.log(error);
  }

});

/**
 * PUT /
 * Update post/:id from admin
*/
routes.put('/admin/users/edit-user/:id', authMiddleware, async (req, res) => {
  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    });

    res.redirect(`/admin/users/edit-user/${req.params.id}`);

  } catch (error) {
    console.log(error);
  }

});

/**
 * DELETE /
 * Delete /delete-user/:id from admin
*/
routes.delete('/admin/users/delete-user/:id', authMiddleware, async (req, res) => {

  try {
    await Post.deleteOne( { _id: req.params.id } );
    res.redirect('/admin/users');
  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * Logout from admin
*/
routes.get('/logout', (req, res) => {
  res.clearCookie('token');
  //res.json({ message: 'Logout successful.'});
  res.redirect('/');
});


module.exports = routes;