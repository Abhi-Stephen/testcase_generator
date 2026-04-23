require('dotenv').config();

const express = require('express');
const cors = require('cors');
const testcaseRoutes = require('./routes/testcaseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const storageMode = process.env.STORAGE_MODE || 'json';

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', storageMode });
});

app.use('/api', testcaseRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});