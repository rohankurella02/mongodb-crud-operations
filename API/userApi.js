//create router to handle user api requests
const exp = require("express");
const userApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");

//import bcryptjs for password hashing
const bcryptjs = require("bcryptjs");
const bcrypt = require("bcryptjs/dist/bcrypt");

//import jsonwebtoken to create a token for authentication
const jwt = require("jsonwebtoken");


//to extract body of request object
userApp.use(exp.json());


//Create REST API

//create route to handle '/getusers' path
userApp.get("/getusers", expressAsyncHandler( async (request, response) => {
    let userCollectionObject = request.app.get("userCollectionObject");
    let users = await userCollectionObject.find().toArray();

    response.send({message: "users list", payload: users});
   
}));

//create route to user login
userApp.post("/login", expressAsyncHandler( async (request, response) => {
    let userCollectionObject = request.app.get("userCollectionObject");
    let userCredObj = request.body;
    //search for user by username
    let userOfDB = await userCollectionObject.findOne({username: userCredObj.username});
    if(userOfDB == null)
        response.send({message: "Invalid Username"});
    else {
        //comparing the passwords
        let status = await bcryptjs.compare(userCredObj.password, userOfDB.password);
        if(status == false)
            response.send({message: "Invalid Password"});
        else {
            //create a token
            let token = jwt.sign({username: userOfDB.username}, 'abcdef', {expiresIn: 60});  //60 or "2h" or "2d
            //send this token to the client
            response.send({message: "login Successful", payload: token, userObj: userOfDB});
        }
    }
  

}));

//create a route to 'create-user'
userApp.post("/create-user", expressAsyncHandler( async (request, response, next) => {

    let userCollectionObject = request.app.get("userCollectionObject");
    let newUserObj = request.body;

    //search for the user by username
    let userOfDB = await userCollectionObject.findOne({username: newUserObj.username})

    if(userOfDB !== null)
        response.send({message: "username already taken"});
    else {
        //hash password
        let hashedPassword = await bcryptjs.hash(newUserObj.password, 6);
        //replace plain password with hashed password in newUserObj
        newUserObj.password = hashedPassword;
        //insert newUser
        await userCollectionObject.insertOne(newUserObj);
        response.send({message : "New User Created Successfully"});
    }
  
}));

//create a route to modify user data
userApp.put("/update-user", expressAsyncHandler( async (request, response) => {
  

}));


//create a route to delete user by id
userApp.delete("/remove-user/:id", expressAsyncHandler( async(request, response) => {


}));

module.exports = userApp;