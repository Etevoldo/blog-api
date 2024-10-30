# What is this

Another [roadmap.sh](https://roadmap.sh/projects/blogging-platform-api) project, this one is a RESTful API, made with vanilla node HTTP functions, using mariaDB/mySQL.
The instructions on how to use it are pretty much explained there

# How to run

1. clone the repo
2. install dependencies
```console
npm i
```
3. assuming you already have a mongodb account, create a cluster and create a `credentials.js` file inside src directory with the following template:
```js
const options = {
  /*connection credentials*/
  database: blog
};

module.exports = options;
```
4. start the application
```console
npm start
```

---

Progress:


- [x] Create a new blog post
- [x] Update an existing blog post
- [x] Delete an existing blog post
- [x] Get a single blog post
- [x] Get all blog posts
- [x] Filter blog posts by a search term


Complete!
