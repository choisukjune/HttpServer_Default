var express = require('express')
var path = require( 'path' )
var app = express()
var port = 3000

var html_serving = require('./route_html');
var insertData = require('./route_insert');

// body-parser 
var bodyParser = require('body-parser'); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json());

app.use('/html', html_serving);
app.use('/insert', insertData);

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname + '/index.html'));
})


app.listen(port, function(){ console.log(`listening at http://localhost:${port}`); })