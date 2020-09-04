const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
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

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  // res.send(datab.users);
});

app.post('/signin', (req, res) => {
  knex.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      if(bcrypt.compareSync(req.body.password, data[0].hash)){
        return knex.select('*').from('users').where('email', '=', req.body.email)
        .then(user => {
          res.json(user[0])
        })
        .catch(err => res.status(400).json('User not Found'));
      } else {
        res.status(400).json('Wrong Credentials');
      }
    })
    .catch(err => res.status(400).json('Wrong Credentials'));
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
    knex.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
          .then(user => {
            res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback);
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