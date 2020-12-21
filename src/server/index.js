const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const os = require('os');
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

const PASSWORD = 'DoQuyen123*';
app.post('/api/encrypt', upload.single('file'), (req, res) => {
    console.log(req);
    console.log(req.file); // req.file.originalname
    console.log(JSON.stringify(req.body));
    const fileName = req.file.path.split("\\")[1];
    const filePath = STORAGE_PATH + '/' + fileName;

    const instance = new Cryptify(filePath, PASSWORD); // depends on OS


    setTimeout(() => {
        instance
            .encrypt()
            .catch(e => console.error(e));
        console.log(`${filePath} encrypted`);
    }, 5000);

    return res.json({
        isSuccessful: true,
        fileName: fileName,
    })
});

app.post('/api/encrypt-mock', upload.single('avatar'), (req, res) => {
    const filePath = './file/Ideapad-1.jpg';
    const password = 'DoQuyen123*';

    const instance = new Cryptify(filePath, PASSWORD);
    instance
        .encrypt()
        .catch(e => console.error(e));
    return res.json({
        isSuccessful: true,
    })
});

app.post('/api/decrypt', upload.single('avatar'), (req, res) => {
    const filePath = STORAGE_PATH + '/' + req.body.filename;
    const password = req.body.password;

    const instance = new Cryptify(filePath, password);
    instance
        .decrypt()
        .catch(e => console.error(e));
// E:\Documents\GitHub\NUS IT\simple-react-full-stack\src\server\index.js
    console.log(req.body.filename);
    res.sendFile(req.body.filename, { 'root': STORAGE_PATH });
});
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
