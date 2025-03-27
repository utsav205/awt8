// server/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Read tasks from JSON file
const readTasks = () => {
    try {
      const data = fs.readFileSync('tasks.json', 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading tasks file:', error);
      return [];  // Return an empty array if the file is missing or corrupt
    }
  };
  
// Write tasks to JSON file
const writeTasks = (tasks) => {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get("/tasks", (req, res) => {
    try {
      console.log('Fetching tasks');
      const tasks = readTasks();  // Use readTasks here
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).send("Internal Server Error");
    }
});


app.post("/tasks", (req, res) => {
    try {
      const tasks = readTasks();  // Use readTasks here
      const newTask = { id: Date.now(), ...req.body };
      tasks.push(newTask);
      writeTasks(tasks);  // Use writeTasks here
      res.json(newTask);
    } catch (error) {
      res.status(500).send("Internal Server Error");
    }
});

// Update a task
app.put('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(req.params.id));
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send('Task not found');
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  const tasks = readTasks();
  const updatedTasks = tasks.filter((task) => task.id !== parseInt(req.params.id));
  writeTasks(updatedTasks);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
