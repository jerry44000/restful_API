
const express = require('express');
const router = express.Router();
const UserService = require('./UserService.js');

router.post('/api/1.0/users', async (req, res) => {
  const user = req.body;
  if (user.username === null) {
    return res.status(400).send({ validationErrors: {
      username: 'Usename can not be null'
    }});
  }
  await UserService.save(req.body);
  return res.send({ message: 'User created with success' });
});

module.exports = router;
