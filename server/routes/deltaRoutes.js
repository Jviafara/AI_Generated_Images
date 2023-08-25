const router = require('express').Router();
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

router.route('/').get((req, res) => res.send('hello from Delta'));

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;
        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });
        const image = aiResponse.data.data[0].b64_json;
        res.status(200).json({ image });
    } catch (error) {
        console.log(error);
        res.status(500).send(error?.response.data.err.message);
    }
});

module.exports = router;
