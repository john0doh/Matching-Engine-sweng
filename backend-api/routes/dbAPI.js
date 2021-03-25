var express = require("express");
var router = express.Router();
var MongoClient = require('mongodb').MongoClient

var fs = require('fs');
var password = fs.readFileSync("./routes/password.txt")

var url = "mongodb+srv://SWENGUser:"+password+"@swengcluster.mbqhh.mongodb.net/sample_mflix?retryWrites=true&w=majority"

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db("sample_mflix")
    const tradeCollection = db.collection("movies")

    router.get("/fields",function(req,res,next){
        tradeCollection.findOne({},function(err, result) {
            res.send(Object.keys(result))
        })
    });

  })
  .catch(error => console.error(error))


// use GET /match/:attr.:eq.:val
// router.get("/match/:attr.:eq.:val", function(req,res){
    
// });

module.exports = router;