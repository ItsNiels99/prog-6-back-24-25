import express from "express";
import Song from "../models/Song.js";

// hier schrijf je de regels die gelden voor alles wat met songs te maken heeft

const router = express.Router();

router.options('/', (req, res) => {
    res.header('Allow', 'GET, POST, OPTIONS');
    res.status(204).send('');
});

router.get('/', async (req, res) => {
    const songs = await Song.find();
    res.json({items: songs});
});


// check id of song
router.get('/:id', async (req, res) => {
    try{
        const song = await Song.findOne({_id: req.params.id});
        res.json(song);
    } catch (e) {
        console.log(e);
        res.json({error: e.message});
    }
});

export default router;