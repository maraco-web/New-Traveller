'use client';

import { useState, useEffect } from 'react';
import { useFriendStore } from '@/store/friendStore';
import {
  MOCK_FRIENDS,
  MOCK_PENDING_REQUESTS,
  MOCK_SENT_REQUESTS,
  MOCK_FRIEND_ACTIVITIES,
  MOCK_SEARCHABLE_USERS,
} from '@/data/mockFriends';
import { FriendProfile, FriendRequest } from '@/types';

export function useFriends() {
  const [loading, setLoading] = useState(false);
  const {
    friends,
    pendingRequests,
    sentRequests,
    activities,
    searchResults,
    pendingCount,
    setFriends,
    setPendingRequests,
    setSentRequests,
    setActivities,
    setSearchResults,
    acceptRequest,
    rejectRequest,
    cancelSentRequest,
    sendRequest,
    removeFriend,
    toggleLike,
  } = useFriendStore();

  // Load mock data on mount
  useEffect(() => {
    if (friends.length === 0) {
      setFriends(MOCK_FRIENDS);
      setPendingRequests(MOCK_PENDING_REQUESTS);
      setSentRequests(MOCK_SENT_REQUESTS);
      setActivities(MOCK_FRIEND_ACTIVITIES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchUsers = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const lower = query.toLowerCase();
    const results = MOCK_SEARCHABLE_USERS.filter(
      (u) =>
        u.displayName.toLowerCase().includes(lower) ||
        u.email.toLowerCase().includes(lower)
    );
    setSearchResults(results);
  };

  const handleAcceptRequest = async (requestId: string) => {
    setLoading(true);
    try {
      const request = pendingRequests.find((r) => r.id === requestId);
      if (!request) return;
      const newFriend: FriendProfile = {
        uid: request.fromUid,
        displayName: request.fromDisplayName,
        photoURL: request.fromPhotoURL,
        email: request.fromEmail,
        tripCount: 0,
        countriesCount: 0,
        isOnline: false,
        friendSince: new Date().toISOString().split('T')[0],
      };
      acceptRequest(requestId, newFriend);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    rejectRequest(requestId);
  };

  const handleCancelRequest = async (requestId: string) => {
    cancelSentRequest(requestId);
  };

  const handleSendRequest = async (user: FriendProfile) => {
    const newRequest: FriendRequest = {
      id: `req-${Date.now()}`,
      fromUid: 'current-user',
      fromDisplayName: '我',
      fromEmail: 'me@example.com',
      toUid: user.uid,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    sendRequest(newRequest);
    // Remove from search results to reflect the sent state
    setSearchResults(searchResults.filter((u) => u.uid !== user.uid));
  };

  const handleRemoveFriend = async (uid: string) => {
    removeFriend(uid);
  };

  const handleToggleLike = (activityId: string) => {
    toggleLike(activityId, 'current-user');
  };

  const isFriend = (uid: string) => friends.some((f) => f.uid === uid);
  const hasSentRequest = (uid: string) =>
    sentRequests.some((r) => r.toUid === uid && r.status === 'pending');

  return {
    friends,
    pendingRequests,
    sentRequests,
    activities,
    searchResults,
    pendingCount,
    loading,
    searchUsers,
    acceptRequest: handleAcceptRequest,
    rejectRequest: handleRejectRequest,
    cancelRequest: handleCancelRequest,
    sendRequest: handleSendRequest,
    removeFriend: handleRemoveFriend,
    toggleLike: handleToggleLike,
    isFriend,
    hasSentRequest,
  };
}
