var express = require('express');
var app = express();
var path = require('path');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index', { title: 'Sound Deck' });
});


var port = process.env.PORT || 3000;
app.listen(port);


module.exports = app;
