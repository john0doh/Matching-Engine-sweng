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


    // Finds items which match {attr:val} exactly in the db
    // Only works for string equality at the moment
    router.get("/match/:attr.eq.:val", function(req,res){
      query = {}
      var attr = req.params.attr;
      var val = req.params.val

      query[attr] = val
      //console.log(query)

      tradeCollection.find(query).toArray(function(err,result){
        if (err) throw err
        //console.log(result.length)
        res.send(result);
      });
    });

  })
  .catch(error => console.error(error))

module.exports = router;