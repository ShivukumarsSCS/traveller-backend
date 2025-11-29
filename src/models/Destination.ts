import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  country: string;
  tagline?: string;
  image?: string;
  description?: string;
  topAttractions: string[];
}

const destinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    tagline: String,
    image: String,
    description: String,
    topAttractions: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Destination = mongoose.model<IDestination>(
  'Destination',
  destinationSchema
);
