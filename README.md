# What is this

Another [roadmap.sh](https://roadmap.sh/projects/blogging-platform-api) project, this one is a RESTful API, made with vanilla node HTTP functions, using mariaDB/mySQL.
The instructions on how to use it are pretty much explained there

# How to run

1. clone the repo

2. install dependencies

```console
npm i
```
3. [install XAMPP](https://www.apachefriends.org/download.html)

4. import the table from the `dbExport.sql` file

5. and create a `credentials.js` file inside src directory with the following template:
```js
const options = {
  /*connection credentials*/
  database: blog
};
module.exports = options;
```

6. start the application
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
