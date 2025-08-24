const { body, param, query, validationResult } = require('express-validator');

// Validation rules for creating a note
const validateCreateNote = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .escape(),
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters')
    .escape(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 5) {
        throw new Error('Maximum 5 tags allowed');
      }
      return true;
    }),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high')
];

// Validation rules for updating a note
const validateUpdateNote = [
  param('id')
    .notEmpty()
    .withMessage('Note ID is required')
    .custom((value) => {
      // Allow both UUID format and custom IDs like "demo-1"
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const customIdRegex = /^[a-zA-Z0-9-_]+$/;
      
      if (!uuidRegex.test(value) && !customIdRegex.test(value)) {
        throw new Error('Invalid note ID format');
      }
      return true;
    }),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters')
    .escape(),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content must be between 1 and 1000 characters')
    .escape(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags && tags.length > 5) {
        throw new Error('Maximum 5 tags allowed');
      }
      return true;
    }),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high')
];

// Validation rules for getting a note by ID
const validateNoteId = [
  param('id')
    .notEmpty()
    .withMessage('Note ID is required')
    .custom((value) => {
      // Allow both UUID format and custom IDs like "demo-1"
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const customIdRegex = /^[a-zA-Z0-9-_]+$/;
      
      if (!uuidRegex.test(value) && !customIdRegex.test(value)) {
        throw new Error('Invalid note ID format');
      }
      return true;
    })
];

// Validation rules for query parameters
const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Search term must be between 1 and 50 characters'),
  query('sortBy')
    .optional()
    .isIn(['title', 'createdAt', 'updatedAt', 'priority'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

module.exports = {
  validateCreateNote,
  validateUpdateNote,
  validateNoteId,
  validateQueryParams,
  handleValidationErrors
};
