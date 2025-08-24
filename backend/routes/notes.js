const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage (in production, use a database)
let notes = [
  {
    id: "demo-1",
    title: "Welcome to DevStream",
    content: "This is your first note. Create, read, update, and delete notes using this API.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Validation middleware
const validateNote = (req, res, next) => {
  const { title, content } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Title is required and cannot be empty'
    });
  }
  
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Content is required and cannot be empty'
    });
  }
  
  next();
};

// GET all notes
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let filteredNotes = [...notes];
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower)
      );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedNotes = filteredNotes.slice(startIndex, endIndex);
    
    res.json({
      notes: paginatedNotes,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredNotes.length / limit),
        totalNotes: filteredNotes.length,
        hasNext: endIndex < filteredNotes.length,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve notes'
    });
  }
});

// GET note by ID
router.get('/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    const note = notes.find(n => n.id === noteId);
    
    if (!note) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Note not found'
      });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve note'
    });
  }
});

// POST create new note
router.post('/', validateNote, (req, res) => {
  try {
    const { title, content } = req.body;
    const now = new Date().toISOString();
    
    const newNote = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now
    };
    
    notes.push(newNote);
    
    res.status(201).json({
      message: 'Note created successfully',
      note: newNote
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create note'
    });
  }
});

// PUT update note
router.put('/:id', validateNote, (req, res) => {
  try {
    const noteId = req.params.id;
    const { title, content } = req.body;
    const noteIndex = notes.findIndex(n => n.id === noteId);
    
    if (noteIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Note not found'
      });
    }
    
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title.trim(),
      content: content.trim(),
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      message: 'Note updated successfully',
      note: notes[noteIndex]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update note'
    });
  }
});

// DELETE note
router.delete('/:id', (req, res) => {
  try {
    const noteId = req.params.id;
    const noteIndex = notes.findIndex(n => n.id === noteId);
    
    if (noteIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Note not found'
      });
    }
    
    const deletedNote = notes.splice(noteIndex, 1)[0];
    
    res.json({
      message: 'Note deleted successfully',
      note: deletedNote
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete note'
    });
  }
});

module.exports = router;
