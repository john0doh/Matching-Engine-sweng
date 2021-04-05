var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var date = require('mongodb').Date

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
      console.log(types)
      
      //res.send(types)
    })

    //Gets the fields from the 1st time in the db
    //(assuming db follows a schema)
    router.get("/fields",function(req,res,next){
      result = []
      keyArr = Object.keys(types)
      for(var i=0;i<keyArr.length;i++){
        result[i] = {}
        result[i]["value"] = i
        result[i]["label"] = keyArr[i]
      }
      res.send(result)

    });


    // Finds items which match {attr:val} exactly in the db
    // Only works for string equality at the moment
    router.get("/match/:attr.:eq.:val", function(req,res){
      query = {}
      eqtype = {}
      var attr = req.params.attr;
      var val = req.params.val
      var eq = "$"+req.params.eq
      
      eqtype[eq] = "";

      console.log(attr,types[attr])

      if(req.query.atol!=undefined && types[attr].startsWith("number")){
        atol = Number(req.query.atol); 
        tollow = Number(val)-atol;
        tolhi = Number(val)+atol;
        innerQuery = {$gte:tollow, $lte:tolhi};
        query[attr] = innerQuery;
      }
      else if(req.query.rtol!=undefined && types[attr].startsWith("number")){
        rtol = Number(req.query.rtol); 
        tollow = Number(val)-(Number(val)*rtol);
        tolhi = Number(val)+(Number(val)*rtol);
        innerQuery = {$gte:tollow, $lte:tolhi};
        query[attr] = innerQuery;
      }
      else if(types[attr].endsWith("Array")){
        if(types[attr].startsWith("number")){
          eqtype[eq] = [Number(val)]
          query[attr] = eqtype
        }
        else{
          eqtype[eq] = val;
          query[attr] = eqtype;
        }
      }
      else{
        if(types[attr].startsWith("number")){
          eqtype[eq] = Number(val)
          query[attr] = eqtype
        }
        else{
          eqtype[eq] = val;
          query[attr] = eqtype
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
    
    //regex for date
    const regex = "\d\d\d\d-\d\d-\d\dT\d\d:\d\d.\d\d\dZ"

    if(Array.isArray(result[attr])){
      if(typeof result[attr][0] == "string"){
        console.log(result[attr][0].match(regex));
        if(result[attr][0].match(regex)!=null){
          //is a date
          types[attr] = "date Array"
        }else{
          //isnt a date
          types[attr] = "" + (typeof result[attr][0]) + " Array"
        }
      }else{
        types[attr] = "" + (typeof result[attr][0]) + " Array"
      }
    }
    else{
      if(typeof result[attr] == "object" && attr != "_id"){
        //recurse on nested objects to get all keys
        initTypes(result[attr])
      }
      else{
        //console.log(result[attr].match(regex))
        if(typeof result[attr] == "string"){
          console.log(result[attr].match(regex))
          if(result[attr].match(regex)!=null){
            types[attr] = "date";
          }else{
            //isnt a date
            types[attr] = typeof result[attr]
          }
        }else{
          //is a date
          types[attr] = typeof result[attr]
        }
      }
    }
  }
}

module.exports = router;