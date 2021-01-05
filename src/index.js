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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, STORAGE_PATH)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

var upload = multer({ storage: storage });

app.get('/', upload.none(), (req, res) => {
    res.redirect('/api/test');
});

app.get('/api/test', upload.none(), (req, res) => {
    return res.json({
        isWorking: true,
    });
});

const isAuthorised = (apiKey) => {
    return apiKey === 'eb53a0d3-8fb2-4f25-bb89-a4dfb7a64fc6';
}

const isPasswordValid = (password) => {
    return password.length > 0;
}

const parsePassword = (password) => {
    const INITIALS = '*+-/aA11';
    return INITIALS + password;
}

const PASSWORD = 'DoQuyen123*';

app.post('/api/encrypt', upload.single('file'), (req, res) => {
    const apiKey = req.headers.authorization;
    if (!isAuthorised(apiKey)) {
        return res.status(401).json({
            message: "Wrong API access key. Please contact your adminstrator."
        });
    }

    const password = req.body.password;
    if (!isPasswordValid(password)) {
        return res.status(400).json({
            message: "Your password is invalid. Please try again."
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
    }, 5000);

    setTimeout(() => {
        console.log("File sending")
        res.sendFile(fileName, { root: STORAGE_PATH });
    }, 10000);
});

app.post('/api/decrypt', upload.single('file'), (req, res) => {
    const apiKey = req.headers.authorization;
    if (!isAuthorised(apiKey)) {
        return res.status(401).json({
            message: "Wrong API access key. Please contact your adminstrator."
        });
    }

    const password = req.body.password;
    if (!isPasswordValid(password)) {
        return res.status(400).json({
            message: "Your password is invalid. Please try again."
        });
    }

    const fileName = req.file.path.split("/")[1];
    const filePath = STORAGE_PATH + '/' + fileName;

    const instance = new Cryptify(filePath, parsePassword(password)); // depends on OS

    isSending = true;
    setTimeout(() => {
        instance
            .decrypt()
            .catch(e => {
                console.log("Error found");
                console.error(e);
                isSending = false;
            });
        console.log(`${filePath} decrypted`);
    }, 5000);

    setTimeout(() => {
    }, 10000);
        if (isSending) {
            console.log("File sending");
            res.sendFile(fileName, { root: STORAGE_PATH });
        } else {
            return res.status(400).json({
                message: "The password to decrypt the file is incorrect, or the file is corrupted. Please try again."
            });
        }
});

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
