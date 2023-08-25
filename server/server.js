require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const express = require('express');
const router = require('./routes/router');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/v1', router);

app.get('/', async (req, res) => {
    res.send('AI IMAGE GENERATOR');
});

const port = process.env.PORT || 8080;
const startServer = async (req, res) => {
    try {
        connectDB();
        app.listen(port, () =>
            console.log(`Server running on port: http://localhost:${port}`)
        );
    } catch (error) {
        console.log(error);
    }
};

startServer();
