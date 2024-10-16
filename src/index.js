'use strict';

const db = require('./dbController.js');
const http = require('node:http');
const process = require('node:process');

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
});
server.listen(port, () =>
    console.log(`Listening on http://localhost:${port}`)
);

function handle() {
  console.log(`a kill command happened!`);
}
