const fs = require('fs')
const path = require('path')
const csv = require('csvtojson')
const MongoClient = require('mongodb').MongoClient

const dbURL = "mongodb://localhost:27017/"

const dbName = "TestDB-1"                                             // placeholder for database name (change as required)
const collName = "Collection-1"                                     // placeholder for collection (change as required)

const HTTP_InputFile_Ref = path.join(__dirname, 'daily_prices100k.csv')           // Link to CSV file (passed by HTTP request handler)

// Assign a unique name to CSV file to prevent conflicts should concurrent calls use the same CSV file

dateObj = new Date()
inputFile = path.join(__dirname, dateObj.getTime() + ".tmp.csv")              // generate temporary unique filename
fs.renameSync(HTTP_InputFile_Ref, inputFile);                                // rename CSV file

// Process CSV file

csv({ checkType: true, output: "json" }).fromFile(inputFile).then((jsonObj)=>{         // convert CSV to JSON object

    jsonStr = JSON.stringify(jsonObj)                          // prepare JSON string for parsing

    docsObj = JSON.parse(jsonStr, function(key, value) {       // parse each key:value pair

        if(key == "date" || key == "Date") {                    // if we have a date, add time offset and convert to ISO date object

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
    })
    
    // Insert documents in Mongo DB

    if(docsObj.length > 0) {
        MongoClient.connect(dbURL, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, db) {
            if (err) throw err
            dbo = db.db(dbName)

            dbo.collection(collName).insertMany(docsObj, function(err, result) {
                if (err) throw err;
                console.log('Docs Inserted :', result.insertedCount)
            
                fs.unlinkSync(inputFile)        // remove tmp CSV file
                db.close()                      // close DB connection
            
            })
        })
    }
})
