const responseHandler = require('../handlers/responseHandler');
const Post = require('../models/post');
const User = require('../models/user');
const Favorite = require('../models/favorite');
const cloudinary = require('cloudinary').v2;

const postsList = async (req, res) => {
    try {
        const posts = await Post.find();
        responseHandler.ok(res, posts);
    } catch {
        responseHandler.error(res);
    }
};

const create = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return responseHandler.unauthorized;

        if (!req.file) {
            return res.status(400).json({ msg: 'Image required' });
        }

        const post = await Post.create({
            user: user.id,
            image: req.file.path,
            ...req.body,
        });

        console.log(post);

        responseHandler.created(res, post);
    } catch {
        responseHandler.error(res);
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await User.findById(req.user.id);

        const favorite = await Favorite.findOne({
            user: user.id,
            post: req.params.id,
        });

        if (favorite) await Favorite.findByIdAndDelete(favorite.id);

        const post = await Post.findById(id);
        const imgId =
            'AI Generate Images/' +
            post.image.substring(
                post.image.lastIndexOf('/') + 1,
                post.image.length - 4
            );
        await cloudinary.uploader.destroy(imgId);

        await Post.findByIdAndDelete(req.params.id);

        responseHandler.ok(res);
    } catch {
        responseHandler.error(res);
    }
};

module.exports = { postsList, create, remove };
