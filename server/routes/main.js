const express = require('express');
const routes = express.Router();
const Post = require('../models/post');

// Routes
// GET / 
// Home 

routes.get('', async (req, res) => {

    const locals = {
        title: "CRUD Project",
        description: "Simple blog crud with nodejs, express, mongodb. "
    }

    try {
        const data = await Post.find();
        res.render('index', { locals, data });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// function insertPostData() {
//     Post.insertMany([
//         {
//             title: 'First Post',
//             body: 'This is the first post in the blog.'
//         },
//         {
//             title: 'First Post',
//             body: 'This is the first post in the blog.'
//         },
//         {
//             title: 'First Post',
//             body: 'This is the first post in the blog.'
//         },
//         {
//             title: 'First Post',
//             body: 'This is the first post in the blog.'
//         },
//         {
//             title: 'First Post',
//             body: 'This is the first post in the blog.'
//         },
//     ])
// }

// insertPostData();






routes.get('/about', (req, res) => {
    res.render('about');
});

module.exports = routes;