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

//returns the currently authenticated user
router.get('/users', async (req, res) => {
  const userData = await User.findAll()
  res.json(userData);
});

//creates a user, sets the location header to '/', & returns no content
router.post('/users', async (req, res, next) => {
 try {
    const { firstName, lastName, emailAddress, password} = req.body;

    const result = await User.create({
      firstName,
      lastName,
      emailAddress,
      password
    })
    res.location('/').status(201);
    res.json({id: result.id})

  } catch (err) {
      err.message = err.errors.map(val => val.message)   
      res.status(400)
      next(err)
  }
});

module.exports = router;

/** */