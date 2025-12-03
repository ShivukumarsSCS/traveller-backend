// src/models/Itinerary.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity {
  time: string;      // "09:00"
  title: string;     // activity title
}

export interface IDayPlan {
  date: string;        // "YYYY-MM-DD"
  activities: IActivity[];
}

// 👇 extra type for hotel stored in itinerary
export interface ISelectedHotel {
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  priceLevel?: string;
  priceFrom?: number;
  priceTo?: number;
  currency?: string;
}

export interface IItinerary extends Document {
  user: mongoose.Types.ObjectId;
  destination: mongoose.Types.ObjectId;
  title: string;
  startDate: string;     // "YYYY-MM-DD"
  endDate: string;
  days: IDayPlan[];

  // optional selected hotel for this trip
  selectedHotelIndex?: number | null;
  selectedHotel?: ISelectedHotel | null;
}

const activitySchema = new Schema<IActivity>(
  {
    time: String,
    title: String,
  },
  { _id: false }
);

const dayPlanSchema = new Schema<IDayPlan>(
  {
    date: { type: String, required: true },
    activities: { type: [activitySchema], default: [] },
  },
  { _id: false }
);

// 👇 small subdocument for hotel
const selectedHotelSchema = new Schema<ISelectedHotel>(
  {
    name: { type: String, required: true },
    address: String,
    latitude: Number,
    longitude: Number,
    priceLevel: String,
    priceFrom: Number,
    priceTo: Number,
    currency: String,
  },
  { _id: false }
);

const itinerarySchema = new Schema<IItinerary>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: {
      type: Schema.Types.ObjectId,
      ref: 'Destination',
      required: true,
    },
    title: { type: String, required: true },

    // dates as string to avoid timezone issues
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },

    // itinerary days
    days: { type: [dayPlanSchema], default: [] },

    // 👇 optional hotel info
    selectedHotelIndex: { type: Number, default: null },
    selectedHotel: { type: selectedHotelSchema, default: null },
  },
  { timestamps: true }
);

export const Itinerary = mongoose.model<IItinerary>(
  'Itinerary',
  itinerarySchema
);
