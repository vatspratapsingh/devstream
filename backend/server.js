const express = require('express');
const cors = require('cors');
const notesRouter = require('./routes/notes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRouter);

app.get('/health', (req, res) => {
  res.send('🟢 API is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});