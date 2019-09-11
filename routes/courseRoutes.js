/*******
 Project 9 - REST API 
*******/

const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Course = require('../models').Course;
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');

/**
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
        console.log('Login successful');
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

//returns a list of courses (including the user that owns each course)
router.get('/courses', async (req, res) => {
  const course = await Course.findAll({
    include:[
    {
      model: User,
      as: 'user',
    }
    ]
  })
  res.json(course);
});

//returns a course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', async (req, res) => {
  const course = await Course.findAll({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: User,
        as: 'user',
      }
    ]
  })
  res.json(course);
});

//creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', authenticatedUser, async (req, res, next) => {
  try {
    const course = req.body;
    const newCourse = await Course.create(course)
    res.location(`/courses/${newCourse.id}`)
    res.status(201).end();
  } catch (error) {
    error.status = 400;
    return next(error)
  };
});

//updates a course and returns no content
router.put('/courses/:id', async (req, res) => {
    const course = await Course.findByPk(req.params.id)
    if(course.id === req.body.id) {
      await course.update(req.body);
      res.status(204).end();
    } else {
     res.status(401).json({message: "You're not authorized to modify this course."});
    }
})

//deletes a course and returns no content
router.delete('/courses/:id', authenticatedUser, async (req, res, next) => { 
    const course = await Course.findByPk(req.params.id)
    if(course) {
     await course.destroy();
     res.status(204).end();
    }
    else {
      res.status(401).json({message: "You're not authorized to delete this course."});
    }
})

module.exports = router;