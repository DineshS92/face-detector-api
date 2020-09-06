const Clarifai = require('clarifai');

const app = new Clarifai.App({
  apiKey: process.env.API_CLAR;
});

const handleAPICall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleEntries = (req, res, knex) => {
  const { id } = req.body;
  knex('users')
  .where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(Number(entries[0]));
  })
  .catch(err => res.status(400).json('Bad Request'));
};

module.exports = {
  handleEntries: handleEntries,
  handleAPICall: handleAPICall
}