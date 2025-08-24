const request = require('supertest');
const app = require('../app');

describe('Notes API', () => {
  let testNoteId;

  describe('GET /api/notes', () => {
    it('should return all notes with pagination', async () => {
      const res = await request(app)
        .get('/api/notes')
        .expect(200);

      expect(res.body).toHaveProperty('notes');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.notes)).toBe(true);
      expect(res.body.pagination).toHaveProperty('currentPage');
      expect(res.body.pagination).toHaveProperty('totalPages');
      expect(res.body.pagination).toHaveProperty('totalNotes');
    });

    it('should support pagination parameters', async () => {
      const res = await request(app)
        .get('/api/notes?page=1&limit=5')
        .expect(200);

      expect(res.body.pagination.currentPage).toBe(1);
      expect(res.body.pagination.totalPages).toBeGreaterThan(0);
    });

    it('should support search functionality', async () => {
      const res = await request(app)
        .get('/api/notes?search=DevStream')
        .expect(200);

      expect(res.body.notes.length).toBeGreaterThan(0);
      expect(res.body.notes[0].title).toContain('DevStream');
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return a specific note by ID', async () => {
      const res = await request(app)
        .get('/api/notes/demo-1')
        .expect(200);

      expect(res.body).toHaveProperty('id', 'demo-1');
      expect(res.body).toHaveProperty('title');
      expect(res.body).toHaveProperty('content');
      expect(res.body).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('updatedAt');
    });

    it('should return 404 for non-existent note', async () => {
      const res = await request(app)
        .get('/api/notes/non-existent-id')
        .expect(404);

      expect(res.body).toHaveProperty('error', 'Not Found');
      expect(res.body).toHaveProperty('message', 'Note not found');
    });
  });

  describe('POST /api/notes', () => {
    it('should create a new note with valid data', async () => {
      const newNote = {
        title: 'Test Note',
        content: 'This is a test note content'
      };

      const res = await request(app)
        .post('/api/notes')
        .send(newNote)
        .expect(201);

      expect(res.body).toHaveProperty('message', 'Note created successfully');
      expect(res.body).toHaveProperty('note');
      expect(res.body.note).toHaveProperty('id');
      expect(res.body.note.title).toBe(newNote.title);
      expect(res.body.note.content).toBe(newNote.content);
      expect(res.body.note).toHaveProperty('createdAt');
      expect(res.body.note).toHaveProperty('updatedAt');

      testNoteId = res.body.note.id;
    });

    it('should return 400 for missing title', async () => {
      const invalidNote = {
        content: 'This note has no title'
      };

      const res = await request(app)
        .post('/api/notes')
        .send(invalidNote)
        .expect(400);

      expect(res.body).toHaveProperty('error', 'Validation Error');
      expect(res.body).toHaveProperty('message', 'Title is required and cannot be empty');
    });

    it('should return 400 for missing content', async () => {
      const invalidNote = {
        title: 'This note has no content'
      };

      const res = await request(app)
        .post('/api/notes')
        .send(invalidNote)
        .expect(400);

      expect(res.body).toHaveProperty('error', 'Validation Error');
      expect(res.body).toHaveProperty('message', 'Content is required and cannot be empty');
    });

    it('should return 400 for empty title', async () => {
      const invalidNote = {
        title: '   ',
        content: 'Valid content'
      };

      const res = await request(app)
        .post('/api/notes')
        .send(invalidNote)
        .expect(400);

      expect(res.body).toHaveProperty('error', 'Validation Error');
      expect(res.body).toHaveProperty('message', 'Title is required and cannot be empty');
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update an existing note', async () => {
      const updateData = {
        title: 'Updated Test Note',
        content: 'This is updated content'
      };

      const res = await request(app)
        .put(`/api/notes/${testNoteId}`)
        .send(updateData)
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Note updated successfully');
      expect(res.body).toHaveProperty('note');
      expect(res.body.note.title).toBe(updateData.title);
      expect(res.body.note.content).toBe(updateData.content);
      expect(res.body.note.updatedAt).not.toBe(res.body.note.createdAt);
    });

    it('should return 404 for non-existent note', async () => {
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      const res = await request(app)
        .put('/api/notes/non-existent-id')
        .send(updateData)
        .expect(404);

      expect(res.body).toHaveProperty('error', 'Not Found');
      expect(res.body).toHaveProperty('message', 'Note not found');
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        title: '',
        content: 'Valid content'
      };

      const res = await request(app)
        .put(`/api/notes/${testNoteId}`)
        .send(invalidData)
        .expect(400);

      expect(res.body).toHaveProperty('error', 'Validation Error');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete an existing note', async () => {
      const res = await request(app)
        .delete(`/api/notes/${testNoteId}`)
        .expect(200);

      expect(res.body).toHaveProperty('message', 'Note deleted successfully');
      expect(res.body).toHaveProperty('note');
      expect(res.body.note.id).toBe(testNoteId);
    });

    it('should return 404 for non-existent note', async () => {
      const res = await request(app)
        .delete('/api/notes/non-existent-id')
        .expect(404);

      expect(res.body).toHaveProperty('error', 'Not Found');
      expect(res.body).toHaveProperty('message', 'Note not found');
    });

    it('should confirm note is deleted', async () => {
      const res = await request(app)
        .get(`/api/notes/${testNoteId}`)
        .expect(404);

      expect(res.body).toHaveProperty('error', 'Not Found');
    });
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const res = await request(app)
      .get('/health')
      .expect(200);

    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('version');
  });
});

describe('Root Endpoint', () => {
  it('should return API information', async () => {
    const res = await request(app)
      .get('/')
      .expect(200);

    expect(res.body).toHaveProperty('message', 'Welcome to DevStream API');
    expect(res.body).toHaveProperty('version', '1.0.0');
    expect(res.body).toHaveProperty('endpoints');
  });
});
