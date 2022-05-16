//create router to handle user api requests
const exp = require("express");
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");


//to extract body of request object
userApp.use(exp.json());


//Create REST API

//create route to handle '/getusers' path
userApp.get("/getusers", expressAsyncHandler( async (request, response) => {

   
}));

//create route to handle '/getuser/id'
userApp.get("/getuser/:id", expressAsyncHandler( async (request, response) => {
  //get url param
  

}));

//create a route to 'create-user'
userApp.post("/create-user", async (request, response, next) => {
  
});

//create a route to modify user data
userApp.put("/update-user", expressAsyncHandler( async (request, response) => {
  

}));


//create a route to delete user by id
userApp.delete("/remove-user/:id", expressAsyncHandler( async(request, response) => {

    
}));

module.exports = userApp;