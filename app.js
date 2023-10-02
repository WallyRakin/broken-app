// const express = require('express');
// let axios = require('axios');
// var app = express();

// app.post('/', function (req, res, next) {
//   try {
//     let results = req.body.developers.map(async d => {
//       return await axios.get(`https://api.github.com/users/${d}`);
//     });
//     let out = results.map(r => ({ name: r.data.name, bio: r.data.bio }));

//     return res.send(JSON.stringify(out));
//   } catch {
//     next(err);
//   }
// });

// app.listen(3000);

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json()); // To parse JSON request body

app.post('/', async function (req, res, next) {

  // Check if "developers" key exists in the request body
  if (!req.body.hasOwnProperty('developers')) {
    return res.status(400).send('Invalid input, Expecting a value ("developers" : Array) but ("developers" : Array) was not defined.');
  }

  // Check if "developers" is an array
  if (!Array.isArray(req.body.developers)) {
    return res.status(400).send('Invalid input, "developers" must be an Array.');
  }

  // Check if all values inside "developers" are strings
  for (let e of req.body.developers) {
    if (typeof e !== 'string') {
      return res.status(400).send('Invalid input, all values inside "developers" must be strings.');
    }
  }

  try {

    let promises = req.body.developers.map(d => {
      return axios.get(`https://api.github.com/users/${d}`);
    });

    let results = await Promise.all(promises);
    let out = results.map(r => ({ name: r.data.name, bio: r.data.bio }));

    return res.send(out);
  } catch (err) {
    // Handle specific errors, e.g., GitHub API rate limits
    if (err.response && err.response.status === 403) {
      return res.status(403).send('Too many requests, GitHub API rate limit exceeded.');
    }
    else {
      // Forward other errors to the next middleware
      next(err);
    };
  }
});


app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    message: err.message || "Server Error!",
    error: err
  })
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});