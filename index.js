//-----------------------------------------------------------------;
// REQUIRES;
//-----------------------------------------------------------------;
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var express = require('express')
var path = require( 'path' )
var http = require( 'http' )
var WebSocket = require( "ws" )
var bodyParser = require('body-parser'); // body-parser 
//-----------------------------------------------------------------;
// REQUIRES;
//-----------------------------------------------------------------;
var app = express()
var port = 3000

var html_serving = require('./route_html');
var insertData = require('./route_insert');


app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.json());

app.use('/html', html_serving);
app.use('/insert', insertData);

app.get('/', function(req, res){
	/*/
	exec( 'espionage.bat', function( err,stdout, stderr ){
		if( err ) 
		{
			console.log(err)
		}
		console.log( stdout )
		res.sendFile(path.join(__dirname + '/index.html'));
	})
	/*/
	
	res.sendFile(path.join(__dirname + '/index.html'));
	
	//*/

	
})


var server = http.createServer(app);
var wss = new WebSocket.Server({ server });

wss.on('connection', function (ws) {
	var r  = {
		type : "message"
		, data : "websocket Connected!"
	}
	
	ws.send( JSON.stringify(r) );
	app.locals.clients = wss.clients;
	ws.on('close', function () {
	  console.log('stopping client interval');
	});
});

//start our server
server.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});