var express = require('express');
var path = require( 'path' );
var fs = require( "fs" );
var router = express.Router();
var WebSocket = require("ws");

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});

router.get('/*.html', function(req, res){
	var fileNm = req.path;
	console.log( Date.now() + " -- " + req.ip + " - " + fileNm )
	res.sendFile(path.join(__dirname + "/insert" + fileNm ));
})

const broadcast = (clients, message, type) => {

	var r = {
		type : type
		, data : message
	}

	if( clients )
	{
		clients.forEach((client) => {

			if (client.readyState === WebSocket.OPEN) {
	
				client.send( JSON.stringify( r ) );
			}
		});
	}
};

router.get("/dog", (req, res) => {
	debugger;
    broadcast(req.app.locals.clients, "Bark!");

    return res.sendStatus(200);
});

/*
        {
        "id": "54009488",
        "source" : "",
        "info": {
            "링크": "http://row.oneblockdown.it/products/169840cprcmor",
            "면세 범위": "- 한국 직배송 $150\n- 미국 배대지 $200",
            "배송 정보": "- 한국 직배송 €40.00\n- 미국 배대지 €35,00"
        },
        "detail": [
            "<p>&nbsp;</p>",
            "<p>&nbsp;</p>",
            "<p><img alt=\"B49315F0-ED45-478F-B21C-C32F70C23CA1.jpeg\" src=\"https://img.eomisae.co.kr/files/attach/images/153029/488/009/054/8a44ed2b30b40cdc2627007884b0d508.jpeg\" rel=\"xe_gallery\"></p>",
        ],
        "thmbnail": "https://img.eomisae.co.kr/files/thumbnails/488/009/054/190x190.crop.jpg?20210107174908",
        "title": "해외 원 블럭 다운 (One Block Down) 무관세 소량 채굴 펑첸왕, 호카 등",
        "date": "20210107"
    },
*/
var pad = function(n, width){
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
var resultJsonToHtml__insert = function( targetDate, fileNm ){
	console.log( "[S] - window.FNS.resultJsonToHtml" )
		//targetDate = targetDate || window.UTIL.DateFormat.YYYYMMDD();
	var targetFilePath = targetFilePath || "../crawler_sale_data/detail/json/" + targetDate + "/" + fileNm + ".json";
	var resultDirPath = resultDirPath || "./html/";

	var _to = JSON.parse( fs.readFileSync( targetFilePath ).toString() );
	var _taKeys = Object.keys( _to ).sort().reverse();
	var r = `
	`;
	var i=0,iLen= _taKeys.length,io,zo;
	for(;i<iLen;++i){
		io = _taKeys[ i ];
		zo = _to[ io ];
		console.log( zo.id );
		var id = zo.id;
		var thmbnail = zo.thmbnail;
		var description = ""
		var title = zo.title;
		var date = zo.date;
		var href = "#";
		var s,so;
		for( s in zo.info ){
			so = zo.info[ s ];
			if( s == "링크" ) href = so;
			else
			{
				description += s + " : " + so + "<br>"
			}
		}
		//r += "<td>내용</td><td>" + io.detail.join("\n").replace( /rel\=\"xe_gallery\"/gi, "width='200'" ) + "</td>"
		//${description}
		r += `
		<div class="card" id=${id}>
			<div class="image">
			<img src="${thmbnail}">
			</div>
			<div class="content">
			<div class="header">${title}</div>
			<div class="meta">
				<a>${date}</a>
			</div>

			<div class="description" style="font-size:11px;word-break: break-all;">
				
			</div>
			</div>
			<div class="extra content">
				<!--span class="right floated">
					Right-someText
				</span-->
				<a href="${href}" target="_blank"><button class="fluid ui mini button">해당사이트이동</button></a>
				<!--span>
					<i class="user icon"></i>
					Left-someText
				</span-->
			</div>
		</div>
		`

	}

	r += `
	`
	debugger;
	fs.mkdirSync( resultDirPath, { recursive: true } );
	fs.writeFileSync( resultDirPath + fileNm + ".html", r, {flag : "w"} )	
	console.log( "[E] - window.FNS.resultJsonToHtml" )
}


router.post('/insertData', function(req, res){
	debugger;
	console.log(req.body);  
	
	var flineNm = req.body.date + "_" + req.body.source;
	
	var _targetFilePath = "../crawler_sale_data/detail/json/" + req.body.date + "/" + flineNm + ".json"
	var isExist = fs.existsSync( _targetFilePath );
	if( isExist )
	{
		var _txt = fs.readFileSync( _targetFilePath ).toString()
		var _to = JSON.parse( _txt );
	}
	else
	{
		var _to = {};
	}
	
	var id = flineNm + "_" + pad( Object.keys( _to ).length,2);

	var o = {
		id : id
		, source : req.body.source
		, info : {
			"링크" : req.body.link
		}
		, detail : []
		, thmbnail : req.body.imgUrl
        , title : req.body.title
        , date : req.body.date
	}
	_to[ id ] = o;
	/*/
	fs.writeFileSync( baseDir,JSON.stringify( _to, null, 4), {flag:"w"} );
	
	resultJsonToHtml( req.body.date )
	res.send(req.body);
	/*/
	fs.writeFileSync( _targetFilePath,JSON.stringify( _to, null, 4), {flag:"w"} );
	
	resultJsonToHtml__insert( req.body.date, flineNm )

	var id = o.id;
	var thmbnail = o.thmbnail;
	var description = ""
	var title = o.title;
	var date = o.date;
	var href = "#";
	var s,so;
	for( s in o.info ){
		so = o.info[ s ];
		if( s == "링크" ) href = so;
		else
		{
			description += s + " : " + so + "<br>"
		}
	}
	
	var r = `
	<div class="card" id=${id}>
		<div class="image">
		<img src="${thmbnail}">
		</div>
		<div class="content">
		<div class="header">${title}</div>
		<div class="meta">
			<a>${date}</a>
		</div>

		<div class="description" style="font-size:11px;word-break: break-all;">
			
		</div>
		</div>
		<div class="extra content">
			<!--span class="right floated">
				Right-someText
			</span-->
			<a href="${href}" target="_blank"><button class="fluid ui mini button">해당사이트이동</button></a>
			<!--span>
				<i class="user icon"></i>
				Left-someText
			</span-->
		</div>
	</div>
	`
	broadcast(req.app.locals.clients, r, "render" );
	res.send(req.body);
	
	//*/
})


module.exports = router;