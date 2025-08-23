'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Award, Medal, Crown, Zap, TrendingUp } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  total_reviews: number;
  accuracy_score: number;
  loyalty_points: number;
  badges: string[];
  review_streak: number;
  rank_change: number; // +1, -1, 0
}

interface LeaderboardProps {
  timeframe?: 'week' | 'month' | 'all';
  limit?: number;
  showCurrentUser?: boolean;
  currentUserId?: string;
}

export default function Leaderboard({ 
  timeframe = 'all', 
  limit = 10, 
  showCurrentUser = false,
  currentUserId 
}: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [timeframe, limit]);

  const loadLeaderboard = async () => {
    try {
      // Mock data for demonstration
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        const mockLeaderboard: LeaderboardUser[] = [
          {
            id: '1',
            name: 'Alex Chen',
            total_reviews: 45,
            accuracy_score: 4.8,
            loyalty_points: 450,
            badges: ['First Review', 'Helpful Reviewer', 'Community Champion'],
            review_streak: 12,
            rank_change: 0
          },
          {
            id: '2',
            name: 'Sarah Kim',
            total_reviews: 38,
            accuracy_score: 4.7,
            loyalty_points: 380,
            badges: ['First Review', 'Helpful Reviewer'],
            review_streak: 8,
            rank_change: 1
          },
          {
            id: '3',
            name: 'Mike Johnson',
            total_reviews: 32,
            accuracy_score: 4.6,
            loyalty_points: 320,
            badges: ['First Review', 'Helpful Reviewer'],
            review_streak: 5,
            rank_change: -1
          },
          {
            id: 'mock-user-id-12345',
            name: 'Mock User',
            total_reviews: 15,
            accuracy_score: 4.2,
            loyalty_points: 150,
            badges: ['First Review'],
            review_streak: 3,
            rank_change: 2
          },
          {
            id: '4',
            name: 'Emma Wilson',
            total_reviews: 29,
            accuracy_score: 4.9,
            loyalty_points: 290,
            badges: ['First Review', 'Helpful Reviewer'],
            review_streak: 7,
            rank_change: 0
          }
        ];

        // Sort by total reviews (primary) and accuracy (secondary)
        const sortedLeaderboard = mockLeaderboard
          .sort((a, b) => {
            if (b.total_reviews !== a.total_reviews) {
              return b.total_reviews - a.total_reviews;
            }
            return b.accuracy_score - a.accuracy_score;
          })
          .slice(0, limit);

        setLeaderboard(sortedLeaderboard);
        
        if (showCurrentUser && currentUserId) {
          const userRank = sortedLeaderboard.findIndex(u => u.id === currentUserId) + 1;
          setCurrentUserRank(userRank || null);
        }
        
        setIsLoading(false);
        return;
      }

      // Real API call would go here
      const response = await fetch(`/api/leaderboard?timeframe=${timeframe}&limit=${limit}`);
      const data = await response.json();
      
      if (response.ok) {
        setLeaderboard(data.leaderboard);
        if (showCurrentUser) {
          setCurrentUserRank(data.currentUserRank);
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-orange-400" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-zinc-400">#{rank}</span>;
    }
  };

  const getRankChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="w-3 h-3 text-green-400" />;
    } else if (change < 0) {
      return <TrendingUp className="w-3 h-3 text-red-400 rotate-180" />;
    }
    return null;
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'First Review':
        return <Star className="w-3 h-3 text-blue-400" />;
      case 'Helpful Reviewer':
        return <Trophy className="w-3 h-3 text-green-400" />;
      case 'Community Champion':
        return <Crown className="w-3 h-3 text-purple-400" />;
      case 'Review Master':
        return <Zap className="w-3 h-3 text-yellow-400" />;
      default:
        return <Award className="w-3 h-3 text-zinc-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-zinc-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Community Leaderboard
        </h3>
        
        <div className="text-xs text-zinc-400 capitalize">
          {timeframe === 'all' ? 'All Time' : `This ${timeframe}`}
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((user, index) => {
          const rank = index + 1;
          const isCurrentUser = currentUserId === user.id;
          
          return (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                isCurrentUser 
                  ? 'bg-green-900/30 border border-green-700/50' 
                  : 'bg-zinc-700/50 hover:bg-zinc-700'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center gap-2 w-8">
                {getRankIcon(rank)}
                {getRankChangeIcon(user.rank_change)}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-medium ${isCurrentUser ? 'text-green-400' : 'text-white'}`}>
                    {user.name}
                    {isCurrentUser && <span className="text-xs text-green-400 ml-1">(You)</span>}
                  </span>
                  
                  {/* Badges */}
                  <div className="flex gap-1">
                    {user.badges.slice(0, 3).map((badge, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-600 rounded text-xs"
                        title={badge}
                      >
                        {getBadgeIcon(badge)}
                      </div>
                    ))}
                    {user.badges.length > 3 && (
                      <span className="text-xs text-zinc-400">+{user.badges.length - 3}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-zinc-400">
                  <span>{user.total_reviews} reviews</span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {user.accuracy_score}
                  </span>
                  <span>{user.loyalty_points} pts</span>
                  {user.review_streak > 0 && (
                    <span className="flex items-center gap-1 text-orange-400">
                      <Zap className="w-3 h-3" />
                      {user.review_streak} streak
                    </span>
                  )}
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <div className="text-lg font-bold text-white">{user.loyalty_points}</div>
                <div className="text-xs text-zinc-400">points</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current User Rank (if not in top list) */}
      {showCurrentUser && currentUserRank && currentUserRank > limit && (
        <div className="mt-4 pt-4 border-t border-zinc-700">
          <div className="text-center text-sm text-zinc-400">
            Your rank: #{currentUserRank}
          </div>
        </div>
      )}

      {/* Achievement Progress */}
      <div className="mt-6 pt-4 border-t border-zinc-700">
        <div className="text-sm text-zinc-400 mb-2">Next Achievement</div>
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-300">Review Master (50 reviews)</span>
              <span className="text-xs text-zinc-400">32/50</span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                style={{ width: '64%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
