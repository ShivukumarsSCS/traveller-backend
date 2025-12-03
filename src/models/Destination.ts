// src/models/Destination.ts
import { Schema, model, Document } from 'mongoose';

// Single hotel inside a destination
export interface Hotel {
  name: string;
  rating: number;              // 1–5 stars
  priceLevel?: '$' | '$$' | '$$$';
  priceFrom?: number;          // e.g. 3500
  priceTo?: number;            // e.g. 6500
  currency?: string;           // 'INR', 'USD', etc.
  address?: string;
  description?: string;
  images?: string[];           // array of image URLs
  amenities?: string[]; 
  longitude : number;
  latitude : number;       // tags like 'Pool', 'Free Wi-Fi'
}

// One place (city / destination)
export interface DestinationDocument extends Document {
  name: string;                // place name: e.g. 'Manali'
  country: string;             // e.g. 'India'
  state?: string;              // e.g. 'Himachal Pradesh'
  tagline?: string;
  image?: string;
  description?: string;
  topAttractions?: string[];
  themes?: string[];
  popularityScore: number;
  visitCount: number;
  hotels: Hotel[];
  longitude : number;
  latitude : number; 
  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema = new Schema<Hotel>(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    priceLevel: {
      type: String,
      enum: ['$', '$$', '$$$'],
    },
    priceFrom: { type: Number },
    priceTo: { type: Number },
    currency: { type: String },
    address: { type: String },
    description: { type: String },
    images: [{ type: String }],
    amenities: [{ type: String }],
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { _id: false }
);

const DestinationSchema = new Schema<DestinationDocument>(
  {
    name: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String },          // state added
    tagline: { type: String },
    image: { type: String },
    description: { type: String },
    topAttractions: [{ type: String }],
    themes: [{ type: String }],
    popularityScore: { type: Number, default: 0 },
    visitCount: { type: Number, default: 0 },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    hotels: { type: [HotelSchema], default: [] },
  },
  { timestamps: true }
);

export const Destination = model<DestinationDocument>(
  'Destination',
  DestinationSchema
);
