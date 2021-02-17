var express = require("express");
var router = express.Router();


//These functions return simple data when called.
//Express knows how to access them becuase of our code in ./app.js
router.get("/test1", function(req,res,next) {
    res.send("API is working!");
});

router.get("/test2", function(req,res,next) {
    res.send("API is still working!");
});

module.exports = router;