const express = require('express');
const cors = require('cors');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '',
    database: 'smartbrain'
  } 
});

// console.log(knex.select('*').from('users'));

const app = express();

const datab = {
  users: [
    {
      id: '1',
      name: 'Jim',
      email: 'Jim@jimworld.com',
      password: 'admin',
      entries: 0,
      joined: new Date()
    },
    {
      id: '2',
      name: 'Tim',
      email: 'Tim@timworld.com',
      password: 'admin',
      entries: 0,
      joined: new Date()
    }
  ]
};

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(datab.users);
});

app.post('/signin', (req, res) => {
  if(req.body.email === datab.users[0].email && 
    req.body.password === datab.users[0].password) {
      res.json(datab.users[0]);
    } else {
      res.status(400).json('Incorrect Email or Password');
    }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  datab.users.push({
    id: '11',
    name: name,
    email: email,
    entries: 0,
    joined: new Date()
  });
  res.json(datab.users[datab.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  datab.users.forEach(user => {
    if(user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if(!found) {
    res.status(404).json('User Does not Exist');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  datab.users.forEach(user => {
    if(user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if(!found) {
    res.status(404).json('User Does not Exist');
  }
});

app.listen(3000, () => {
  console.log('I\'m Alive!!!!');
});