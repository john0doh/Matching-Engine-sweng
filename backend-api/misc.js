var MongoClient = require('mongodb').MongoClient

var url = "mongodb://localhost:27017/"


MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
  if (err) throw err
  dbo = db.db("stocks_project")

  // Find doc with max volume

  /*
    dbo.collection("stockV2").find().sort({volume: -1}).limit(1).toArray(function(err, result) {  
        if (err) throw err
        console.log(result)

        db.close();

    })
*/

  // Find doc with min volume

  /*
    dbo.collection("stockV2").find().sort({volume: 1}).limit(1).toArray( function(err, result) {  
        if (err) throw err
        console.log(result)

        db.close();

    })
  */

  // Find all docs ending in 'Z'

  /*
    dbo.collection("stockV2").find( {ticker: /Z$/}).toArray(function(err, result) {  
        if (err) throw err
        console.log(result)
        
        db.close()
    })
  */

  // Returns unique values from "ticker" column

  /*
    dbo.collection("stockV2").distinct("ticker", function(err, result) {  
        if (err) throw err
        console.log(result)
    
        db.close()
    })
  */

  // Find first 2 documents

  /*
    dbo.collection("stockV2").find().limit(2).toArray( function(err, result) {
        if (err) throw err
        console.log(result)

        db.close()

    })
  */

  // Find last 2 documents

  /*
    dbo.collection("stockV2").find().sort({_id: -1}).limit(2).toArray( function(err, result) {
        if (err) throw err
        console.log(result)

        db.close()

    })
  */

})