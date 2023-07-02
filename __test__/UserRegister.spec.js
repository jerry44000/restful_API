const request = require('supertest');
const app = require('../src/app.js');
const User = require('../src/user/User.js');
const sequelize = require('../src/config/database.js');

beforeAll(() => {
  sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

// User Registration & valid user creation
describe('User Registration', () => {
  // Valid user const reusable
  const postValidUser = () => {
    return request(app).post('/api/1.0/users').send({
      username: 'user1',
      email: 'user1@mail.com',
      password: 'P4ssword',
    });
  };

  // Test 200
  it('return 200 ok when signup request is valid', async () => {
    const response = await postValidUser();
    expect(response.status).toBe(200);
  });

  // Test for the valid user creation
  it('return success for a valid signup request', async () => {
    const response = await postValidUser();
    expect(response.body.message).toBe('User created with success');
  });

  // Test for saving user to the database
  it('saves user to database', async () => {
    await postValidUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  // Test for saving user & mail to db
  it('saves username & mail to database', async () => {
    await postValidUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe('user1');
    expect(savedUser.email).toBe('user1@mail.com');
  });

  // Hashes password
  it('hashes password in db', async () => {
    await postValidUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe('P4ssword');
  });
});
