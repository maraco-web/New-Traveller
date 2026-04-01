'use client';

import { useState } from 'react';
import {
  collection,
  addDoc,
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
import { Expense, BudgetSummary, ExpenseCategory } from '@/types';
import { convertToTWD } from '@/lib/utils';
import { format } from 'date-fns';

export function useBudget(tripId: string) {
  const { user } = useAuthStore();
  const { expenses, setExpenses, currentTrip } = useTripStore();
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    if (!user || !tripId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'users', user.uid, 'trips', tripId, 'expenses'),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        date: d.data().date?.toDate?.()?.toISOString() || d.data().date,
        createdAt: d.data().createdAt?.toDate?.()?.toISOString() || d.data().createdAt,
      })) as Expense[];
      setExpenses(data);
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id' | 'tripId' | 'amountInBase' | 'createdAt'>) => {
    if (!user) throw new Error('Not authenticated');
    const amountInBase = convertToTWD(expenseData.amount, expenseData.currency);
    const docRef = await addDoc(
      collection(db, 'users', user.uid, 'trips', tripId, 'expenses'),
      {
        ...expenseData,
        tripId,
        amountInBase,
        createdAt: serverTimestamp(),
      }
    );
    const newExpense: Expense = {
      ...expenseData,
      id: docRef.id,
      tripId,
      amountInBase,
      createdAt: new Date().toISOString(),
    };
    setExpenses([newExpense, ...expenses]);
    return newExpense;
  };

  const removeExpense = async (id: string) => {
    if (!user) throw new Error('Not authenticated');
    await deleteDoc(doc(db, 'users', user.uid, 'trips', tripId, 'expenses', id));
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const getBudgetSummary = (): BudgetSummary => {
    const currency = currentTrip?.currency || 'TWD';
    const totalBudget = currentTrip?.totalBudget || 0;
    const totalSpent = expenses.reduce((sum, e) => sum + e.amountInBase, 0);

    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amountInBase;
    });

    const byCategory = Object.entries(categoryTotals).map(([category, amount]) => ({
      category: category as ExpenseCategory,
      amount,
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    }));

    const dayTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      const day = format(new Date(e.date), 'MM/dd');
      dayTotals[day] = (dayTotals[day] || 0) + e.amountInBase;
    });

    const byDay = Object.entries(dayTotals)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
      currency,
      byCategory,
      byDay,
    };
  };

  return { expenses, loading, fetchExpenses, addExpense, removeExpense, getBudgetSummary };
}
