const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const { response } = require('express');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const images = require('./controllers/image');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test@1234',
    database: 'smartbrain'
  } 
});

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  // res.send(datab.users);
});

app.post('/signin', (req, res) => { signin.handleLogin(req, res, knex, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, knex, bcrypt) });

app.get('/profile/:id', (req, res) => { profile.handleRequest(req, res, knex) });

app.put('/image', (req, res) => { images.handleEntries(req, res, knex) });

app.post('/imageurl', (req, res) => { images.handleAPICall(req, res) });

app.listen(3000, () => {
  console.log(`I'm Alive!!!!`);
});