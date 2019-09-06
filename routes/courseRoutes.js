/*******
 Project 9 - REST API 
*******/

const express = require('express');
const router = express.Router();
const User = require('../models').User;
const Course = require('../models').Course;

// //body parsing
// const bodyParser = require('body-parser');
// router.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: false }));

const asyncHandler = cb => {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(err) {
      console.log('There was an error with the application');
      next(err);
    }
  }
}

router.get('/courses', asyncHandler( async (req, res) => {
  const course = await Course.findAll({
    include:[
    {
      model: User,
      as: 'user',
    }
    ]
  })
  res.json(course);
}));

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

router.post('/courses', async (req, res, next) => {
  try {
    const course = req.body;
    const newCourse = await Course.create(course)
    res.location(`/courses/${newCourse.userId}`)
    res.status(201).end();
  } catch (error) {
    // error.status = 400;
    return next(error)
  };
});

router.put('/courses/:id', async (req, res) => {
  try{
    const course = await Course.findByPk(req.params.id)
    if(course) {
      await course.update(req.body)
    } else {
      res.status(404).json({message: 'oh no'})
    }
    res.status(204).end()
  } catch (error) {
    if (error.name === 'SequelizeValiationError') {
      res.status(404).json({error: error.message})
    } else { 
      return next(error)
    }
  } 

})

// router.delete()

//if (course) {
    // res.json(course);
    // } else {
    //   res.json({ error: 'Course not found' })
    // }
    
module.exports = router;