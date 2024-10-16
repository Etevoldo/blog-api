'use strict';

const db = require('./dbController.js');
const http = require('node:http');
const concat = require('concat-stream');

const server = http.createServer();
const port = 3030;

server.on('request', (req, res) => {
  const { method, url } = req;
  const headers = {
    'Content-Type': 'application/json'
  };
  const uriPaths = url.split('/');
  if (method === 'GET' && uriPaths[1] === 'posts') {
    // get either all or an specific post
    const id = parseInt(uriPaths[2]); // /posts/:id
    db.getPost(id)
      .then(data => {
        res.writeHead(200, headers);
        res.end(data);
      })
      .catch(err => {
        res.writeHead(500, headers);
        res.end(err);
      });
  }
  else if (method === 'GET' && url === '/') {
    // base base
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('hi!');
  }
  else if (method === 'POST' && url === '/') {
    // insert a new post
    const concatStream = concat({encoding: 'string'}, body => {
      console.log(body); // debug
      db.insertPost(JSON.parse(body))
        .then(result => {
          res.writeHead(201, headers);
          res.end(result);
        })
        .catch(err => {
          res.writeHead(500, headers);
          res.end(err);
        });
    });
    req.pipe(concatStream);
  }
});
server.listen(port, () =>
    console.log(`Listening on http://localhost:${port}`)
);
