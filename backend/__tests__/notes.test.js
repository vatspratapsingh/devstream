// backend/__tests__/notes.test.js
const request = require('supertest');
const app = require('../app');

describe('POST /api/notes', () => {
  it('should create a new note and return it with status 201', async () => {
    const newNote = {
      title: 'Test Note',
      content: 'This is a test note'
    };

    const res = await request(app)
      .post('/api/notes')
      .send(newNote)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(newNote.title);
    expect(res.body.content).toBe(newNote.content);
  });
});
describe('GET /api/notes/:id', () => {
  it('should return the note with the given id', async () => {
    // First create a new note
    const createRes = await request(app)
      .post('/api/notes')
      .send({ title: 'Test Note', content: 'Testing GET by ID' });

    const newNote = createRes.body;

    // Now fetch the note by ID
    const getRes = await request(app).get(`/api/notes/${newNote.id}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toEqual(expect.objectContaining({
      id: newNote.id,
      title: 'Test Note',
      content: 'Testing GET by ID'
    }));
  });
});
describe('DELETE /api/notes/:id', () => {
  it('should delete the note with the given id', async () => {
    // First create a note
    const createRes = await request(app)
      .post('/api/notes')
      .send({ title: 'Note to Delete', content: 'This will be deleted' });

    const noteId = createRes.body.id;

    // Delete the note
    const deleteRes = await request(app).delete(`/api/notes/${noteId}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty('message', 'Note deleted');

    // Confirm it's deleted
    const getRes = await request(app).get(`/api/notes/${noteId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
it('should return 404 for non-existent note id', async () => {
  const res = await request(app).get('/api/notes/invalid-id');
  expect(res.statusCode).toBe(404);
  expect(res.body).toEqual({ error: 'Note not found' });
});
it('should return 404 when deleting a non-existent note', async () => {
  const res = await request(app).delete('/api/notes/nonexistent-id');
  expect(res.statusCode).toBe(404);
  expect(res.body).toEqual({ error: 'Note not found' });
});
it('should update an existing note and return the updated note', async () => {
  // Create a note first
  const createRes = await request(app).post('/api/notes').send({
    title: 'Update Note',
    content: 'Before update'
  });

  const noteId = createRes.body.id;

  // Update it
  const updateRes = await request(app).put(`/api/notes/${noteId}`).send({
    title: 'Updated Title',
    content: 'Updated content'
  });

  expect(updateRes.statusCode).toBe(200);
  expect(updateRes.body).toMatchObject({
    id: noteId,
    title: 'Updated Title',
    content: 'Updated content'
  });
});
it('should return 404 when updating a non-existent note', async () => {
  const res = await request(app).put('/api/notes/invalid-id').send({
    title: 'Does not exist'
  });

  expect(res.statusCode).toBe(404);
  expect(res.body).toEqual({ error: 'Note not found' });
});