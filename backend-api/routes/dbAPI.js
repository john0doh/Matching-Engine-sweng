var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var date = require('mongodb').Date

var fs = require('fs');
var password = fs.readFileSync("./routes/password.txt")

class Stack {

  constructor(){
    this.items = [];
  }

  push(item){
    this.items.push(item);
  }

  pop(){
    if(this.items.length==0)
      return null
    return this.items.pop();
  }

  peek(){
    return this.items[this.items.length-1]
  }

  isEmpty(){
    return this.items.length == 0;
  }

  toString(){
    var str = ""
    for(var i=0;i<this.items.length;i++){
      str+=this.items[i]+ " ";
    }
    return str
  }
}


// Types stores the names of the items in the db as well as their types
var types = {}
var logicalStack = new Stack();

var url = "mongodb+srv://SWENGUser:"+password+"@swengcluster.mbqhh.mongodb.net/sample_mflix?retryWrites=true&w=majority"

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false})
  .then(client => {
    console.log('Connected to Database')
    const db = client.db("sample_mflix")
    const tradeCollection = db.collection("movies")

    tradeCollection.findOne({},function(err, result) {
      initTypes(result)
      //console.log(types)
    })

    //Sends the name of the fields found in the db
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

    //send the types gotten from the db
    router.get("/types",function(req,res,next){
      res.send(types);
    });

    router.get("/:log(and|or|end)/:attr.:eq(lt|lte|gt|gte|eq).:val",function(req,res){
      //console.log(req.params.log);
      var stackAdd = {}
      stackAdd["operator"] = req.params.log;
      stackAdd["attr"] = req.params.attr;
      stackAdd["eqType"] = req.params.eq;
      stackAdd["val"] = req.params.val;
      if(req.query.atol!=undefined){
        stackAdd["atol"] = req.query.atol;
      }else if(req.query.rtol!=undefined){
        stackAdd["rtol"] = req.query.rtol;
      }
      logicalStack.push(stackAdd);
      //console.log(stackAdd);
      res.send("added to stack");
    })

    router.get("/match/delete"), function(req,res){
      logicalStack = new Stack()
    }

    router.get("/match/resolve", function(req,res){
      //establish local variables
      localquery = {}
      andquery = []
      orquery = []

      //for everything in the stack make the queries and conjoin them
      while(!logicalStack.isEmpty()){
        search = logicalStack.pop()
        console.log(search)
        if(search["operator"]=="and"){
          tempQ = makeQuery(search)
          andquery.push(tempQ)
          console.log(andquery)
        }else if(search["operator"]=="or"){
          tempQ = makeQuery(search)
          orquery.push(tempQ)
          console.log(orquery)
        }
      }

      //query doen't work if there's no and/or so dont include if so
      if(!andquery.length==0)
        query["$and"] = andquery
      if(!orquery.length==0)
        localquery["$or"] = orquery
      //console.log("Query:\n")
      //console.log(localquery)

      //get query
      tradeCollection.find(localquery).toArray(function(err,result){
        if (err) throw err
        res.send(result);
      });
    })

    // Finds items which match {attr:val} exactly in the db
    router.get("/match/:attr.:eq(lt|lte|gt|gte|eq).:val", function(req,res){
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
          //console.log(result[attr].match(regex))
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

function makeQuery(q){
  query = {}
  eqtype = {}
  var attr = q["attr"]
  var val = q["val"]
  var eq = "$"+q["eqType"]
  
  eqtype[eq] = "";

  //console.log(attr,types[attr])

  if(q["atol"]!=undefined && types[attr].startsWith("number")){
    atol = Number(req.query.atol); 
    tollow = Number(val)-atol;
    tolhi = Number(val)+atol;
    innerQuery = {$gte:tollow, $lte:tolhi};
    query[attr] = innerQuery;
  }
  else if(q["rtol"]!=undefined && types[attr].startsWith("number")){
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
  //console.log(query)
  return query
}

module.exports = router;

