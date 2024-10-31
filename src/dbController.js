'use strict';

const options = require('./credentials.js');
const mariadb = require('mariadb');

// query either all (no argument) or an specific post
async function getPost(search) {
  const conn = await mariadb.createConnection(options);
  try {
    let query = `SELECT * FROM posts`;

    if ((typeof search) === 'number') query += ` WHERE id = ${search}`;
    if ((typeof search) === 'string') {
      query += ` WHERE content LIKE '%${search}%' OR \
          category LIKE '%${search}%' OR \
          tags     LIKE '%${search}%'`;
    }

    const results = await conn.query(query);

    for (const result of results) {
      result.tags = result.tags.split(',');
      result.createdAt = result.createdAt.toJSON();
      result.updatedAt = result.updatedAt.toJSON();
    }
    return {code: 200, body: JSON.stringify(results)};
  } catch(err) {
    console.error(err);
  } finally {
    conn.end();
  }
}
async function insertPost(postToInsert) {
  const conn = await mariadb.createConnection(options);
  postToInsert.tags = postToInsert.tags.join(',');

  try {
    const query = `INSERT INTO posts (title, content, category, tags) \
        VALUES ( \
          "${postToInsert.title}    ", \
          "${postToInsert.content}  ", \
          "${postToInsert.category} ", \
          "${postToInsert.tags}     "  \
        );`;
    const results = await conn.query(query);

    const queryNewlyPost = 'SELECT * FROM posts WHERE ID = ?';
    const newlyInsertedPost =
        await conn.query(queryNewlyPost, [results.insertId] );

    return {code: 201, body: JSON.stringify(newlyInsertedPost)};
  } catch(err) {
    console.error(err);
  } finally {
    conn.end();
  }
}
//TODO:
//async function deletePost(id) { }
//async function updatePost(updatedPost, id) { }

//helper functions and constants
const formatTemplate = `Incorrect post format, example:
{
"title": <string>,
"content": <string>,
"category": <string>,
"tags": <array of strings>
}
`;
function isValidPost(post) {
  if ((typeof post.title)    !== 'string') return false;
  if ((typeof post.content)  !== 'string') return false;
  if ((typeof post.category) !== 'string') return false;
  if ((typeof post.tags)     !== 'object') return false;

  return true;
}

module.exports = { getPost, insertPost/*, deletePost, updatePost */};
