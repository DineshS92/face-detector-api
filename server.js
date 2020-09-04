const express = require('express');
const cors = require('cors');
const { response } = require('express');
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test@1234',
    database: 'smartbrain'
  } 
});

// knex.select('*').from('users').then(data => {
//   console.log(data);
// });

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
  // datab.users.push({
  //   id: '11',
  //   name: name,
  //   email: email,
  //   entries: 0,
  //   joined: new Date()
  // });
  knex('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
      .then(user => {
        res.json(user[0]);
    })
      .catch(err => res.status(400).json('Your Request Could not be Fulfilled'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  knex('users').where({
    id: id
  }).select('*')
  .then(user => {
    if(user.length) {
      res.json(user[0])
    } else {
      res.status(400).json('User Not Found');
    }
  });
});


app.put('/image', (req, res) => {
  const { id } = req.body;
  knex('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(Number(entries[0]));
  })
  .catch(err => res.status(400).json('Bad Request'));
});

app.listen(3000, () => {
  console.log('I\'m Alive!!!!');
});