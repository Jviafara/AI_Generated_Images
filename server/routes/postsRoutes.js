const express = require('express');
const multer = require('multer');
const storage = require('../config/cloudinary.js');
const postsCTRL = require('../controllers/postsCTRL.js');
const tokenMiddleware = require('../middlewares/tokenMiddleware.js');

const router = express.Router();

var upload = multer({ storage });

router.get('/', postsCTRL.postsList);

router.post(
    '/create',
    tokenMiddleware.auth,
    upload.single('image'),
    postsCTRL.create
);

router.delete('/:id', tokenMiddleware.auth, postsCTRL.remove);

module.exports = router;
