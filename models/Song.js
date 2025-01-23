import mongoose from "mongoose";

//Schema voor Songs: data invoer voor 1 song
const songSchema = new mongoose.Schema({

    title: { type: String, required: true  },
    artist: { type: String, required: true },
    album: { type: String, required: true  },
    genre: { type: String },
    bpm: { type: Number },
}, {
        toJSON: {
            transform: (doc, ret) => {
                ret._links = {
                    self: {
                        href: `http://145.24.222.199:8001/songs/${ret._id}`
                    },
                    collection: {
                        href: `http://145.24.222.199:8001/songs`
                    }
                }
                delete ret._id
            }
        }
    }
);

const Song = mongoose.model('Song', songSchema);
export default Song;