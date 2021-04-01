var MongoClient = require('mongodb').MongoClient

var url = "mongodb://localhost:27017/"


MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
  if (err) throw err
  dbo = db.db("stocks_project")

  var query = 11.5
  var absTol = 0.25
  var relTolPerc = 1
  
  var relTol = (relTolPerc / 100) * query

  // Find all docs (absTol - query <= low <= absTol + query)
  /*
    dbo.collection("stockV2").find({low: {$gte: (query - absTol) , $lte:(query + absTol)}}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)

      db.close()
    })
  */

 // Find all docs (relTol - query <= low <= relTol + query)
/*
  dbo.collection("stockV2").find({low: {$gte: (query - relTol) , $lte:(query + relTol)}}).toArray(function(err, result) {  
    if (err) throw err
  console.log(result)

  db.close()
  })
*/




})