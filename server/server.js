const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const fs = require('fs');
const Clarifai = require("clarifai");

// instantiate a new Clarifai app passing in your api key.
const clarifaiApp = new Clarifai.App({
    apiKey: "6182d998e9d54bc3aaa8a9f08c727c2f"
});

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/', express.static(__dirname + '/public'));

app.post('/upload', (req, res, next) => {
    console.log(req.files.file);
    let imageFile = req.files.file;
    let fullFileName = `${__dirname}/public/${req.files.file.name}`

    imageFile.mv(fullFileName, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        clarifaiApp.models
            .initModel({
                id: Clarifai.GENERAL_MODEL,
                version: "aa7f35c01e0642fda5cf400f543e7c40"
            })
            .then(generalModel => {
                return generalModel.predict(
                    base64_encode(fullFileName)
                );
            })
            .then(response => {
                var concepts = response["outputs"][0]["data"]["concepts"];
                var clean = concepts.map(e => {
                    return {
                        name: e.name,
                        confidence: e.value * 100 + "%"
                    };
                });
                res.json({
                    file: `${req.files.file.name}`,
                    evaluation: clean
                });
            });
    });
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

app.listen(8000, () => {
    console.log('8000');
});

module.exports = app;