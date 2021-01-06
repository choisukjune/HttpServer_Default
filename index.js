var express = require('express')
var path = require( 'path' )
var app = express()
var port = 3000

var html_serving = require('./html_serving');

app.use('/html', html_serving);

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/html/index.html'));
})


app.listen(port, function(){
	console.log(`listening at http://localhost:${port}`)
})