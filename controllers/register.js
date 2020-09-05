const handleRegister = (req, res, knex, bcrypt) => {
  if(!req.body.email || !req.body.name || !req.body.password) {
    return res.status(400).json('Please Fill EVERY field');
  }
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
};

module.exports = {
  handleRegister: handleRegister
};