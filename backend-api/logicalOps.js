var MongoClient = require('mongodb').MongoClient

var url = "mongodb://localhost:27017/"


MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
  if (err) throw err
  dbo = db.db("stocks_project")

  // AND Method 1 : ticker = 'PEZ' && volume = 2500

  /*
    var q1 = {}
    q1.ticker = 'PEZ'
    q1.volume = 2500
  
    dbo.collection("stockV2").find(q1).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

  // AND Method 2

  /*
    dbo.collection("stockV2").find({volume: 47400, ticker: 'RAVN'}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

  // OR Example #1 : volume = 47400 || ticker = 'RAVN'

  /*
    dbo.collection("stockV2").find({$or: [{volume: 47400},{ticker: 'RAVN'} ]}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

  // OR Example #2 : volume <= 47400 || ticker = 'RAVN'

  /*
    dbo.collection("stockV2").find({$or: [{volume:  {$lte: 47400}}, {ticker: 'RAVN'}]}).toArray(function(err, result) {  
      if (err) throw err
      console.log(result)
      db.close()
    })
  */

})