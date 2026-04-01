'use client';

import { useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { useTripStore } from '@/store/tripStore';
import { Trip } from '@/types';

export function useTrips() {
  const { user } = useAuthStore();
  const { trips, setTrips, addTrip, updateTrip, removeTrip } = useTripStore();
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'users', user.uid, 'trips'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        startDate: d.data().startDate?.toDate?.()?.toISOString() || d.data().startDate,
        endDate: d.data().endDate?.toDate?.()?.toISOString() || d.data().endDate,
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() || d.data().createdAt,
        updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() || d.data().updatedAt,
      })) as Trip[];
      setTrips(data);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('Not authenticated');
    const docRef = await addDoc(collection(db, 'users', user.uid, 'trips'), {
      ...tripData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    const newTrip: Trip = {
      ...tripData,
      id: docRef.id,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTrip(newTrip);
    return newTrip;
  };

  const editTrip = async (id: string, data: Partial<Trip>) => {
    if (!user) throw new Error('Not authenticated');
    await updateDoc(doc(db, 'users', user.uid, 'trips', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    updateTrip(id, data);
  };

  const deleteTrip = async (id: string) => {
    if (!user) throw new Error('Not authenticated');
    await deleteDoc(doc(db, 'users', user.uid, 'trips', id));
    removeTrip(id);
  };

  return { trips, loading, fetchTrips, createTrip, editTrip, deleteTrip };
}
