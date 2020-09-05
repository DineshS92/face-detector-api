const handleRequest = (req, res, knex) => {
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
}

module.exports = {
  handleRequest: handleRequest
}