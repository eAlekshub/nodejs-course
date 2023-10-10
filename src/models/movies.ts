import mongoose from 'mongoose';

const COLLECTION: string = 'movies';

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date, required: true },
  genre: { type: String, required: true },
});

export const movieModel = mongoose.model(COLLECTION, movieSchema);
