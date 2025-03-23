const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Serve frontend statically
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ MongoDB Atlas Connection
mongoose.connect('mongodb+srv://lokeshyechina:<o7JxjuWP0ArbTRWK>@cluster0.3kt1v.mongodb.net/todo?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('🔥 MongoDB Atlas Connected!'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// Schema
const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

const Task = mongoose.model('Task', taskSchema);

// Routes
app.post('/add', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.send(task);
});

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.delete('/delete/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send({ message: 'Task deleted' });
});

// Serve index.html for frontend navigation
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start Server
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
