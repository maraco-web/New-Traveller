'use client';

import { create } from 'zustand';
import { FriendProfile, FriendRequest, FriendActivity } from '@/types';

interface FriendState {
  friends: FriendProfile[];
  pendingRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  activities: FriendActivity[];
  searchResults: FriendProfile[];
  pendingCount: number;

  setFriends: (friends: FriendProfile[]) => void;
  setPendingRequests: (requests: FriendRequest[]) => void;
  setSentRequests: (requests: FriendRequest[]) => void;
  setActivities: (activities: FriendActivity[]) => void;
  setSearchResults: (results: FriendProfile[]) => void;

  addFriend: (friend: FriendProfile) => void;
  removeFriend: (uid: string) => void;
  acceptRequest: (requestId: string, friend: FriendProfile) => void;
  rejectRequest: (requestId: string) => void;
  cancelSentRequest: (requestId: string) => void;
  sendRequest: (request: FriendRequest) => void;
  toggleLike: (activityId: string, userId: string) => void;
}

export const useFriendStore = create<FriendState>((set) => ({
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  activities: [],
  searchResults: [],
  pendingCount: 0,

  setFriends: (friends) => set({ friends }),
  setPendingRequests: (requests) =>
    set({ pendingRequests: requests, pendingCount: requests.length }),
  setSentRequests: (requests) => set({ sentRequests: requests }),
  setActivities: (activities) => set({ activities }),
  setSearchResults: (results) => set({ searchResults: results }),

  addFriend: (friend) =>
    set((state) => ({ friends: [...state.friends, friend] })),

  removeFriend: (uid) =>
    set((state) => ({
      friends: state.friends.filter((f) => f.uid !== uid),
    })),

  acceptRequest: (requestId, friend) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== requestId),
      pendingCount: Math.max(0, state.pendingCount - 1),
      friends: [...state.friends, friend],
    })),

  rejectRequest: (requestId) =>
    set((state) => ({
      pendingRequests: state.pendingRequests.filter((r) => r.id !== requestId),
      pendingCount: Math.max(0, state.pendingCount - 1),
    })),

  cancelSentRequest: (requestId) =>
    set((state) => ({
      sentRequests: state.sentRequests.filter((r) => r.id !== requestId),
    })),

  sendRequest: (request) =>
    set((state) => ({ sentRequests: [...state.sentRequests, request] })),

  toggleLike: (activityId, userId) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === activityId
          ? {
              ...a,
              likedBy: a.likedBy.includes(userId)
                ? a.likedBy.filter((id) => id !== userId)
                : [...a.likedBy, userId],
            }
          : a
      ),
    })),
}));
