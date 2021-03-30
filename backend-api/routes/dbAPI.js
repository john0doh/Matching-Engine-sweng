var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient

var fs = require('fs');
var password = fs.readFileSync("./routes/password.txt")

// Types stores the names of the items in the db as well as their types
var types = {}

var url = "mongodb+srv://SWENGUser:"+password+"@swengcluster.mbqhh.mongodb.net/sample_mflix?retryWrites=true&w=majority"

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db("sample_mflix")
    const tradeCollection = db.collection("movies")

    tradeCollection.findOne({},function(err, result) {
      initTypes(result)
      //console.log(result)
      
      //res.send(types)
    })

    //Gets the fields from the 1st time in the db
    //(assuming db follows a schema)
    router.get("/fields",function(req,res,next){
      res.send(Object.keys(types))
    });


    // Finds items which match {attr:val} exactly in the db
    // Only works for string equality at the moment
    router.get("/match/:attr.eq.:val", function(req,res){
      query = {}
      var attr = req.params.attr;
      var val = req.params.val

      //console.log(types,attr,types[attr])

      if(types[attr].endsWith("Array")){
        if(types[attr].startWith("number")){
          query[attr] = [Number(val)]
        }
        else{
          query[attr] = [val]
        }
      }
      else{
        if(types[attr].startsWith("number")){
          query[attr] = Number(val)
        }
        else{
          query[attr] = val
        }
      }
      console.log(query)

      tradeCollection.find(query).toArray(function(err,result){
        if (err) throw err
        //console.log(result.length)
        res.send(result);
      });
    });

  })
  .catch(error => console.error(error))


// itinitalises the types variable to have key:type pairs recursivley
function initTypes(result){
  for (attr in result){
    if(Array.isArray(result[attr])){
      types[attr] = "" + (typeof result[attr][0]) + " Array"
    }
    else{
      if(typeof result[attr] == "object" && attr != "_id"){
        //recurse on nested objects to get all keys
        initTypes(result[attr])
      }
      else{
        types[attr] = typeof result[attr]
      }
    }
  }
}

module.exports = router;