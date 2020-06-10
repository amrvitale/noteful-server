const express = require('express');

const noteRouter = express.Router();
const bodyParser = express.json();
const logger = require('../logger');
const notesService = require('./note-service');
const xss = require('xss');

const serializeNote = note => ({
  ...note,
  name: xss(note.name),
  content: xss(note.content)
});

noteRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    notesService 
      .getAllNotes(knexInstance)
      .then((notes) => {
        res.json(notes.map((note) => serializeNote(note)));
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  })
  .post(bodyParser, (req, res, next) => {
    const { name, content, folder_id } = req.body;
    const newNote = { name, content, folder_id};
    notesService
      .insertNote(req.app.get("db"), newNote)
      .then((note) => {
        res
          .status(201)
          .location(req.originalUrl + `/${note.id}`)
          .json(serializeNote(note));
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });
noteRouter  
  .route('/:id')
  .all((req,res,next)=>{
    notesService.getById(
      req.app.get('db'),
      req.params.id
    )
      .then(note =>{
        if (!note) {
          return res.status(404).json({
            error: { message: 'Note doesn\'t exist' }
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req,res,next) => {
    return res.json(serializeNote(res.note));
  })
  .delete((req,res,next)=>{
    const { id } = req.params;
    const knexInstance = req.app.get('db');
    notesService.deleteNote(knexInstance,id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    const { name, content, folder_id } = req.body;
    const noteToUpdate = { name, content,folder_id };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'request body must contain either \'name\', \'content\', or \'folder_id\''
        }
      });
    }

    notesService.updateNote(
      req.app.get('db'),
      req.params.id,
      noteToUpdate
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

  module.exports = noteRouter;