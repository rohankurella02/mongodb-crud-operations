//create router to handle user api requests
const exp = require("express");
const userApp = exp.Router();


//to extract body of request object
userApp.use(exp.json());


//Create REST API

//create route to handle '/getusers' path
userApp.get("/getusers", (request, response) => {
  response.send({ message: "all users", payload: users });
});

//create route to handle '/getuser/id'
userApp.get("/getuser/:id", (request, response) => {
  //get url param
  let userId = +request.params.id;

  //search user obj by id
  let userObj = users.find((userObj) => userObj.id == userId);
  console.log(userObj);
  //if user not found
  if (userObj == undefined) {
    response.send({ message: "User not existed" });
  }
  //if user found
  else {
    response.send({ message: "User found", payload: userObj });
  }
});

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
userApp.put("/update-user", (request, response) => {
  //get modified user obj
  let modifiedObj = request.body;

  //logic to modify existing user
    let userObj = users.find((userObj) => userObj.id == modifiedObj.id);
    if (userObj == undefined) {
        response.send({ message: "User not existed" });
    }
    else {
        userObj.name = modifiedObj.name;
        userObj.age = modifiedObj.age;
        response.send({ message: "User updated" });
    }
  //send response
});


//create a route to delete user by id
userApp.delete("/remove-user/:id", (request, response) => {
  //get id of user to remove
  let userId = request.params.id;

  //logic to identify and remove user
  let userObj = users.find((userObj) => userObj.id == userId);
    if (userObj == undefined) {
        response.send({ message: "User not existed" });
    }
    else {
        users = users.filter((userObj) => userObj.id != userId);
        response.send({ message: "User removed" });
    }
  //send response
});

module.exports = userApp;