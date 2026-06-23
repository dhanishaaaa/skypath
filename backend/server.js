const express = require('express');
const cors = require('cors');
require('dotenv').config();
const profileRoutes = require('./routes/profile');
const roadmapRoutes = require('./routes/roadmap');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/profile', profileRoutes);
app.use('/api/roadmap', roadmapRoutes);

const authRoutes = require('./routes/auth');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SkyPath backend is running' });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));