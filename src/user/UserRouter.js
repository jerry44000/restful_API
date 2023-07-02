const express = require('express');
const router = express.Router();
const UserService = require('./UserService.js');

router.post('/api/1.0/users', async (req, res) => {
  await UserService.save(req.body);

  return res.send({ message: 'User created with success' });
});

module.exports = router;
