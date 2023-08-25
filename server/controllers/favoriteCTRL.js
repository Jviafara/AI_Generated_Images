const responseHandler = require('../handlers/responseHandler.js');
const favoriteModel = require('../models/favorite.js');

const addFavorite = async (req, res) => {
    try {
        const isFavorite = await favoriteModel.findOne({
            user: req.user.id,
            post: req.body.postId,
        });

        if (isFavorite) return responseHandler.ok(res, isFavorite);

        const favorite = new favoriteModel({
            post: req.body.postId,
            user: req.user.id,
        });

        await favorite.save();

        responseHandler.created(res, favorite);
    } catch {
        responseHandler.error(res);
    }
};

const removeFavorite = async (req, res) => {
    try {
        const { favoriteId } = req.params;
        const favorite = await favoriteModel.findOne({
            _id: favoriteId,
            user: req.user.id,
        });
        if (!favorite) return responseHandler.notFound(res);

        await favoriteModel.findByIdAndDelete(favoriteId);

        responseHandler.ok(res);
    } catch {
        responseHandler.error(res);
    }
};

const getFavoritesUser = async (req, res) => {
    try {
        const favorites = await favoriteModel
            .find({
                user: req.user.id,
            })
            .sort('-createdAt');

        responseHandler.ok(res, favorites);
    } catch {
        responseHandler.error(res);
    }
};

module.exports = { addFavorite, removeFavorite, getFavoritesUser };
