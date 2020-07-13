const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    db.select("*")
      .from("accounts")
      .then(accounts => res.status(200).json(accounts))
      .catch(error => res.status(500).json(error));
  });
  
  server.get("/:id", (req, res) => {
    const { id } = req.params;
  
    db("accounts")
      .where({ id })
      .first()
      .then(posts => res.status(200).json(posts))
      .catch(err => res.json(err));
  });
  
  server.post("/", ValidateResource, (req, res) => {
    const postData = req.body;
    console.log(postData);
    db("accounts")
      .insert(postData, "id")
      .then(([id]) => {
        db("accounts")
          .where({ id })
          .first()
          .then(res.status(201).json(id));
      })
      .catch(err => res.json(err));
  });
  
  server.put("/:id", (req, res) => {
    const changes = req.body;
  
    db("accounts")
      .where({ id: req.params.id })
      .update(changes)
      .then(count => {
        res.status(202).json({ RecordUpdated: count });
      })
      .catch(err => res.json(err));
  });
  
  server.delete("/:id", (req, res) => {
    db("accounts")
      .where({ id: req.params.id })
      .del()
      .then(count => {
        res.status(200).json({ RecordsDeleted: count });
      })
      .catch(err => res.json(err));
  });
  
  function ValidateResource(req, res, next) {
    if (req.body.name === undefined) {
      res.status(400).json({
        errorMessage: "Make sure your project has name field"
      });
    } else if (req.body.budget === undefined) {
      res.status(400).json({
        errorMessage: "Make sure your project has budget field"
      });
    } else {
      next();
    }
  }

module.exports = server;
