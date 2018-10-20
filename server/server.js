const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/', express.static(__dirname + '/public'));


app.post('/upload', (req, res, next) => {
    console.log(req);
    let imageFile = req.files.file;

    imageFile.mv(`${__dirname}/public/${req.body.filename}.jpg`, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        res.json({ file: `public/${req.body.filename}.jpg` });
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
    res.render('error');
});

app.listen(8000, () => {
    console.log('8000');
});

module.exports = app;