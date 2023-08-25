const jsonwebtoken = require('jsonwebtoken');
const { unauthorized, notFound } = require('../handlers/responseHandler.js');
const userModel = require('../models/user.js');

const tokenDecode = (req) => {
    try {
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader) {
            const token = bearerHeader.split(' ')[1];
            return jsonwebtoken.verify(token, process.env.TOKEN_SECRET);
        }
        return false;
    } catch {
        return false;
    }
};

const auth = async (req, res, next) => {
    const tokenDecoded = tokenDecode(req);

    if (!tokenDecoded) return unauthorized(res);

    const user = await userModel.findById(tokenDecoded.data);

    if (!user) return notFound(res);

    req.user = user;

    next();
};

module.exports = { auth, tokenDecode };
