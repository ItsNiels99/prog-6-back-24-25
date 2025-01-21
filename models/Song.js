import mongoose from "mongoose";

//Schema voor Songs: data invoer voor 1 spot
const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    album: {
        type: String,
        required: true
    },
    bpm: {
    type: Number,
    },
});

const Song = mongoose.model('Song', songSchema);
export default Song;