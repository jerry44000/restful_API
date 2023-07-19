const express = require('express');
const router = express.Router();
const UserService = require('./UserService.js');
const { check, validationResult } = require('express-validator');

// After Validation
router.post(
  '/api/1.0/users',
  check('username').notEmpty().withMessage('Username can not be null'),
  check('email').notEmpty().withMessage('Email can not be null'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors = {};
      errors.array().forEach((error) => (validationErrors[error.path] = error.msg));
      return res.status(400).send({ validationErrors: validationErrors });
    }
    await UserService.save(req.body);
    return res.send({ message: 'User created with success' });
  }
);

module.exports = router;
