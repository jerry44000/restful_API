const express = require('express');
const router = express.Router();
const UserService = require('./UserService.js');
const { check, validationResult } = require('express-validator');

// After Validation
router.post(
  '/api/1.0/users',
  check('username')
    .notEmpty()
    .withMessage('Username can not be null')
    .bail()
    .isLength({ min: 4, max: 32 })
    .withMessage('Must have min 4 and max 32 characters'),
  check('email').notEmpty().withMessage('Email can not be null').bail().isEmail().withMessage('Email is not valid'),
  check('password')
    .notEmpty()
    .withMessage('Password can not be null')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .bail()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .withMessage('Password must have at least one uppercase and one lowercase and one number')
    ,
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
