//create router to handle user api requests
const exp = require("express");
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");


//to extract body of request object
userApp.use(exp.json());


//Create REST API

//create route to handle '/getusers' path
userApp.get("/getusers", expressAsyncHandler( async (request, response) => {

    let userCollectionObject = request.app.get("userCollectionObject");
    let result = await userCollectionObject.find().toArray();
    
    response.send({ message: "all users", payload: result});
}));

//create route to handle '/getuser/id'
userApp.get("/getuser/:id", expressAsyncHandler( async (request, response) => {
  //get url param
  let userId = +request.params.id;
  
  let userCollectionObject = request.app.get("userCollectionObject");
  let result = userCollectionObject.findOne({id: userId});

  if(result == null) {
      response.send({message: "User Does Not Exist", payload: result});
  }
  else {
      response.send({message: "User Found", payload: result});
  }

}));

//create a route to 'create-user'
userApp.post("/create-user", async (request, response, next) => {
  //get user obj sent by client
  try{
      //get prodObj from request
        let newUser = request.body;
        //get userCollectionObject
        let result = await request.app.get("userCollectionObject").insertOne(newUser);

        //send response
        response.send({ message: "New user created" });
    }
    catch(err) {
        //handover error object to error handling middleware
        next(err);
    }
});

//create a route to modify user data
userApp.put("/update-user", expressAsyncHandler( async (request, response) => {
  //get modified user obj
  let modifiedObj = request.body;

  let userCollectionObject = request.app.get("userCollectionObject");
  let result = await userColelctionObject.updateOne({id: modifiedObj.id}, {$set : modifiedObj});

  response.send({message: "User Updated"});

}));


//create a route to delete user by id
userApp.delete("/remove-user/:id", expressAsyncHandler( async(request, response) => {
  //get id of user to remove
  let userId = request.params.id;

  let userCollectionObject = request.app.get("userCollectionObject");
  let result = await userCollectionObject.deleteOne({id: userId})

  response.send({message: result});

}));

module.exports = userApp;