import mongoose from 'mongoose';

export interface Movie {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  releaseDate: Date;
  genre: string;
}

export interface Genre {
  _id: mongoose.Types.ObjectId;
  name: string;
}
