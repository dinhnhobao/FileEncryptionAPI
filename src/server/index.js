const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const os = require('os');
const fs = require('fs');

const Cryptify = require('cryptify');
const app = express();

const STORAGE_PATH = './file';

app.use(express.static('dist'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// sleep time expects milliseconds
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
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
    console.log(req.file); // req.file.originalname
    
    const fileName = req.file.path.split("/")[1];
    const filePath = STORAGE_PATH + '/' + fileName;
    const password = req.body.password;

    const instance = new Cryptify(filePath, password); // depends on OS

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
    const instance = new Cryptify(filePath, password); // depends on OS

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
