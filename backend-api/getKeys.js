var MongoClient = require('mongodb').MongoClient

var url = "mongodb://localhost:27017/"

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {

    if (err) throw err
    var dbo = db.db("stocks_project")  

    dbo.collection("stock").findOne({}, function(err, result) {

        if (err) throw err;
        console.log(result);  // print first doc
    
        var  ob1 = Object.keys(result)
        console.log(ob1);     // print keys
     
      db.close();
      });
      
})