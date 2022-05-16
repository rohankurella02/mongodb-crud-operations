const { request } = require("express");
const exp = require("express");
const { Db } = require("mongodb");

const expressAsyncHandler = require("express-async-handler");
const productApp = exp.Router();



//Create Product REST API

//to extract body of request object
productApp.use(exp.json());


//Route for Get request
productApp.get("/getproducts", expressAsyncHandler(async (request, response) => {
    
    //get the product collection object
    let productCollectionObject = request.app.get("productCollectionObject");
    let products = await productCollectionObject.find().toArray();
    response.send({ message: "all products", payload: products });
}));

  
//Route for Get request by ID
productApp.get("/getproduct/:id", expressAsyncHandler(async (request, response) => {
    //get parameter from the url
    let productId = +request.params.id;

    //get productCollectionObject
    let productCollectionObject = request.app.get("productCollectionObject");
    let products = await productCollectionObject.findOne({id : productId});
    if(products == null){
        response.send({ message: "Product not existed" });
    }
    else{
        response.send({ message: "Product found", payload: products });
    }
}));
  
  //Route for POST Request
  productApp.post("/create-product", (request, response) => {
  
    //get user object sent by the client
    //get product object from the request
    let prodObj = request.body;

    //get product collection object
    let productCollectionObject = request.app.get("productCollectionObject");
    

    //insert productObj into product collection
    productCollectionObject.insertOne(prodObj, (err, result) => {
        if(err) {
            response.send({ message: "Product not created" });
            //console.log("error in creating product", err);
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
        //get product collection object
        let productCollectionObject = request.app.get("productCollectionObject");
        productCollectionObject.insertOne(prodObj).then((result) => {
            response.send({ message: "Product created" });
        }).catch((err) => {
            console.log("error in creating product", err);
        });
    });

    //creating a product using async and await and expressAsyncHandler
    productApp.post("/create-product-async", expressAsyncHandler (async (request, response) => {
        //get product object from the request
        let prodObj = request.body;
        //get productCollectionObject
        let productCollectionObject = request.app.get("productCollectionObject");
        let result = await productCollectionObject.insertOne(prodObj);
        //send response
        response.send({ message: "Product created" });
    }));
  
  //Route for PUT Request
  productApp.put("/update-product", expressAsyncHandler(async (request, response) => {
    //get modified user obj
    let modifiedObj = request.body;

    //get productCollectionObject
    let productCollectionObject = request.app.get("productCollectionObject");

    let result = await productCollectionObject.updateOne({id: modifiedObj.id}, {$set: modifiedObj});
  
    if(result.modifiedCount == 0){
        response.send({ message: "Product not existed" });
    }
    else{
        response.send({ message: "Product updated" });
    }
    
  }));
  
  
  //Route for DELETE Request
  productApp.delete("/remove-product/:id", expressAsyncHandler( async (request, response) => {
    //get id of user from the url to remove
    let productId = (+request.params.id);
  
    //get productCollectionObject
    let productCollectionObject = request.app.get("productCollectionObject");
    let result = await productCollectionObject.deleteOne({"id": productId}, function(err, result){
        if(err){
            response.send({ message: "Product not deleted" });
            }
            else{
                response.send({ message: "Product deleted" });
                }});

  }));

  module.exports = productApp;