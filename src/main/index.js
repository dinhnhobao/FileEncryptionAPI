const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const Cryptify = require('cryptify');
const app = express();
const fs = require('fs');

const utils = require('./utils');

const STORAGE_PATH = './file';

app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, STORAGE_PATH);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
});

app.get('/', upload.none(), (req, res) => {
    res.redirect('/api/test');
});

app.get('/api/test', upload.none(), (req, res) => {
    return res.json({
        isWorking: true,
    });
});

const deleteFile = (filePath) => {
    fs.unlinkSync(filePath);

    try {
        // remove tmp files
        if (fs.existsSync(filePath + '.tmp')) {
            fs.unlinkSync(filePath + '.tmp');
        }
    } catch (err) {
        console.log('No .tmp file to delete');
    }
};

app.post('/api/encrypt', upload.single('file'), (req, res) => {
    const fileName = req.file.path.split('/')[1];
    const filePath = STORAGE_PATH + '/' + fileName;

    const apiKey = req.headers.authorization;
    if (!utils.isAuthorised(apiKey)) {
        deleteFile(filePath);
        return res.status(401).json({
            message: 'Wrong API access key. Please contact your adminstrator.',
        });
    }

    const password = req.body.password;
    if (!utils.isPasswordValid(password)) {
        deleteFile(filePath);
        return res.status(400).json({
            message: 'Your password is invalid. Please try again.',
        });
    }

    const instance = new Cryptify(filePath,
        utils.parsePassword(password)); // depends on OS

    instance
        .encrypt()
        .then(() => {
            console.log('File sending');
            res.sendFile(fileName, {
                root: STORAGE_PATH,
            }, (err) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
                deleteFile(filePath);
            });
        })
        .catch((err) => {
            console.error(e);
            res.sendStatus(400);
        });
});

app.post('/api/decrypt', upload.single('file'), (req, res) => {
    const fileName = req.file.path.split('/')[1];
    const filePath = STORAGE_PATH + '/' + fileName;

    const apiKey = req.headers.authorization;
    if (!utils.isAuthorised(apiKey)) {
        deleteFile(filePath);
        return res.status(401).json({
            message: 'Wrong API access key. Please contact your adminstrator.',
        });
    }

    const password = req.body.password;
    if (!utils.isPasswordValid(password)) {
        deleteFile(filePath);
        return res.status(400).json({
            message: 'Your password is invalid. Please try again.',
        });
    }

    const instance = new Cryptify(filePath,
        utils.parsePassword(password)); // depends on OS

    instance
        .decrypt()
        .then(() => {
            res.sendFile(fileName, {
                root: STORAGE_PATH,
            }, (err) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                }
                deleteFile(filePath);
            });
        })
        .catch((e) => {
            console.log('Error found');
            console.error(e);
            deleteFile(filePath);
            return res.status(400).json({
                message: 'The password to decrypt the file is incorrect,' +
                    ' ' + 'or the file is corrupted. Please try again.',
            });
        });
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Listening on port ${process.env.PORT || 8080}!`);
});

module.exports = app;
