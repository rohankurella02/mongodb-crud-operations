const { request } = require("express");
const exp = require("express");
const { Db } = require("mongodb");
const productApp = exp.Router();



//Create Product REST API

productApp.use(exp.json());


//create route to handle '/getproducts' path
productApp.get("/getproducts", (request, response) => {
    response.send({ message: "all products", payload: products });
  });
  
  //create route to handle '/getuser/id'
  productApp.get("/getproduct/:id", (request, response) => {
    //get url param
    let productId = +request.params.id;
  
    //search user obj by id
    let productObj = products.find((productObj) => productObj.id == productId);
    console.log(productObj);
    //if user not found
    if (productObj == undefined) {
      response.send({ message: "Product not existed" });
    }
    //if user found
    else {
      response.send({ message: "Product found", payload: productObj });
    }
  });
  
  //create a route to 'create-user'
  productApp.post("/create-product", (request, response) => {
    //get user obj sent by client
    //let newProduct = request.body;

    //get product object from the request
    let prodObj = request.body;

    //get product collection object
    let productCollectionObject = request.app.get("productCollectionObject");
    

    //insert productObj
    productCollectionObject.insertOne(prodObj, (err, result) => {
        if(err) {
            //response.send({ message: "Product not created" });
            console.log("error in creating product", err);
        }
        else {
            response.send({ message: "Product created" });
            console.log("product created successfully");
        }
    });
  });

  //creating a product using promises
    productApp.post("/create-product-promise", (request, response) => {
        //get product object from the request
        let prodObj = request.body;
        let productCollectionObject = request.app.get("productCollectionObject");
        productCollectionObject.insertOne(prodObj).then((result) => {
            response.send({ message: "Product created" });
        }).catch((err) => {
            console.log("error in creating product", err);
        });
    });

    //creating a product using async and await
    productApp.post("/create-product-async", async (request, response) => {
        //get product object from the request
        let prodObj = request.body;
        //get productCollectionObject
        let productCollectionObject = request.app.get("productCollectionObject");
        let result = await productCollectionObject.insertOne(prodObj);
        //send response
        response.send({ message: "Product created" });
    });
  
  //create a route to modify user data
  productApp.put("/update-product", (request, response) => {
    //get modified user obj
    let modifiedObj = request.body;
  
    //logic to modify existing user
      let productObj = products.find((productObj) => productObj.id == modifiedObj.id);
      if (productObj == undefined) {
          response.send({ message: "User not existed" });
      }
      else {
          productObj.name = modifiedObj.name;
          productObj.age = modifiedObj.age;
          response.send({ message: "Product updated" });
      }
    //send response
  });
  
  
  //create a route to delete user by id
  productApp.delete("/remove-product/:id", (request, response) => {
    //get id of user to remove
    let productId = request.params.id;
  
    //logic to identify and remove user
    let productObj = products.find((productObj) => productObj.id == productId);
      if (productObj == undefined) {
          response.send({ message: "Product not existed" });
      }
      else {
          products = products.filter((productObj) => productObj.id != productId);
          response.send({ message: "Product removed" });
      }
    //send response
  });

  module.exports = productApp;