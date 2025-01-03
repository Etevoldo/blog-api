'use strict';

const db = require('./dbController.js');
const http = require('node:http');
const concat = require('concat-stream');

const server = http.createServer();
const port = 3030;

server.on('request', (req, res) => {
  const { method, url } = req;
  const headers = { 'Content-Type': 'application/json' };
  const uriPaths = url.split('/');

  // requests handling
  if (method === 'GET' && uriPaths[1].split('?')[0] === 'posts') {
    // get either all or an specific post
    const params = new URLSearchParams(url.split('?')[1]);
    let query;
    if (params.has('term')) {
      query = params.get('term'); // posts?term=word
    }
    else if (uriPaths[2]) {
      query = parseInt(uriPaths[2]); // /posts/:id
    }

    db.getPost(query)
      .then(result => {
        if (result.code !== 200) headers['Content-Type'] = 'text/plain';
        res.writeHead(result.code, headers);
        res.end(result.body);
      })
      .catch(err => {
        res.writeHead(500, headers);
        console.error(err);
        res.end('Internal server error');
      });
  }
  else if (method === 'POST' && url === '/posts') {
    // insert a new post
    const concatStream = concat({encoding: 'string'}, body => {
      console.log(body); // debug

      db.insertPost(JSON.parse(body))
        .then(result => {
          if (result.code !== 201) headers['Content-Type'] = 'text/plain';
          res.writeHead(result.code, headers);
          res.end(result.body);
        })
        .catch(err => {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          console.error(err);
          res.end('Internal server error');
        });
    });
    req.pipe(concatStream);
  }
  else if (method === 'DELETE' && uriPaths[1] === 'posts') {
    // delete specific post
    headers['Content-Type'] = 'text/plain';
    const id = parseInt(uriPaths[2]); // /posts/:id
    db.deletePost(id)
      .then(result => {
        res.writeHead(result.code, headers);
        res.end(result.body);
      })
      .catch(err => {
        res.writeHead(500, headers);
        console.error(err);
        res.end('Internal server error');
      });
  }
  else if (method === 'PUT' && uriPaths[1] === 'posts') {
    // delete specific post
    headers['Content-Type'] = 'text/plain';
    const concatStream = concat({encoding: 'string'}, body => {
      console.log(body); // debug
      const id = parseInt(uriPaths[2]); // /posts/:id
      db.updatePost(JSON.parse(body), id)
        .then(result => {
          res.writeHead(result.code, headers);
          res.end(result.body);
        })
        .catch(err => {
          res.writeHead(500, headers);
          console.error(err);
          res.end('Internal server error');
        });
    });
    req.pipe(concatStream);
  }
  else {
    // pure base base
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('hi!');
  }
});
server.listen(port, () =>
    console.log(`Listening on http://localhost:${port}`)
);
