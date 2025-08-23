'use client';

import { useState, useEffect } from 'react';
import { Trophy, Star, Award, Zap, Target, CheckCircle, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  current: number;
  unlocked: boolean;
  category: 'reviews' | 'accuracy' | 'streak' | 'community';
  reward_points: number;
}

interface AchievementProgressProps {
  userId?: string;
  compact?: boolean;
}

export default function AchievementProgress({ userId, compact = false }: AchievementProgressProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  const [unlockedCount, setUnlockedCount] = useState(0);

  useEffect(() => {
    loadAchievements();
  }, [userId]);

  const loadAchievements = async () => {
    try {
      // Mock achievements data
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        const mockAchievements: Achievement[] = [
          {
            id: 'first_review',
            name: 'First Review',
            description: 'Complete your first bar review',
            icon: 'star',
            requirement: 1,
            current: 1,
            unlocked: true,
            category: 'reviews',
            reward_points: 10
          },
          {
            id: 'helpful_reviewer',
            name: 'Helpful Reviewer',
            description: 'Complete 10 reviews',
            icon: 'trophy',
            requirement: 10,
            current: 8,
            unlocked: false,
            category: 'reviews',
            reward_points: 50
          },
          {
            id: 'community_champion',
            name: 'Community Champion',
            description: 'Complete 25 reviews',
            icon: 'award',
            requirement: 25,
            current: 8,
            unlocked: false,
            category: 'reviews',
            reward_points: 100
          },
          {
            id: 'review_master',
            name: 'Review Master',
            description: 'Complete 50 reviews',
            icon: 'zap',
            requirement: 50,
            current: 8,
            unlocked: false,
            category: 'reviews',
            reward_points: 200
          },
          {
            id: 'accuracy_expert',
            name: 'Accuracy Expert',
            description: 'Maintain 4.5+ accuracy score with 10+ reviews',
            icon: 'target',
            requirement: 10,
            current: 8,
            unlocked: false,
            category: 'accuracy',
            reward_points: 75
          },
          {
            id: 'streak_warrior',
            name: 'Streak Warrior',
            description: 'Complete reviews for 7 consecutive days',
            icon: 'zap',
            requirement: 7,
            current: 3,
            unlocked: false,
            category: 'streak',
            reward_points: 60
          }
        ];

        setAchievements(mockAchievements);
        setTotalPoints(mockAchievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward_points, 0));
        setUnlockedCount(mockAchievements.filter(a => a.unlocked).length);
        setIsLoading(false);
        return;
      }

      // Real API call would go here
      const response = await fetch(`/api/achievements?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setAchievements(data.achievements);
        setTotalPoints(data.totalPoints);
        setUnlockedCount(data.unlockedCount);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (iconName: string, unlocked: boolean) => {
    const className = `w-5 h-5 ${unlocked ? getIconColor(iconName) : 'text-zinc-500'}`;
    
    switch (iconName) {
      case 'star':
        return <Star className={className} />;
      case 'trophy':
        return <Trophy className={className} />;
      case 'award':
        return <Award className={className} />;
      case 'zap':
        return <Zap className={className} />;
      case 'target':
        return <Target className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  const getIconColor = (iconName: string) => {
    switch (iconName) {
      case 'star':
        return 'text-blue-400';
      case 'trophy':
        return 'text-green-400';
      case 'award':
        return 'text-purple-400';
      case 'zap':
        return 'text-yellow-400';
      case 'target':
        return 'text-red-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'reviews':
        return 'text-green-400';
      case 'accuracy':
        return 'text-blue-400';
      case 'streak':
        return 'text-orange-400';
      case 'community':
        return 'text-purple-400';
      default:
        return 'text-zinc-400';
    }
  };

  const getProgressPercentage = (current: number, requirement: number) => {
    return Math.min((current / requirement) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-zinc-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-zinc-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    const nextAchievement = achievements.find(a => !a.unlocked);
    
    return (
      <div className="bg-zinc-800 rounded-lg border border-zinc-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-white">Next Achievement</h4>
          <span className="text-xs text-zinc-400">{unlockedCount}/{achievements.length}</span>
        </div>
        
        {nextAchievement ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getIcon(nextAchievement.icon, false)}
              <span className="text-sm text-white font-medium">{nextAchievement.name}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>{nextAchievement.current}/{nextAchievement.requirement}</span>
              <span>+{nextAchievement.reward_points} pts</span>
            </div>
            
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getIconColor(nextAchievement.icon).replace('text-', 'bg-')}`}
                style={{ width: `${getProgressPercentage(nextAchievement.current, nextAchievement.requirement)}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-center text-zinc-400 text-sm">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            All achievements unlocked!
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-400" />
          Achievements
        </h3>
        
        <div className="text-right">
          <div className="text-sm text-white font-medium">{totalPoints} Points</div>
          <div className="text-xs text-zinc-400">{unlockedCount}/{achievements.length} Unlocked</div>
        </div>
      </div>

      <div className="space-y-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border transition-all duration-200 ${
              achievement.unlocked
                ? 'bg-zinc-700/50 border-zinc-600 shadow-lg'
                : 'bg-zinc-800/50 border-zinc-700'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`p-2 rounded-lg ${
                achievement.unlocked ? 'bg-zinc-600' : 'bg-zinc-700'
              }`}>
                {achievement.unlocked ? (
                  getIcon(achievement.icon, true)
                ) : (
                  <Lock className="w-5 h-5 text-zinc-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-medium ${
                    achievement.unlocked ? 'text-white' : 'text-zinc-400'
                  }`}>
                    {achievement.name}
                    {achievement.unlocked && (
                      <CheckCircle className="w-4 h-4 text-green-400 inline ml-2" />
                    )}
                  </h4>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(achievement.category).replace('text-', 'bg-')}/20 ${getCategoryColor(achievement.category)}`}>
                      {achievement.category}
                    </span>
                    <span className="text-xs text-zinc-400">+{achievement.reward_points} pts</span>
                  </div>
                </div>
                
                <p className="text-sm text-zinc-400 mb-3">{achievement.description}</p>
                
                {!achievement.unlocked && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Progress</span>
                      <span className="text-zinc-300">
                        {achievement.current}/{achievement.requirement}
                      </span>
                    </div>
                    
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getIconColor(achievement.icon).replace('text-', 'bg-')}`}
                        style={{ width: `${getProgressPercentage(achievement.current, achievement.requirement)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="mt-6 pt-4 border-t border-zinc-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Overall Progress</span>
          <span className="text-sm text-white">{Math.round((unlockedCount / achievements.length) * 100)}%</span>
        </div>
        
        <div className="w-full bg-zinc-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-400 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
