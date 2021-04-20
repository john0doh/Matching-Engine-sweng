var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient
var date = require('mongodb').Date
const multer = require('multer')


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

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
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
        var attr = search["attr"]
        var eq = search["eqType"]
        var val = search["val"]
        if(search["operator"]=="and"){
          tempQ = makeQuery(attr,val,eq,search)
          andquery.push(tempQ)
          console.log(andquery)
        }else if(search["operator"]=="or"){
          tempQ = makeQuery(attr,val,eq,search)
          orquery.push(tempQ)
          console.log(orquery)
        }
      }

      //query doen't work if there's no and/or so dont include if so
      if(!andquery.length==0)
        localquery["$and"] = andquery
      if(!orquery.length==0)
        localquery["$or"] = orquery
      console.log(localquery)
      //get query
      tradeCollection.find(localquery).toArray(function(err,result){
        if (err) throw err
        res.send(result);
      });
    })

    // Finds items which match {attr:val} exactly in the db
    router.get("/match/:attr.:eq(lt|lte|gt|gte|eq).:val", function(req,res){

      var attr = req.params.attr;
      var val = req.params.val
      var eq = req.params.eq

      query = makeQuery(attr,val,eq,req.query)

      tradeCollection.find(query).toArray(function(err,result){
        if (err) throw err
        //console.log(result.length)
        newRes = dateFormat(result)
        res.send(newRes);
      });
    });

    router.post("/import", (req,res)=>{
      let upload = multer({ storage: storage, fileFilter: csvFilter }).single('db_import');
      upload(req, res, function(err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        docs = csvjson(req.file)

        tradeCollection.insertMany(docs, function(err,result) {
          if(err) throw err;
          console.log('Docs Inserted :', result.insertedCount)
          fs.unlinkSync(req.file);
        })

        res.send("Upload succesful");
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
        //console.log(result[attr][0].match(regex));
        Date_Obj = new Date(result[attr][0])
        console.log(Date_Obj)
        if(Date_Obj!="Invalid Date"){
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
          Date_Obj = new Date(result[attr])
          if(Date_Obj!="Invalid Date"){
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

function makeQuery(attr, val, eq,q){
  query = {}
  eqtype = {}
  var eq = "$"+eq
  
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

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'uploads/');
  },

  // By default, multer removes file extensions so let's add them back
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const csvFilter = function(req, file, cb) {
  if(!file.originalname.match(/\.(csv|CSV)$/)){
    req.fileValidationError="Only csv files are allowed";
    return cb(new Error('Only csv files are allowed!'), false);
  }
  cb(null,true)
}

function csvjson(inputFile) {
  csv({ checkType: true, output: "json" }).fromFile(inputFile).then((jsonObj)=>{         // convert CSV to JSON object
      docsObj=dateFormat(jsonObj);
    })
    return docsObj
}

function dateFormat(jsonObj){
  jsonStr = JSON.stringify(jsonObj)                          // prepare JSON string for parsing

    docsObj = JSON.parse(jsonStr, function(key, value) {       // parse each key:value pair
      if(types[key]!=undefined){
        if(types[key].startsWith("date")) {                    // if we have a date, add time offset and convert to ISO date object
            dateArray = value.split("/")                                                          // split DD/MM/YYYY
            dateStr = dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0] + " 00:00:00.000"    // and convert to YYYY/MM/DD HH:MM:SS.ms
            dateObj = new Date(dateStr)                           // create data object and adjust for TZ & DST
            UTC_TZO = dateObj.getTimezoneOffset() * 60000
            dateObj = new Date(dateObj.getTime() - UTC_TZO)
            return dateObj                                        // replace original date string with date object
        }
        else {
            return value                                          // otherwise just use original key value

        }
        }else {
          return value
      }
    })

  return docsObj
}

module.exports = router;

