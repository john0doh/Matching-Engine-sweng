var MongoClient = require('mongodb').MongoClient

var url = "mongodb://localhost:27017/"

var UTC_TZO                               // Keeps track of UTC TZ & DST Offset from local time

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
  if (err) throw err
  dbo = db.db("stocks_project")
  
  // Placeholders for Web Client Input

  const S_YY = "2013", S_MM = "May", S_DD = "10"          // Start date (change as applicable)
  const E_YY = "2013", E_MM = "May", E_DD = "10"          // End date (change as applicable)

  var S_D_Str = S_YY + "-" + S_MM + "-" + S_DD + " 00:00:00.000"            // Start date string in ISO 8601 Extended format
  var E_D_Str = E_YY + "-" + E_MM + "-" + E_DD + " 23:59:59.999"            // End date string in ISO 8601 Extended format
  
  // Start data object
  
  Date_Obj = new Date(S_D_Str)                            // Create UTC Date object from Start date string
  UTC_TZO = Date_Obj.getTimezoneOffset() * 60000          // UTC TZ & DST Offset from local time in min converted to ms
  S_Date = new Date(Date_Obj.getTime() - UTC_TZO)         // Create Start date object, adjusted to local time

  // End date object

  Date_Obj = new Date(E_D_Str)                            // Create UTC Date object from End date string
  UTC_TZO = Date_Obj.getTimezoneOffset() * 60000          // UTC TZ & DST Offset from local time in in min converted to ms
  E_Date = new Date(Date_Obj.getTime() - UTC_TZO)         // Create End date object, adjusted to local time

  console.log(S_Date)
  console.log(E_Date)
  
  // Find docs within date range S_D_Str:E_D_Str

  /*
    dbo.collection("stockV2").find( {date:  {  $gte: S_Date, $lte: E_Date}}).toArray(function(err, result) {
      if (err) throw err                                                                                                                    
      console.log(result)
    
      db.close()
    })
  */

  // Find docs within date range S_D_Str:E_D_Str & ticker = RAVN

  /*
    dbo.collection("stockV2").find( {date:  {  $gte: S_Date, $lte: E_Date}, ticker : "RAVN"}).toArray(function(err, result) {   
      if (err) throw err                                                                                                      
      console.log(result)
    
      db.close()
    })
  */

})

