var express = require('express');
var path = require( 'path' );
var fs = require( "fs" );
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/*.html', function(req, res){
	var fileNm = req.path;
	console.log( Date.now() + " -- " + req.ip + " - " + fileNm )
	res.sendFile(path.join(__dirname + "/html" + fileNm ));
})

router.get('/getFileCount', function(req, res){
	var a = fs.readdirSync( "./html/" ).reverse();
	res.send( a )
})


module.exports = router;