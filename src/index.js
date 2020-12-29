const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const os = require('os');
const fs = require('fs');

const Cryptify = require('cryptify');
const app = express();
const getLogger = require('webpack-log');

const log = getLogger({ name: 'server-log' });

const STORAGE_PATH = './file';

app.use(express.static('dist'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const parsePassword = (password) => {
    const INITIALS = '*+-/aA11';
    return INITIALS + password;
}

const isAuthorised = (accessKey) => {
    return accessKey == 'SECRET_KEY';
}

const isPasswordEmpty = (password) => {
    return (false);
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, STORAGE_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({ storage: storage });

const PASSWORD = 'SecretPassword123*';

console.log("Outside");

app.get('/', upload.none(), (req, res) => {
    res.redirect('/api/test');
});

app.get('/api/test', upload.none(), (req, res) => {
    return res.json({
        isWorking: true,
    });
});

const MESSAGE = "message";
app.post('/api/encrypt', upload.single('file'), (req, res) => {
    const accessKey = req.headers.authorization;

    if (!isAuthorised(accessKey)) {
        res.header(MESSAGE, "401 Unauthorised");
        return res.json({
            message: "Wrong API access key. Please contact your adminstrator."
        });
    }

    const password = req.body.password;

    if (isPasswordEmpty(password)) {
        res.header(MESSAGE, "400 Bad Request");

        console.log('Password empty');
        console.log(password);

        return res.json({
            message: "Your password cannot be empty. Please choose a password."
        });
    }

    const fileName = req.file.path.split("/")[1];
    const filePath = STORAGE_PATH + '/' + fileName;
    const instance = new Cryptify(filePath, parsePassword(password)); // depends on OS

    setTimeout(() => {
        instance
            .encrypt()
            .catch(e => console.error(e));
        console.log(`${filePath} encrypted`);
    }, 1000);

    console.log("Sending");
    setTimeout(() => {
        res.download(filePath, fileName);
    }, 2000);
});

app.post('/api/decrypt', upload.single('file'), (req, res) => {
    const accessKey = req.headers.authorization;

    if (!isAuthorised(accessKey)) {
        res.header(MESSAGE, "401 Unauthorised");
        return res.status(204).json({
            message: "Wrong API access key. Please contact your adminstrator."
        })
    }

    const password = req.body.password;
    const fileName = req.file.path.split("/")[1];
    const filePath = STORAGE_PATH + '/' + fileName;

    const instance = new Cryptify(filePath, parsePassword(password)); // depends on OS

    setTimeout(() => {
        instance
            .decrypt()
            .catch(e => console.error(e));
        console.log(`${filePath} decrypted`);
    }, 1000);
    res.header(MESSAGE, "200 OK");

    setTimeout(() => {
        res.download(filePath, fileName);
    }, 3000);
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
