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

export interface IItinerary extends Document {
  user: mongoose.Types.ObjectId;
  destination: mongoose.Types.ObjectId;
  title: string;
  startDate: string;     // "YYYY-MM-DD"
  endDate: string;
  days: IDayPlan[];
}

const activitySchema = new Schema<IActivity>(
  {
    time: String,
    title: String,
  },
  { _id: false } // prevent auto-generation of _id for every activity
);

const dayPlanSchema = new Schema<IDayPlan>(
  {
    date: { type: String, required: true },
    activities: { type: [activitySchema], default: [] },
  },
  { _id: false }
);

const itinerarySchema = new Schema<IItinerary>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    destination: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    title: { type: String, required: true },

    // store as string to avoid timezone issues
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },

    // flexible but structured days[]
    days: { type: [dayPlanSchema], default: [] },
  },
  { timestamps: true }
);

export const Itinerary = mongoose.model<IItinerary>('Itinerary', itinerarySchema);
