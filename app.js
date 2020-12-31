const express = require('express')
const path = require( 'path' )
const app = express()
const port = 3000

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/html/index.html'));
})

app.get('/20201231', (req, res) => {
	res.sendFile(path.join(__dirname + '/html/20201231.html'));
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})