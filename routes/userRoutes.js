/*******
 Project 9 - REST API 
*******/

const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const User = require('../models').User;

//body parsing
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/*
 * authenticating the user
*/

const authenticatedUser = async (req, res, next) => {
  let message = null;
 const credentials = auth(req);
 if (credentials) {
   const user = await User.findOne({ where: {emailAddress: credentials.name} });
   if (user) {
     const authenticated = bcryptjs
       .compareSync(credentials.pass, user.password);
     if (authenticated) {
       req.currentUser = user;
     } else {
       message = `Authentication failure for username: ${user.username}`;
     }
   } else {
     message = `User not found for username: ${credentials.name}`;
   }
 } else {
   message = 'Auth header not found';
 }
 if (message) {
   console.warn(message);
   res.status(401).json({ message: 'Access Denied' });
 } else {
   next();
 }
};

/*
 * ROUTES *
*/

//returns the currently authenticated user
router.get('/users', authenticatedUser, (req, res) => {
  const userData = req.currentUser;
  res.json(userData);
});

//creates a user, sets the location header to '/', & returns no content
router.post('/users',  async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    res.status(400).json({message: 'No empty objects'});
  }
 try {
    if(req.body.password){
      req.body.password = await bcryptjs.hashSync(req.body.password);
      await User.create(req.body);
    } else {
      await User.create(req.body);
    }
    res.location('/');
    res.status(201).end();
  } catch (err) {
      err.message = err.errors.map(val => val.message)   
      res.status(400)
      next(err)
  }
});

module.exports = router;