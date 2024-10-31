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

    if (results.length) { // found >0 results
      return {code: 200, body: JSON.stringify(results)};
    } else {
      return {code: 404, body: ''};
    }

  } catch(err) {
    console.error(err);
  } finally {
    conn.end();
  }
}
async function insertPost(postToInsert) {
  if (!isValidPost(postToInsert)) return {code: 400, body: formatTemplate};
  const conn = await mariadb.createConnection(options);
  postToInsert.tags = postToInsert.tags.join(', ');

  try {
    const query = `INSERT INTO posts \
        (title, content, category, tags) \
        VALUES ( ?, ?, ?, ? );`;
    const values = [
      postToInsert.title,
      postToInsert.content,
      postToInsert.category,
      postToInsert.tags
    ];

    const results = await conn.query(query, values);

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
async function deletePost(id) {
  const conn = await mariadb.createConnection(options);

  try {
    const query = "DELETE FROM posts WHERE id = ?";

    const results = await conn.query(query, [id]);

    if (results.affectedRows === 1) {
      return {code: 204, body: ''};
    } else {
      return {code: 404, body: ''};
    }
  } catch(err) {
    console.error(err);
  } finally {
    conn.end();
  }
}
async function updatePost(updatedPost, id) {
  if (!isValidPost(updatedPost)) return {code: 400, body: formatTemplate};
  if (!id) return {code: 400, body: 'Specify an ID to delete!'};

  // join array into comma separated words (as in the db scheme)
  updatedPost.tags = updatedPost.tags.join(', ');
  const conn = await mariadb.createConnection(options);

  try {
    const query = `UPDATE posts SET \
        title=    ?, \
        content=  ?, \
        category= ?, \
        tags=     ?  \
        WHERE id = ?`;
    const values = [
      updatedPost.title,
      updatedPost.content,
      updatedPost.category,
      updatedPost.tags,
      id
    ];

    const results = await conn.query(query, values);

    if (results.affectedRows === 1) {
      const queryEditedPost = 'SELECT * FROM posts WHERE ID = ?';
      const editedPost =
          await conn.query(queryEditedPost, [id]);

      return {code: 200, body: JSON.stringify(editedPost)};
    } else {
      return {code: 404, body: ''};
    }
  } catch(err) {
    console.error(err);
  } finally {
    conn.end();
  }
}

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

module.exports = { getPost, insertPost, deletePost, updatePost };
