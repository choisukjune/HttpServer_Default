var express = require('express');
var path = require( 'path' )
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/*', function(req, res){
	var fileNm = req.path;
	console.log( Date.now() + " -- " + req.ip + " - " + fileNm )
	res.sendFile(path.join(__dirname + "/html" + fileNm ));
})

module.exports = router;