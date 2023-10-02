# Broken App Issues

## Task:

Fix the following code:

```jsx
const express = require('express');
let axios = require('axios');
var app = express();

app.post('/', function (req, res, next) {
  try {
    let results = req.body.developers.map(async d => {
      return await axios.get(`https://api.github.com/users/${d}`);
    });
    let out = results.map(r => ({ name: r.data.name, bio: r.data.bio }));

    return res.send(JSON.stringify(out));
  } catch {
    next(err);
  }
});

app.listen(3000);
```

**Issues:**

1. The code does not include the middleware **`express.json()`** to parse the JSON request body.
2. The route handler is not **`async`**, but it uses asynchronous operations inside.
3. The error handling does not account for specific errors, such as GitHub API rate limits.
4. Does not have any request validations.
5. The error-handling functionality is incomplete.
6. The server starts without any confirmation message to indicate it's running.

## Solution:

```jsx
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
```

### **Revised Changes:**

1. **Module Imports**:
    - The revised solution also imports the **`express.json()`** middleware, which is used to parse incoming JSON request bodies.
2. **Middleware**:
    - The revised solution uses the **`app.use(express.json());`** middleware to parse incoming JSON request bodies. This is essential for reading the **`req.body`** object.
3. **Input Validation**:
    - The revised solution includes checks to ensure that the request body contains the "developers" key, that its value is an array, and that all elements of the array are strings. This provides better error handling and ensures that the server doesn't crash due to unexpected input.
4. **Asynchronous Handling**:
    - In the original code, the asynchronous calls are not handled correctly. The **`map`** function is used with **`async/await`**, but the results are not awaited, leading to potential issues.
    - The revised solution correctly uses the **`Promise.all()`** function to await all asynchronous calls, ensuring that all data is fetched before sending the response.
5. **Error Handling**:
    - The revised solution has improved error handling. It checks for specific errors, such as the GitHub API rate limit being exceeded, and sends a corresponding error message.
    - A general error-handling middleware is added at the end of the revised solution to catch any unhandled errors and send a response with the error message.
6. **Server Start Message**:
    - The revised solution includes a console log message indicating that the server is running and on which port, providing feedback when the server starts.

Overall, the revised solution is a more robust and improved version of the original code, with better error handling, input validation, and asynchronous handling.