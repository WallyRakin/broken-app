### Conceptual Exercise

Answer the following questions below:



- What are some ways of managing asynchronous code in JavaScript?
  
  The two ways of managing asynchronous code in JavaScript are by using callbacks or promises.



- What is a Promise?
  
  A Promise is an object in JavaScript that represents the eventual completion (or failure) of an asynchronous operation and its resulting value.



- What are the differences between an async function and a regular function?
  
  An async function as opposed to regular function is one that returns a promise and gets resolved asynchronously, and allowsthe use of the await opperator to pause within the function.



- What is the difference between Node.js and Express.js?
  
  Node.js is a runtime that allows JavaScript to be executed server-side, while Express.js is a web framework built on top of Node.js.



- What is the error-first callback pattern?
  
  The error-first callback pattern is a convention in Node.js where the first argument of a callback function is reserved for an error object, and the subsequent arguments are for the data parameters.



- What is middleware?
  
  Middleware functions are functions that handle the request before the final intended route.



- What does the `next` function do?
  
  The next function is used in middleware functions to pass control to the next middleware function in the stack.



- What are some issues with the following code? (consider all aspects: performance, structure, naming, etc).
  
  The code fetches user data sequentially, awaiting for a response before continuing with the script. It would be more efficient to make all the requests concurrently instead. There's no error handling, so any failed requests will cause the entire function to fail. The variable names are arbitrary and should be more closely tried with the user's username. The return value fails to preserve a key/value pair association between variable names and their corresponding value.    

```js
async function getUsers() {
  const elie = await $.getJSON('https://api.github.com/users/elie');
  const joel = await $.getJSON('https://api.github.com/users/joelburton');
  const matt = await $.getJSON('https://api.github.com/users/mmmaaatttttt');

  return [elie, matt, joel];
}
```