const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Import middleware and utilities
const { 
  validateCreateNote, 
  validateUpdateNote, 
  validateNoteId, 
  validateQueryParams,
  handleValidationErrors 
} = require('../middleware/validation');

const { asyncHandler } = require('../middleware/errorHandler');
const { 
  successResponse, 
  createdResponse, 
  notFoundResponse, 
  paginatedResponse 
} = require('../utils/response');
const { paginate, search, sort } = require('../utils/helpers');
const logger = require('../utils/logger');

// In-memory storage (in production, use a database)
let notes = [
  {
    id: "demo-1",
    title: "Welcome to DevStream",
    content: "This is your first note. Create, read, update, and delete notes using this API.",
    tags: ["welcome", "getting-started"],
    priority: "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// GET all notes with pagination, search, and sorting
router.get('/', 
  validateQueryParams,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search: searchTerm, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let filteredNotes = [...notes];
    
    // Apply search if provided
    if (searchTerm) {
      filteredNotes = search(filteredNotes, searchTerm, ['title', 'content', 'tags']);
    }
    
    // Apply sorting
    filteredNotes = sort(filteredNotes, sortBy, sortOrder);
    
    // Apply pagination
    const result = paginate(filteredNotes, page, limit);
    
    logger.info(`Retrieved ${result.data.length} notes from ${filteredNotes.length} total`);
    
    return paginatedResponse(res, result.data, page, limit, filteredNotes.length, 'Notes retrieved successfully');
  })
);

// GET note by ID
router.get('/:id', 
  validateNoteId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const noteId = req.params.id;
    const note = notes.find(n => n.id === noteId);
    
    if (!note) {
      logger.warn(`Note with ID ${noteId} not found`);
      return notFoundResponse(res, 'Note not found');
    }
    
    logger.info(`Retrieved note with ID: ${noteId}`);
    return successResponse(res, note, 'Note retrieved successfully');
  })
);

// POST create new note
router.post('/', 
  validateCreateNote,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { title, content, tags = [], priority = 'medium' } = req.body;
    const now = new Date().toISOString();
    
    const newNote = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      tags: Array.isArray(tags) ? tags : [],
      priority,
      createdAt: now,
      updatedAt: now
    };
    
    notes.push(newNote);
    
    logger.info(`Created new note with ID: ${newNote.id}`);
    return createdResponse(res, newNote, 'Note created successfully');
  })
);

// PUT update note
router.put('/:id', 
  validateUpdateNote,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const noteId = req.params.id;
    const { title, content, tags, priority } = req.body;
    const noteIndex = notes.findIndex(n => n.id === noteId);
    
    if (noteIndex === -1) {
      logger.warn(`Note with ID ${noteId} not found for update`);
      return notFoundResponse(res, 'Note not found');
    }
    
    const updatedNote = {
      ...notes[noteIndex],
      ...(title && { title: title.trim() }),
      ...(content && { content: content.trim() }),
      ...(tags && { tags: Array.isArray(tags) ? tags : notes[noteIndex].tags }),
      ...(priority && { priority }),
      updatedAt: new Date().toISOString()
    };
    
    notes[noteIndex] = updatedNote;
    
    logger.info(`Updated note with ID: ${noteId}`);
    return successResponse(res, updatedNote, 'Note updated successfully');
  })
);

// DELETE note
router.delete('/:id', 
  validateNoteId,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const noteId = req.params.id;
    const noteIndex = notes.findIndex(n => n.id === noteId);
    
    if (noteIndex === -1) {
      logger.warn(`Note with ID ${noteId} not found for deletion`);
      return notFoundResponse(res, 'Note not found');
    }
    
    const deletedNote = notes.splice(noteIndex, 1)[0];
    
    logger.info(`Deleted note with ID: ${noteId}`);
    return successResponse(res, deletedNote, 'Note deleted successfully');
  })
);

module.exports = router;
