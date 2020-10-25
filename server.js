var express = require('express');
var bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000;

var app = express();
app.set('port', PORT);
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('build'))
app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port') + ' using nodemon.');
});