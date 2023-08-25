const router = require('express').Router();

const usersRoutes = require('./usersRoutes');
const postsRoutes = require('./postsRoutes');
const deltaRoutes = require('./deltaRoutes');

router.use('/users', usersRoutes);
router.use('/posts', postsRoutes);
router.use('/delta', deltaRoutes);

module.exports = router;
