const request = require('supertest');
const app = require('../app');

describe('Notes API', () => {
  let testNoteId;

  describe('GET /api/notes', () => {
    it('should return all notes with pagination', async () => {
      const res = await request(app)
        .get('/api/notes')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.pagination).toHaveProperty('page');
      expect(res.body.pagination).toHaveProperty('totalPages');
      expect(res.body.pagination).toHaveProperty('total');
    });

    it('should support pagination parameters', async () => {
      const res = await request(app)
        .get('/api/notes?page=1&limit=5')
        .expect(200);

      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.totalPages).toBeGreaterThan(0);
    });

    it('should support search functionality', async () => {
      const res = await request(app)
        .get('/api/notes?search=DevStream')
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0].title).toContain('DevStream');
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return a specific note by ID', async () => {
      const res = await request(app)
        .get('/api/notes/demo-1')
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('id', 'demo-1');
      expect(res.body.data).toHaveProperty('title');
      expect(res.body.data).toHaveProperty('content');
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body.data).toHaveProperty('updatedAt');
    });

    it('should return 404 for non-existent note', async () => {
      const res = await request(app)
        .get('/api/notes/non-existent-id')
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
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

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Note created successfully');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(newNote.title);
      expect(res.body.data.content).toBe(newNote.content);
      expect(res.body.data).toHaveProperty('createdAt');
      expect(res.body.data).toHaveProperty('updatedAt');

      testNoteId = res.body.data.id;
    });

    it('should return 400 for missing title', async () => {
      const invalidNote = {
        content: 'This note has no title'
      };

      const res = await request(app)
        .post('/api/notes')
        .send(invalidNote)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Validation failed');
      expect(res.body).toHaveProperty('errors');
    });

    it('should return 400 for missing content', async () => {
      const invalidNote = {
        title: 'This note has no content'
      };

      const res = await request(app)
        .post('/api/notes')
        .send(invalidNote)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Validation failed');
      expect(res.body).toHaveProperty('errors');
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

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Validation failed');
      expect(res.body).toHaveProperty('errors');
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

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Note updated successfully');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.title).toBe(updateData.title);
      expect(res.body.data.content).toBe(updateData.content);
      expect(res.body.data.updatedAt).not.toBe(res.body.data.createdAt);
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

      expect(res.body).toHaveProperty('success', false);
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

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Validation failed');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete an existing note', async () => {
      const res = await request(app)
        .delete(`/api/notes/${testNoteId}`)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Note deleted successfully');
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.id).toBe(testNoteId);
    });

    it('should return 404 for non-existent note', async () => {
      const res = await request(app)
        .delete('/api/notes/non-existent-id')
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Note not found');
    });

    it('should confirm note is deleted', async () => {
      const res = await request(app)
        .get(`/api/notes/${testNoteId}`)
        .expect(404);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Note not found');
    });
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const res = await request(app)
      .get('/health')
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('status', 'OK');
    expect(res.body.data).toHaveProperty('timestamp');
    expect(res.body.data).toHaveProperty('uptime');
    expect(res.body.data).toHaveProperty('environment');
    expect(res.body.data).toHaveProperty('version');
  });
});

describe('Root Endpoint', () => {
  it('should return API information', async () => {
    const res = await request(app)
      .get('/')
      .expect(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('message', 'Welcome to DevStream API');
    expect(res.body.data).toHaveProperty('version', '1.0.0');
    expect(res.body.data).toHaveProperty('endpoints');
  });
});
