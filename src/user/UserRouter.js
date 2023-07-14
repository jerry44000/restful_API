const express = require('express');
const router = express.Router();
const UserService = require('./UserService.js');

// Function (middleware) to check username. It return an error otherwise it goes next.
const validateUserName = (req, res, next) => {
  const user = req.body;
  if (user.username === null) {
    req.validationErrors = {
      username: 'Usename can not be null',
    };
  }
  next();
};

// Function to check email
const validateEmail = (req, res, next) => {
  const user = req.body;
  if (user.email === null) {
    req.validationErrors = {
      ...req.validationErrors,
      email: 'Email can not be null',
    };
  }
  next();
};

// After Validation
router.post('/api/1.0/users', validateUserName, validateEmail, async (req, res) => {
  if (req.validationErrors) {
    const response = { validationErrors: { ...req.validationErrors } };
    return res.status(400).send(response);
  }
  await UserService.save(req.body);
  return res.send({ message: 'User created with success' });
});

module.exports = router;
