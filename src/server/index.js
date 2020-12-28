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

app.get('/api/test', upload.none(), (req, res) => {
    return res.json({
        isWorking: true,
    });
});
app.post('/api/encrypt', upload.single('file'), (req, res) => {
    const accessKey = req.headers.authorization;
        
    if (!isAuthorised(accessKey)) {
        return res.status(204).json({
            message: "Wrong API access key. Please contact your adminstrator."
        })
    }

    const password = req.body.password;

    log.error('Password check', password);

    if (isPasswordEmpty(password)) {
        log.error('Password empty');
        log.error(password);

        return res.status(202).json({
            message: "Your password cannot be empty. Please choose a password."
        })
    }

    console.log(accessKey);

    console.log(req.file); // req.file.originalname

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
    setTimeout( () => {
        res.download(filePath, fileName);
    }, 2000);
});

app.post('/api/decrypt', upload.single('file'), (req, res) => {

    console.log(req.file); // req.file.originalname
    
    const fileName = req.file.path.split("/")[1];
    const filePath = STORAGE_PATH + '/' + fileName;

    const password = req.body.password;
    const instance = new Cryptify(filePath, parsePassword(password)); // depends on OS

    setTimeout(() => { instance
        .decrypt()
        .catch(e => console.error(e));
        console.log(`${filePath} decrypted`);
    }, 1000);

    setTimeout(() => {
        res.download(filePath, fileName);
    }, 3000);
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
