require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const logger = require('./logger');
const folderRouter = require('./folders/folder-router');
const noteRouter = require('./notes/note-router');

const foldersService = require('./folders/folder-service');
const notesService = require('./notes/note-service');
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))

app.use(helmet())
app.use(cors())

app.options('*', cors());  // enable pre-flight

app.use('api/folders', folderRouter);
app.use('api/notes', noteRouter);

app.get('/', (req, res,next) => {
  const knexInstance = req.app.get('db');
  notesService.getAllNotes(knexInstance)
    .then(notes => {
      res.json(notes);
    })
    .catch(next);
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});


module.exports = app;