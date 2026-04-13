'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import {
  Users,
  UserPlus,
  Search,
  Heart,
  MessageCircle,
  MapPin,
  Globe2,
  Briefcase,
  Clock,
  Check,
  X,
  UserMinus,
  Send,
  Bell,
  Plane,
  Bookmark,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFriends } from '@/hooks/useFriends';
import { MOCK_SHARED_TRIPS } from '@/data/mockFriends';
import { FriendProfile, FriendActivity } from '@/types';

type Tab = 'feed' | 'friends' | 'requests' | 'discover';

const TAB_CONFIG: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'feed', label: '動態牆', icon: Globe2 },
  { id: 'friends', label: '好友', icon: Users },
  { id: 'requests', label: '好友請求', icon: Bell },
  { id: 'discover', label: '探索好友', icon: UserPlus },
];

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  new_trip: Plane,
  completed_trip: Star,
  saved_place: Bookmark,
  joined_trip: Users,
  added_expense: Briefcase,
  new_friend: Heart,
};

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} 分鐘前`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} 小時前`;
  const days = Math.floor(hrs / 24);
  return `${days} 天前`;
}

// ─── Activity Card ────────────────────────────────────────────────────────────
function ActivityCard({
  activity,
  onLike,
}: {
  activity: FriendActivity;
  onLike: (id: string) => void;
}) {
  const liked = activity.likedBy.includes('current-user');
  const ActivityIcon = ACTIVITY_ICONS[activity.type] || Globe2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="relative">
          {activity.userPhoto ? (
            <Image
              src={activity.userPhoto}
              alt={activity.userName}
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
              {activity.userName[0]}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
            <ActivityIcon className="w-2.5 h-2.5 text-white" />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm">{activity.userName}</p>
          <p className="text-xs text-slate-500">{activity.title}</p>
        </div>
        <span className="text-xs text-slate-400 shrink-0">{timeAgo(activity.createdAt)}</span>
      </div>

      {/* Image */}
      {activity.image && (
        <div className="relative h-48 w-full">
          <Image
            src={activity.image}
            alt={activity.description}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 600px"
          />
          {activity.destination && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
              <MapPin className="w-3 h-3" />
              {activity.destination}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3">
        <p className="text-sm text-slate-700">{activity.description}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-4 pb-4 border-t border-slate-50 pt-3">
        <button
          onClick={() => onLike(activity.id)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span>{activity.likedBy.length}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-sky-500 transition-colors">
          <MessageCircle className="w-4 h-4" />
          <span>{activity.commentCount}</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors ml-auto">
          <Send className="w-4 h-4" />
          <span>分享</span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Friend Card ──────────────────────────────────────────────────────────────
function FriendCard({
  friend,
  onRemove,
}: {
  friend: FriendProfile;
  onRemove: (uid: string) => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {friend.photoURL ? (
            <Image
              src={friend.photoURL}
              alt={friend.displayName}
              width={52}
              height={52}
              className="w-13 h-13 rounded-full object-cover"
            />
          ) : (
            <div className="w-13 h-13 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
              {friend.displayName[0]}
            </div>
          )}
          {friend.isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900 truncate">{friend.displayName}</p>
            {friend.isOnline ? (
              <span className="text-xs text-emerald-500 font-medium">在線</span>
            ) : (
              <span className="text-xs text-slate-400">{friend.lastSeen}</span>
            )}
          </div>
          {friend.bio && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{friend.bio}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Plane className="w-3 h-3" />
              {friend.tripCount} 行程
            </span>
            <span className="flex items-center gap-1">
              <Globe2 className="w-3 h-3" />
              {friend.countriesCount} 國
            </span>
            {friend.friendSince && (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" />
                {friend.friendSince.slice(0, 7)} 起
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0">
          {showConfirm ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { onRemove(friend.uid); setShowConfirm(false); }}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                確認
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-2 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              title="移除好友"
            >
              <UserMinus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Request Card ─────────────────────────────────────────────────────────────
function RequestCard({
  fromUid,
  fromDisplayName,
  fromPhotoURL,
  fromEmail,
  requestId,
  createdAt,
  onAccept,
  onReject,
}: {
  fromUid: string;
  fromDisplayName: string;
  fromPhotoURL?: string;
  fromEmail: string;
  requestId: string;
  createdAt: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        {fromPhotoURL ? (
          <Image
            src={fromPhotoURL}
            alt={fromDisplayName}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
            {fromDisplayName[0]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900">{fromDisplayName}</p>
          <p className="text-xs text-slate-500 truncate">{fromEmail}</p>
          <p className="text-xs text-slate-400 mt-0.5">{timeAgo(createdAt)}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="gradient"
            onClick={() => onAccept(requestId)}
            className="rounded-lg"
          >
            <Check className="w-3.5 h-3.5" />
            接受
          </Button>
          <button
            onClick={() => onReject(requestId)}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Invisible usage of fromUid */}
      <span className="hidden" data-uid={fromUid} />
    </motion.div>
  );
}

// ─── Discover Card ────────────────────────────────────────────────────────────
function DiscoverCard({
  user,
  isFriend,
  hasSentRequest,
  onSend,
}: {
  user: FriendProfile;
  isFriend: boolean;
  hasSentRequest: boolean;
  onSend: (user: FriendProfile) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shrink-0">
            {user.displayName[0]}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900">{user.displayName}</p>
          <p className="text-xs text-slate-500 truncate">{user.email}</p>
          {user.bio && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{user.bio}</p>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
            <span>{user.tripCount} 行程</span>
            <span>·</span>
            <span>{user.countriesCount} 國</span>
          </div>
        </div>

        <div className="shrink-0">
          {isFriend ? (
            <span className="flex items-center gap-1 text-xs text-emerald-500 font-medium bg-emerald-50 px-3 py-1.5 rounded-full">
              <Check className="w-3 h-3" />
              已是好友
            </span>
          ) : hasSentRequest ? (
            <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <Clock className="w-3 h-3" />
              已發送
            </span>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSend(user)}
              className="rounded-lg"
            >
              <UserPlus className="w-3.5 h-3.5" />
              加好友
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [friendFilter, setFriendFilter] = useState('');

  const {
    friends,
    pendingRequests,
    sentRequests,
    activities,
    searchResults,
    pendingCount,
    loading,
    searchUsers,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    sendRequest,
    removeFriend,
    toggleLike,
    isFriend,
    hasSentRequest,
  } = useFriends();

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    searchUsers(q);
  };

  const filteredFriends = friends.filter(
    (f) =>
      !friendFilter ||
      f.displayName.toLowerCase().includes(friendFilter.toLowerCase()) ||
      f.email.toLowerCase().includes(friendFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">旅遊好友</h1>
              <p className="text-sm text-slate-500">{friends.length} 位好友</p>
            </div>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setActiveTab('discover')}
              className="rounded-xl"
            >
              <UserPlus className="w-4 h-4" />
              新增好友
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 pb-0 overflow-x-auto scrollbar-none">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'requests' && pendingCount > 0 && (
                    <span className="ml-1 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* ── Feed Tab ── */}
          {activeTab === 'feed' && (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              {/* Shared Trips Banner */}
              {MOCK_SHARED_TRIPS.length > 0 && (
                <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-2xl p-4 text-white">
                  <p className="text-xs font-medium opacity-80 mb-1">共同行程</p>
                  {MOCK_SHARED_TRIPS.map((trip) => (
                    <div key={trip.tripId} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        <Image
                          src={trip.coverImage}
                          alt={trip.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-base">{trip.title}</p>
                        <p className="text-xs opacity-80">
                          {trip.destination} · {trip.startDate} – {trip.endDate}
                        </p>
                        <p className="text-xs opacity-60 mt-0.5">
                          {trip.ownerName} 建立 · {trip.memberCount} 人同行
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activities.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <Globe2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">還沒有任何動態</p>
                  <p className="text-sm mt-1">加入好友後就能看到他們的旅遊動態</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    onLike={toggleLike}
                  />
                ))
              )}
            </motion.div>
          )}

          {/* ── Friends Tab ── */}
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              {/* Search filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="搜尋好友姓名或 Email..."
                  value={friendFilter}
                  onChange={(e) => setFriendFilter(e.target.value)}
                  className="pl-9"
                />
              </div>

              {filteredFriends.length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">
                    {friends.length === 0 ? '還沒有好友' : '找不到符合的好友'}
                  </p>
                  <p className="text-sm mt-1">
                    {friends.length === 0 ? '去探索頁面找找旅伴吧！' : '試試其他關鍵字'}
                  </p>
                  {friends.length === 0 && (
                    <Button
                      variant="gradient"
                      size="sm"
                      className="mt-4 rounded-xl"
                      onClick={() => setActiveTab('discover')}
                    >
                      探索好友
                    </Button>
                  )}
                </div>
              ) : (
                <AnimatePresence>
                  <div className="grid gap-3">
                    {filteredFriends.map((friend) => (
                      <FriendCard
                        key={friend.uid}
                        friend={friend}
                        onRemove={removeFriend}
                      />
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </motion.div>
          )}

          {/* ── Requests Tab ── */}
          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* Incoming */}
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  收到的請求 ({pendingRequests.length})
                </h2>
                {pendingRequests.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6 text-center">
                    目前沒有待處理的好友請求
                  </p>
                ) : (
                  <AnimatePresence>
                    <div className="space-y-3">
                      {pendingRequests.map((req) => (
                        <RequestCard
                          key={req.id}
                          requestId={req.id}
                          fromUid={req.fromUid}
                          fromDisplayName={req.fromDisplayName}
                          fromPhotoURL={req.fromPhotoURL}
                          fromEmail={req.fromEmail}
                          createdAt={req.createdAt}
                          onAccept={acceptRequest}
                          onReject={rejectRequest}
                        />
                      ))}
                    </div>
                  </AnimatePresence>
                )}
              </div>

              {/* Sent */}
              <div>
                <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  已發送的請求 ({sentRequests.length})
                </h2>
                {sentRequests.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6 text-center">
                    沒有待對方確認的請求
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sentRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white font-bold shrink-0">
                          ?
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-700 text-sm">待對方確認</p>
                          <p className="text-xs text-slate-400">
                            發送於 {timeAgo(req.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => cancelRequest(req.id)}
                          className="text-xs text-slate-400 hover:text-red-400 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-red-200 transition-colors"
                        >
                          取消請求
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── Discover Tab ── */}
          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              {/* Search */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  搜尋旅伴
                </p>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="輸入姓名或 Email 搜尋..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Search results */}
              {searchQuery && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    搜尋結果 {loading ? '…' : `(${searchResults.length})`}
                  </h3>
                  {searchResults.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">找不到用戶，試試看其他關鍵字</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchResults.map((u) => (
                        <DiscoverCard
                          key={u.uid}
                          user={u}
                          isFriend={isFriend(u.uid)}
                          hasSentRequest={hasSentRequest(u.uid)}
                          onSend={sendRequest}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {!searchQuery && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                    你可能認識的旅伴
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        uid: 'user-009',
                        displayName: 'Alice Chang',
                        email: 'alice@example.com',
                        photoURL:
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
                        tripCount: 9,
                        countriesCount: 6,
                        bio: '喜歡自助旅行，特別是東南亞 🌴',
                      },
                      {
                        uid: 'user-010',
                        displayName: 'Daniel Tsai',
                        email: 'daniel@example.com',
                        photoURL:
                          'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&crop=face',
                        tripCount: 15,
                        countriesCount: 11,
                        bio: '飛行常客，收集航空哩程 ✈️',
                      },
                      {
                        uid: 'user-011',
                        displayName: 'Grace Lin',
                        email: 'grace@example.com',
                        photoURL:
                          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
                        tripCount: 5,
                        countriesCount: 3,
                        bio: '文化旅遊愛好者，博物館狂熱粉 🎨',
                      },
                    ].map((u) => (
                      <DiscoverCard
                        key={u.uid}
                        user={u}
                        isFriend={isFriend(u.uid)}
                        hasSentRequest={hasSentRequest(u.uid)}
                        onSend={sendRequest}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
