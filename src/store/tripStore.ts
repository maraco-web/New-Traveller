'use client';

import { create } from 'zustand';
import { Trip, TripDay, Expense } from '@/types';

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  currentDays: TripDay[];
  expenses: Expense[];
  setTrips: (trips: Trip[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  setCurrentDays: (days: TripDay[]) => void;
  setExpenses: (expenses: Expense[]) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;
  removeTrip: (id: string) => void;
}

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  currentTrip: null,
  currentDays: [],
  expenses: [],
  setTrips: (trips) => set({ trips }),
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  setCurrentDays: (days) => set({ currentDays: days }),
  setExpenses: (expenses) => set({ expenses }),
  addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
  updateTrip: (id, data) =>
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  removeTrip: (id) =>
    set((state) => ({ trips: state.trips.filter((t) => t.id !== id) })),
}));
