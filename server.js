const express = require('express');
const path = require('path');
const fs = require("fs");

const port = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route to retrieve notes from db
app.get('/api/notes', (req, res) => {
  let data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  console.log(`${req.method} request received to get notes`);
  res.json(data);
});

// POST Route to add notes to db
app.post('/api/notes', (req, res) =>{
  const newNote = req.body;
  let data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  data.push(newNote);
  let idCount = 1;
  data.forEach((note) => {
    note.id = idCount;
    idCount++;
    return data;
  });
  fs.writeFileSync('./db/db.json', JSON.stringify(data));
  console.log(`${req.method} request received to save a note`);
  res.json(data);
});

// DELETE Route to remove notes from the db
app.delete('/api/notes/:id', (req, res) => {
  const deleteId = req.params.id;
  let data = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(data);
  for (let i = 0; i < data.length; i++) {
    if (data[i].id === Number(deleteId)) {
      data.splice([i], 1);
    }
  }
  fs.writeFileSync('./db/db.json', JSON.stringify(data));
  console.log(`${req.method} request received to delete a note`);
});

app.listen(port, () =>
  console.log(`App listening at http://localhost:${port} 🚀`)
);
