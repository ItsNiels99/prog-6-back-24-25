import express from 'express';
import mongoose from 'mongoose';
import songsRouter from './routes/songs.js';

const app = express();
mongoose.connect(`mongodb://127.0.0.1:27017/${process.env.DB_NAME}`);

app.use(express.json());

// Middleware to check if request accept is application/json
app.use(express.urlencoded({extended: true}));

// Middleware to check
app.use((req, res, next) => {
    if (req.header('Accept') !== 'application/json' && req.method !== 'OPTIONS') {
        res.status(406).send('Not Acceptable');
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/songs', songsRouter);



app.listen(process.env.EXPRESS_PORT, () => {
    console.log('Server is running on port 8001');
});