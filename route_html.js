var express = require('express');
var path = require( 'path' );
var fs = require( "fs" );
var router = express.Router();

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


var JsonToHtml = function( fileNm, cbFunction ){
	console.log( "[S] - window.FNS.resultJsonToHtml" )
	
	var targetFilePath = targetFilePath || "../crawler_sale_data/list/json/" + fileNm + ".json";
	var resultDirPath = resultDirPath || "./html/";

	var _to = JSON.parse( fs.readFileSync( targetFilePath ).toString() );
	var keys = Object.keys( _to ).reverse();
	var r = `
	`;
	var i = 0,iLen = keys.length,io;
	for(;i<iLen;++i){
		io = _to[ keys[i] ];

		if( io.salePrice != null ) var salePrice = io.salePrice + "<br>"
		else var salePrice = "SOLD OUT!<br>";
		if( salePrice == "SOLD OUT!<br>" ) continue;
		var thmbnail = io.img;
		var title = io.nm.join( " - " );
		var href = io.url;
		var websiteNm = io.websiteNm
		var brand = io.brand + "<br>"

		if( io.msrp != null ) var msrp = io.msrp + "<br>"
		else if( io.msrp != null ) var msrp = ""
		var info = brand + salePrice + msrp

		//r += "<td>내용</td><td>" + io.detail.join("\n").replace( /rel\=\"xe_gallery\"/gi, "width='200'" ) + "</td>"
		//${description}
		r += `
		<div class="card">
			<a href="${href}" target="_blank" class="image">
			<img src="${thmbnail}">
			</a>
			<div class="content">
			<a href="${href}" target="_blank" class="header">${title}</a>
			<div class="meta">
				<a href="${href}" target="_blank">${websiteNm}</a>
			</div>

			<div class="description" style="font-size:11px;word-break: break-all;">
			<a href="${href}" target="_blank">${info}</a>
			</div>
			</div>
			<!--div class="extra content">
				<!--span class="right floated">
					Right-someText
				</span-->
				<!--span>
					<i class="user icon"></i>
					Left-someText
				</span>
			</div-->
		</div>
		`

	}

	r += `
	`
	debugger;
	fs.mkdirSync( resultDirPath, { recursive: true } );
	fs.writeFileSync( resultDirPath + fileNm + ".html", r, {flag : "w"} )	
	console.log( "[E] - window.FNS.resultJsonToHtml" )
	cbFunction( fileNm )
}

router.get('/*.html', function(req, res){
	var fileNm = req.path;
	console.log( Date.now() + " -- " + req.ip + " - " + fileNm )
	
	var targetDate = req.params[0].split("_")[0];
	var fileNm00 = req.params[0]
	JsonToHtml( fileNm00, function(data){
		res.sendFile(path.join(__dirname + "/html/" + data + ".html" ));
	})
	
})

router.get('/getFileCount', function(req, res){
	var a = fs.readdirSync( "./html/" ).reverse();
	res.send( a )
})

module.exports = router;