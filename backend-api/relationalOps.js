
var MongoClient = require('mongodb').MongoClient

var url = "mongodb://localhost:27017/"


MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
  if (err) throw err
  dbo = db.db("stocks_project")
  

  // Equal : Find docs with volume = 47400

  /*
    dbo.collection("stockV2").find( {volume: 47400}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

  // Equal : Find docs with ticker = 'AHH'

  /*
    dbo.collection("stockV2").find( {ticker: 'AHH'}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

  // Greater than : Find docs with volume > 47400
    
  /*
    dbo.collection("stockV2").find( {volume:  {$gt: 47400}}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

  // Greater than or equal : Find docs with volume >= 47400
    
  /*
    dbo.collection("stockV2").find( {volume:  {$gte: 47400}}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

  // Less than : Find docs with volume < 47400

  /*
    dbo.collection("stockV2").find( {volume:  {$lt: 97400}}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

  // Less than or equal : Find docs with volume <= 47400

  /*
    dbo.collection("stockV2").find( {volume:  {$lte: 97400}}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

})


