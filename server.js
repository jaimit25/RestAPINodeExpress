const Joi = require("joi"); //for input validation
var express = require("express");
var app = express(); //convert express to app
var fs = require("fs"); //file system module
const http = require("http");
app.use(express.json()); //for conversion
const mongoose = require("mongoose");
//USING NORMAL WAY
// const PORT = 3000
// const server = http.createServer( function (request, response) {
//    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//       console.log( data );
//       response.end( data );
//    });
// }).listen(PORT);

// console.log(`Server is running on PORT: http://localhost:${PORT}`);
// http://localhost:3000

//USING EXPRESS TO CREATE RESTFUL API
//important(0) - how to navigate to a page to show the data
app.get("/", (req, res) => {
  res.send("hello Root");
});
app.get("/Data", (req, res) => {
  res.send("hello Data");
});
app.get("/api/posts/", (req, res) => {
  res.send([1, 2, 3]);
});

//important (1) - what is port and how a hosting machine will know the port
//On  a local machine we can specify port number but on
// a server port number is not specified so we need to set up env on host machine
const port = process.env.PORT || 3000; //"||" used for otherwise or "or" logic
//WE CAN set up manul port also using export PORT=3000
// AND FOR windows use" set" instead of export

app.listen(port, () => {
  console.log("this extra function is provided  by listen function");
});
console.log(`Server is running on PORT: ${port}...`);

//important (2) - query and parameters
//":" is use to to refer parameters
//"?" is used a query ie ?sortBy=name
app.get("/api/courses/:year/:month", (req, res) => {
  // app.get('/api/courses/:id',(req,res)=>{
  // res.send(req.params.id);
  // res.send(req.params.year);
  // res.send(req.params.month); refer to month parameter
  //res.send(req.params);//it will refered as object
  res.send(req.query); //it will refered as query parameters(how and what type of data we want) http://localhost:3000/api/courses/2019/1?sortBy=name
}); // id is name of parameter

//important (3) -setting up api/courses/1 [refer element 1,2,3 in courses]
const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

//return courses array
app.get("/api/courses/", (req, res) => {
  res.send(courses); // we will send whole courses array
});
//return courses  element 1
app.get("/api/courses/:id", (req, res) => {
  // courses.find() we use this function to match given criteria
  // "req.params.id" it returns string so we need to convert it to int using parseInt
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  // if(!course) we did not find the course with the given criteria so we will send 404 error
  if (!course)
    res.status(404).send("The course with the given ID was not found");
  // return 404 error will response send
  else res.send(course); //   { id: 3, name: 'course3' } will return this object for http://localhost:3000/api/courses/3
});

//important (4) -    POST REQUEST using Postman to test HTTP SERVICES
//we will not post to the collection of courses
app.post("/api/courses/", (req, res) => {
  // we will create a obj to add to the list
  const course = {
    id: courses.length + 1, //for database the id will be assigned by the database
    name: req.body.name, //to read this from body of the request we use "req.body.name"
    //also we need to enable parsing to json object in express -bydefault it is disabled
    //app.use(express.json()); we use this line to eable parsing to json object
  };

  //we will add this obj to the list
  courses.push(course);
  //now we have post object to the server so we will send it back to the client in the body of reponse
  res.send(course);
});

//install this extension/app to test https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop/related?hl=en chrome postman type on google
//https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop/related

//Important (5) -INPUT VALIDATION IE for above validation what if user forgets to send name parameter
// npm joi --popular package for complex work like validation instead of  if(!req.body.name || req.body.name.length < 3){
app.post("/api/courses/", (req, res) => {
  //manual way for validation
  // if(!req.body.name || req.body.name.length < 3){
  //    //400 bad request should be sent
  //    res.status(400).send('Name is required and should be minimum 3 characters');
  //    return;
  // }

  //other way for validation using joi
  const schema = {
    name: Joi.string().min(3).required(),
  };
  const result = Joi.validate(req.body, schema);
//   const result =  schema.validate(req.body);
  console.log(result);
  if (result.error) {
    res.status(400).send("Bad request 400 -- needs validation");
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };
  courses.push(course);
  res.send(course);
});

// Important(6) - Handling Update Reuqest
app.put("/api/courses/:id", (req, res) => {
  if(!req.body.name || req.body.name.length < 3){
     //400 bad request should be sent
     res.status(400).send('Name is required and should be minimum 3 characters');
     return;
  }
  // we need to loop up course with given id
  // if we find the course we will update it
  //if not exist return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course with the given ID was not found");
    return;
  }
  //if exist we will update it
  course.name = req.body.name;
  res.send(courses);
});






