Author :	Keira Gatt
Date :		11/04/2021


1.	General

1.1	The following additional modules are required -

	csvtojson	(tested with v2.0.10)
	json2csv	(tested with v5.0.6)

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

2.	CSVtoDB.js :	Upload CSV file to Database

2.1	Limitations

a.	When date is present, it needs to be in DD/MM/YYY format and the key can be either 'date' or 'Date'
b.	Any time component is ignored and all dates are set to 0000hrs
c.	CSV data elements must be comma delimited

2.2	FrontEnd Requirements

a.	Facilities for end user to select and upload CSV file

2.3	BackEnd Requirements

a.	CSV file contents need to be saved as a file by the server-side HTTP request handler, ideally in a folder called 'tmp' under the root directory. 
b.	CSVtoDB.js requires a reference to this file from the HTTP request handler, which is currently being assigned to variable HTTP_InputFile_Ref
c.	The temp CSV file is being removed once processing is done - fs.unlinkSync(inputFile). This action can be deleted if not desired.

+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

3.	DBtoCSV.js :	Download Search Results as a CSV file

3.1	Limitations

a.	If present, dates are converted from internal format to DD/MM/YYYY
b.	Any time component is not included in the output

3.2	FrontEnd Requirements

a.	Facilities for end user to select CSV file option when submitting a Search request (probably a checkbox will suffice)
b.	In addition to the displayed Search output, there needs to be a download link pointing to the CSV file generated on the server

3.3	BackEnd Requirements

a.	The server-side HTTP request handler needs to notify DBtoCSV.js that CSV output is required through boolean variable HTTP_ExportFile_Token
b.	A reference to the generated CSV filename is provided to the HTTP response handler with variable HTTP_OutputFile_Ref
c.	HTTP_OutputFile_Ref will be null if no CSV file is available (user option not set or search produced no output)

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

4.	Improvements

4.1	{ projection: {_id: 0 }} is being used in the find() methods to exclude the internal document id such as in -

	dbo.collection(collName).find( {volume: 47400}, { projection: {_id: 0 }}).toArray(function(err, result)

	I think this should be included in all Search methods since the document ID is irrelevant to the end user


4.2	The following code is include in DBtoCSV.js to convert the date from internal to regular format and also to discard the time component -

	jsonStr = JSON.stringify(result)                           			// prepare JSON string for parsing
        
        docsObj = JSON.parse(jsonStr, function(key, value) {       			// parse each key:value pair

            if(key == "date" || key == "Date") {                    			// if we have ISO date, convert to regular format
    
                dateArray = value.split("T")                        			// extract date and convert to DD/MM/YYYY
                dateArray = dateArray[0].split("-")
                dateStr = dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0] 
                
                return dateStr                                      			// replace with ISO date object with date string
                    
            }
            else {
    
                return value                                          			// otherwise just use original key value
    
            }   
 	})

	I think this routine should be used for all Search output as it provides a simpler date representation to the end user, based on DD/MM/YYYY
  
 







