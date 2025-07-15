const express = require('express');
const router = express.Router();

let notes = [
  {
    id: "1752572230739",
    title: "Test Note",
    content: "This is a test note."
  }
];

// GET all notes
router.get('/', (req, res) => {
  res.json(notes);
});

// GET note by ID
router.get('/:id', (req, res) => {
  const noteId = req.params.id;
  const note = notes.find(n => n.id === noteId);
  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

// POST a new note
router.post('/', (req, res) => {
  const { title, content } = req.body;
  const newNote = {
    id: Date.now().toString(),
    title,
    content
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

// PUT (update) a note
router.put('/:id', (req, res) => {
  const noteId = req.params.id;
  const index = notes.findIndex(n => n.id === noteId);
  if (index !== -1) {
    notes[index] = { ...notes[index], ...req.body };
    res.json(notes[index]);
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

// DELETE a note
router.delete('/:id', (req, res) => {
  const noteId = req.params.id;
  const index = notes.findIndex(n => n.id === noteId);
  if (index !== -1) {
    const deleted = notes.splice(index, 1);
    res.json({ message: 'Note deleted', note: deleted[0] });
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
});

module.exports = router;