import mongoose from 'mongoose';

const COLLECTION: string = 'genres';

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export const genreModel = mongoose.model(COLLECTION, genreSchema);
