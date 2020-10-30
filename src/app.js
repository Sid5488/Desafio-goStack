const express = require("express");
const cors = require("cors");
const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();
  const repository = { 
    id, 
    title, 
    url, 
    techs, 
    likes: 0 
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryExist = repositories.findIndex(repository => repository.id == id);

  if(repositoryExist === -1) {
    return response.status(400).json({ error: 'Repository does not exist.' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryExist].likes
  };

  repositories[repositoryExist] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryExist = repositories.findIndex(repository => repository.id == id);

  if(repositoryExist === -1) 
    return response.status(400).json({ error: 'Repository not found!' });
  
  repositories.splice(repositoryExist, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
    
  const repositoryExist = repositories.findIndex(repository => repository.id == id);

  if(repositoryExist === -1) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  repositories[repositoryExist].likes += 1;

  return response.status(200).json(repositories[repositoryExist]);
});

module.exports = app;
