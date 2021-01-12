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
	res.sendFile(path.join(__dirname + "/insert" + fileNm ));
})

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

var resultJsonToHtml = function( targetDate ){
	console.log( "[S] - window.FNS.resultJsonToHtml" )
		//targetDate = targetDate || window.UTIL.DateFormat.YYYYMMDD();
	var targetFilePath = targetFilePath || "../crawler_sale_data/detail/json/" + targetDate + "/" + targetDate + ".json";
	var resultDirPath = resultDirPath || "./html/";

	var _ta = JSON.parse( fs.readFileSync( targetFilePath ).toString() ).reverse();

	var r = `
	`;
	var i = 0,iLen =_ta.length,io;
	for(;i<iLen;++i){
		io = _ta[ i ];
		console.log( io.id );
		var thmbnail = io.thmbnail;
		var description = ""
		var title = io.title;
		var date = io.date;
		var href = "#";
		var s,so;
		for( s in io.info ){
			so = io.info[ s ];
			if( s == "링크" ) href = so;
			else
			{
				description += s + " : " + so + "<br>"
			}
		}
		//r += "<td>내용</td><td>" + io.detail.join("\n").replace( /rel\=\"xe_gallery\"/gi, "width='200'" ) + "</td>"
		//${description}
		r += `
		<div class="card">
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

	fs.mkdirSync( resultDirPath, { recursive: true } );
	fs.writeFileSync( resultDirPath + targetDate + ".html", r, {flag : "w"} )
	console.log( "[E] - window.FNS.resultJsonToHtml" )
}


router.post('/insertData', function(req, res){
	debugger;
	console.log(req.body);  
	
	var baseDir = "../crawler_sale_data/detail/json/" + req.body.date + "/" + req.body.date + ".json"
	var _txt = fs.readFileSync( baseDir ).toString()
	var _to = JSON.parse( _txt );

	var o = {
		_id : req.body.date + "_" + req.body.source
		, source : req.body.source
		, info : {
			"링크" : req.body.link
		}
		, detail : []
		, thmbnail : req.body.imgUrl
        , title : req.body.title
        , date : req.body.date
	}
	_to.push( o )
	fs.writeFileSync( baseDir,JSON.stringify( _to, null, 4), {flag:"w"} );
	resultJsonToHtml( req.body.date )
	res.send(req.body);
})


module.exports = router;