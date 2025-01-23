import express from "express";
import Song from "../models/Song.js";
import {fakerEN as faker} from "@faker-js/faker";
import mongoose from "mongoose";

// hier schrijf je de regels die gelden voor alles wat met songs te maken heeft

const router = express.Router();

router.options('/', (req, res) => {
    res.header('Allow', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.status(204).send('');
});
router.options('/:id', (req, res) => {
    res.header('Allow', 'GET, PUT, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS, DELETE');
    res.status(204).send('');
});

router.get('/', async (req, res) => {
    let limit;
    let page;
    let previousPage;
    let pages;

    const songGetter = await Song.find();
    const keyCount = Object.keys(songGetter).length;

    if (req.query.page && req.query.limit) {
        limit = parseInt(req.query.limit) || keyCount;
        page = parseInt(req.query.page) || 1;
        previousPage = req.query.page - 1;
    } else {
        limit = keyCount;
        page = 1;
        previousPage = 1;
    }

    const skip = (page - 1) * limit;

    if (limit !== 0) {
        pages = Math.ceil(keyCount / limit);
    } else {
        pages = 1;
    }

    const songs = await Song.find().limit(limit).skip(skip);


    res.json({
        items: songs,
        _links:
            {
                self: {
                    href: `http://145.24.222.199:8001/songs`,
                },
                collection: {
                    href: `http://145.24.222.199:8001/songs`
                }
            },
        pagination: {
            currentPage: page,
            currentItems: limit,
            totalPages: pages,
            totalItems: keyCount,
            _links: {
                first: {
                    "page": 1,
                    "href": `http://145.24.222.199:8001/?page=1&limit=${limit}`
                },
                last: {
                    "page": pages,
                    "href": `http://145.24.222.199:8001/songs/?page=${pages}&limit=${limit}`
                },
                previous: req.query.page > 1 ? {
                    page: req.query.page - 1,
                    href: `http://145.24.222.199:8001/songs/?page=${previousPage}&limit=${limit}`
                } : null,
                next: req.query.page < pages ? {
                    "page": page + 1,
                    "href": `http://145.24.222.199:8001/songs/?page=${page + 1}&limit=${limit}`
                } : null
            }
        }
    });
});


// Seed the database with 10 songs
router.post('/seed', async (req, res) => {
    // Seed the database with 10 songs
    try {
        {/*await Song.deleteMany({});*/
        }
        for (let i = 0; i < 10; i++) {
            await Song.create({
                title: faker.music.songName(),
                artist: faker.music.artist(),
                album: faker.music.album()
            });
        }
        res.json({message: 'Database seeded'});
    } catch (e) {
        res.json({error: e.message});
    }
});
router.post('/post', async (req, res) => {
    // Seed the database with 10 songs
    try {
        {/*await Song.deleteMany({});*/
        }
        for (let i = 0; i < 10; i++) {
            await Song.create({
                title: faker.music.songName(),
                artist: faker.music.artist(),
                album: faker.music.album()
            });
        }
        res.json({message: 'Database seeded'});
    } catch (e) {
        res.json({error: e.message});
    }
});
// post to make a new song!
router.post('/', async (req, res) => {
    try {
        const {title, artist, album, genre, bpm} = req.body;
        const newSong = new Song({title, artist, album, genre, bpm});
        await newSong.save();
        res.status(201).json(newSong);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});


// check title of song
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findOne({ _id: req.params.id });
        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.json(song);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const {title, artist, album, genre, bpm} = req.body;
        const updatedSong = await Song.findByIdAndUpdate(
            req.params.id,
            {title, artist, album, genre, bpm},
            {new: true, runValidators: true}
        );
        if (!updatedSong) {
            return res.status(404).json({error: 'Song not found'});
        }
        res.json(updatedSong);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const deletedSong = await Song.findByIdAndDelete(req.params.id);
        if (!deletedSong) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(204).send('Succesfully deleted');
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the song' });
    }
});

export default router;