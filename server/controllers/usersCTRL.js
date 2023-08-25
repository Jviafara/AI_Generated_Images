const jsonwebtoken = require('jsonwebtoken');
const {
    error,
    created,
    unauthorized,
    notFound,
    badRequest,
    ok,
} = require('../handlers/responseHandler');
const User = require('../models/user');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        //Register User
        const user = new User();

        user.name = name;
        user.email = email;
        user.setPassword(password);

        await user.save();

        // Login
        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        created(res, { token, ...user._doc, id: user.id });
    } catch {
        error(res);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select(
            'email password salt id name isAdmin'
        );

        if (!user) return badRequest(res, 'Username or Password incorrect');

        if (!user.validPassword(password))
            return badRequest(res, 'Username or Password incorrect');

        // Login
        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
        );

        user.password = undefined;
        user.salt = undefined;

        created(res, { token, ...user._doc, id: user.id });
    } catch {
        error(res);
    }
};

const updatePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;

        const user = await User.findById(req.user.id).select(
            'password id salt'
        );

        if (!user) return unauthorized(res);

        if (!user.validPassword(password))
            return badRequest(res, 'Wrong password');

        user.setPassword(newPassword);

        await user.save();

        ok(res);
    } catch {
        error(res);
    }
};

const getinfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select(
            'name email isAdmin id createdAt'
        );

        if (!user) return notFound(res);

        ok(res, user);
    } catch {
        error(res);
    }
};

const update = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findById(req.user.id).select('name email id');

        if (!user) return unauthorized(res);

        //Update User
        user.name = name;
        user.email = email;

        await user.save();

        const token = jsonwebtoken.sign(
            { data: user.id },
            process.env.TOKEN_SECRET,
            { expiresIn: '24h' }
        );
        created(res, { token, ...user._doc, id: user.id });
    } catch {
        error(res);
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(req.user.id).select(
            'name email isAdmin id createdAt'
        );

        if (!user.id === id) return unauthorized(res);

        await User.findByIdAndDelete(id);

        ok(res);
    } catch {
        error(res);
    }
};

module.exports = {
    register,
    login,
    updatePassword,
    getinfo,
    update,
    remove,
};
