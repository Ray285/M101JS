var express = require('express'),
    app = express(),//create an instance of the app
    templateEngine = require('consolidate')//templating engine, provides a set of wrappers for a number of template libraries
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    bodyParser = require('body-parser');

app.engine('html', templateEngine.nunjucks);//register swig with express
app.set('view engine', 'html');//set views type
app.set('views', __dirname + "/views");//tell express where to look for the templates
app.use(bodyParser.urlencoded({ extended: true })); //module for accessing request body

var mongoclient = new MongoClient(new Server('localhost', 27017, {'native_parser': true}));//setting up MongoDB connection information

var db = mongoclient.db('test');//sets db to the db named test

//Handler for internal server errors
function errorHandler ( err, req, res, next) {
    console.error(err.message);//print message
    console.error(err.stack);//print stack trace
    res.status(500);//Internal server error response code
    res.render('error_template', {error: err});
}

app.use(errorHandler);

//Express Routes

// app.get('/:firstName', function (req, res, next) {
//     var firstName = req.params.firstName;//URL parameter
//     console.log('First Name passed: ', firstName);//
//     var middleName = req.query.middleName;//query parameter 1
//     var lastName = req.query.lastName;//... 2
//     res.render('hello', {firstName: firstName, middleName: middleName, lastName: lastName});
// });

app.get('/', function (req, res) {//handle request
    res.render('fruitPicker', {'fruits': ['apple', 'orange', 'banana', 'peach']});
    // db.collection('hello_mongo_express').findOne({}, function (err, doc) {
    //     res.render('hello', doc);//pass the object to the hello view and render the result
    // });
    //res.render('hello', {'name': 'Swig'});//render the view "hello" and pass in the object with a key "name" for the template
});

app.post('/favorite_fruit', function (req, res, next) {
    var fruit = req.body.fruit;
    if (typeof fruit == 'undefined') {
        next(Error('Please choose a fruit!'));//Error() gives a stack trace
    } else {
        res.send("Your favorite fruit is the "+ fruit);
    }
});

app.get('*', function (req, res) {
    res.status(404).send("Page not found");
});

mongoclient.open(function (err, mongoclient) {
    if (err) throw err;

    var server = app.listen(9000, function () {
            var port = server.address().port;
            console.log("Server started on port %s", port);
    });//start listening once the connection to the database is established

});
