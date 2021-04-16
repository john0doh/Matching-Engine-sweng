const fs = require('fs')
const path = require('path')
const Json2csvParser = require("json2csv").Parser
const MongoClient = require('mongodb').MongoClient

const dbURL = "mongodb://localhost:27017/"

const dbName = "TestDB-1"                                             // placeholder for database name (change as required)
const collName = "Collection-1"                                     // placeholder for collection (change as required)

var HTTP_ExportFile_Token = true                                    // placeholder export flag (passed by HTTP request handler)
var HTTP_OutputFile_Ref = null                                      // Link to CSV file (passed to HTTP response handler)

// Placeholder for a DB search routine (as selected by HTTP request routing)

MongoClient.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
    if (err) throw err
    dbo = db.db(dbName)

    dbo.collection(collName).find( {volume: 47400}, { projection: {_id: 0 }}).toArray(function(err, result) { 
        
        if (err) throw err
        
        jsonStr = JSON.stringify(result)                           // prepare JSON string for parsing
        
        docsObj = JSON.parse(jsonStr, function(key, value) {       // parse each key:value pair

            if(key == "date" || key == "Date") {                    // if we have ISO date, convert to regular format
    
                dateArray = value.split("T")                        // extract date and convert to DD/MM/YYYY
                dateArray = dateArray[0].split("-")
                dateStr = dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0] 
                
                return dateStr                                      // replace with ISO date object with date string
                    
            }
            else {
    
                return value                                          // otherwise just use original key value
    
            }
        })
        
        console.log('Docs Found :', docsObj.length)

        // Export search results to CSV if flag is set in HTTP request

        if(HTTP_ExportFile_Token && docsObj.length > 0) {

            dateObj = new Date()                                                        // assign a unique name to CSV file
            HTTP_OutputFile_Ref = path.join(__dirname, dateObj.getTime() + ".csv")

            json2csvParser = new Json2csvParser({ header: true })                       // convert result object to CSV and keep header
            csvData = json2csvParser.parse(docsObj);

            fs.writeFile(HTTP_OutputFile_Ref, csvData, function(error) {                 // write CSV file
                if (error) throw error;
                console.log(HTTP_OutputFile_Ref);
            })

        }

        db.close()

      })
      
})