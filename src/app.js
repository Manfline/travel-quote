const express = require('express');
const quote = require('./api/quote/route');

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/quote', quote);

app.use('*', (req, res) =>
  res.status(404).json({ message: 'Rota não encontrada' })
);
module.exports = app;
