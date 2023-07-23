const request = require('supertest');
const app = require('../src/app.js');
const User = require('../src/user/User.js');
const sequelize = require('../src/config/database.js');

beforeAll(() => {
  // sequelize.options.storage = './database.sqlite';
  return sequelize.sync();
});

beforeEach(() => {
  return User.destroy({ truncate: true });
});

// Valid User model
const validUser = {
  username: 'user1',
  email: 'user1@mail.com',
  password: 'P4ssword',
};

// Function for a valid user
const postUser = (user = validUser) => {
  return request(app).post('/api/1.0/users').send(user);
};

// User Registration & valid user creation
describe('User Registration', () => {
  // Test 200
  it('return 200 ok when signup request is valid', async () => {
    const response = await postUser();
    expect(response.status).toBe(200);
  });

  // Test for the valid user creation
  it('return success for a valid signup request', async () => {
    const response = await postUser();
    expect(response.body.message).toBe('User created with success');
  });

  // Test for saving user to the database
  it('saves user to database', async () => {
    await postUser();
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  // Test for saving user & mail to db
  it('saves username & mail to database', async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe('user1');
    expect(savedUser.email).toBe('user1@mail.com');
  });

  // Hashes password
  it('hashes password in db', async () => {
    await postUser();
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.password).not.toBe('P4ssword');
  });

  // Check for invalid username
  it('return 400 when username is null', async () => {
    const response = await postUser({
      username: null,
      email: 'user1@mail.com',
      password: 'P4ssword',
    });
    expect(response.status).toBe(400);
  });

  // Validation error
  it('returns validation error field in response body when error occurs', async () => {
    const response = await postUser({
      username: null,
      email: 'user1@mail.com',
      password: 'P4ssword',
    });
    const body = response.body;
    expect(body.validationErrors).not.toBeUndefined();
  });

  // Email & Username can't be null
  it('error is username & email are null', async () => {
    const response = await postUser({
      username: null,
      email: null,
      password: 'P4ssword',
    });
    const body = response.body;
    expect(Object.keys(body.validationErrors)).toEqual(['username', 'email']);
  });

  // Dynamic Tests with single repeating test
  it.each`
    field         | expectedMessage
    ${'username'} | ${'Username can not be null'}
    ${'email'}    | ${'Email can not be null'}
    ${'password'} | ${'Password can not be null'}
  `('return $expectedMessage when $field is null', async ({ field, expectedMessage }) => {
    const user = {
      username: 'user1',
      email: 'user1@mail.com',
      password: 'P4ssword',
    };
    user[field] = null;
    const response = await postUser(user);
    const body = response.body;
    expect(body.validationErrors[field]).toBe(expectedMessage);
  });
});
