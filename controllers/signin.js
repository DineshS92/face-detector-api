const handleLogin = (req, res, knex, bcrypt) => {
  if(!req.body.email || !req.body.password) {
    return res.status(400).json('Please Fill EVERY field');
  }
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
}

module.exports = {
  handleLogin: handleLogin
};