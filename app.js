//declare modules
var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database
var PouchDB = require('pouchdb');
var db = new PouchDB('http://192.168.145.45:5984/locationlist');

var app = express();
var routes = require('./routes/index');
//var users = require('./routes/users');

//set express environment
app.engine('.html', require('ejs').__express);
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false} ));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});

//http server
var httpserver = http.createServer(app);
httpserver.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

//socket
var io = require('socket.io')(httpserver);

io.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});

    socket.on('choosegroup', function(data){
        console.log(data);
        io.emit('choosegroup', data);
    });
    // Start listening for mouse events
    socket.on('chooselocation', function (data) {
        console.log(data);
//        io.emit send message to all clients，socket.emit send message to particular client
        var numLocation = data.location-1;
        io.emit('chooselocation', data);
    });

    socket.on('confirmlocation', function(data){
        console.log('choose the location');
        console.log(data);
       io.emit('confirmlocation',data);
    });
    socket.on('notes', function(data){
        console.log(data);
        io.emit('notes', data);
    });

    socket.on('addnote', function(data){
        io.emit('addnote', data);
    });
    socket.on('addagu', function(data){
        console.log(data);
        io.emit('addagu', data);
    });
    socket.on('deletenote', function(data){
        io.emit('deletenote', data);
    });
    socket.on('deleteagu', function(data){
        console.log("deleteAgu");
        console.log(data);
        io.emit('deleteagu', data);
    });

    socket.on('vote', function(data){
        console.log(data);
        io.emit('vote', data);
    });
});

/*db.allDocs({
        include_docs: true,
        attachements: true,
        startkey: 'vote',
        endkey: 'vote\uffff'
    }).then(function(notes){
        for(var i=0; i < notes.rows.length; i++){
            db.remove(notes.rows[i].doc);
        }
    });*/