const { body } = require('express-validator');
const favoriteCTRL = require('../controllers/favoriteCTRL.js');
const usersCTRL = require('../controllers/usersCTRL.js');
const requestHandler = require('../handlers/requestHandler.js');
const tokenMiddleware = require('../middlewares/tokenMiddleware.js');
const User = require('../models/user.js');

const router = require('express').Router();

router.post(
    '/register',
    body('name').exists().withMessage('Full Name is required'),
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email not valid')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) throw new Error('User already exists');
        }),
    body('password')
        .exists()
        .withMessage('Password is required')
        .isLength({ min: 0 })
        .withMessage('Password minimun 8 characters'),
    body('confirmPassword')
        .exists()
        .withMessage('Confirm Password is required')
        .isLength({ min: 0 })
        .withMessage('Password minimun 8 characters')
        .custom((value, { req }) => {
            if (value !== req.body.password)
                throw new Error("Passwords don't match");
            return true;
        }),
    requestHandler.validate,
    usersCTRL.register
);

router.post(
    '/login',
    body('email')
        .exists()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email not valid'),
    body('password')
        .exists()
        .withMessage('Password is required')
        .isLength({ min: 0 })
        .withMessage('Password minimun 8 characters'),
    requestHandler.validate,
    usersCTRL.login
);

router.put(
    '/updated',
    tokenMiddleware.auth,
    body('name').exists().withMessage('Full Name is required'),
    body('email')
        .exists()
        .withMessage('Password is required')
        .isEmail()
        .withMessage('Email not valid')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) Promise.reject('User already exists');
        }),
    requestHandler.validate,
    usersCTRL.updatePassword
);

router.put(
    '/update-password',
    tokenMiddleware.auth,
    body('password')
        .exists()
        .withMessage('Password is required')
        .isLength({ min: 0 })
        .withMessage('Username minimun 8 characters'),
    body('newPassword')
        .exists()
        .withMessage('New Password is required')
        .isLength({ min: 0 })
        .withMessage('New Password minimun 8 characters'),
    body('confirmNewPassword')
        .exists()
        .withMessage('Confirm New Password is required')
        .isLength({ min: 0 })
        .withMessage('Confirm new Password minimun 8 characters')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword)
                throw new Error("Passwords don't match");
            return true;
        }),
    requestHandler.validate,
    usersCTRL.updatePassword
);

router.get('/info', tokenMiddleware.auth, usersCTRL.getinfo);

router.delete('/:id', tokenMiddleware.auth, usersCTRL.remove);

router.post('/favorites', tokenMiddleware.auth, favoriteCTRL.addFavorite);

router.get('/favorites', tokenMiddleware.auth, favoriteCTRL.getFavoritesUser);

router.delete(
    '/favorites/:favoriteId',
    tokenMiddleware.auth,
    favoriteCTRL.removeFavorite
);

module.exports = router;
