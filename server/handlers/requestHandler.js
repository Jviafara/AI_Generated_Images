const validator = require('express-validator');

const validate = (req, res, next) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array()[0].msg);

    next();
};

module.exports = { validate };
