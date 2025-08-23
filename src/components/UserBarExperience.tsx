'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useBarVisits } from '@/hooks/useBarVisits';
import { useRecommendations } from '@/hooks/useRecommendations';
import BarVisitLogger from './BarVisitLogger';
import { 
  Heart, 
  Calendar, 
  Star, 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare,
  Clock,
  Users,
  Music,
  Sparkles,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface UserFavorite {
  id: string;
  bar_id: string;
  created_at: string;
  bar: {
    id: string;
    name: string;
    slug: string;
    neighbourhood: string;
    address: string;
    description: string;
    typical_vibe: string;
    top_music: string[];
    has_rooftop: boolean;
    has_patio: boolean;
    has_dancefloor: boolean;
  };
}

interface UserVisit {
  id: string;
  bar_id: string;
  visit_date: string;
  experience_rating: number;
  comment?: string;
  reported_wait_time?: string;
  reported_cover_charge?: string;
  reported_music_genres?: string[];
  time_of_visit?: string;
  group_size?: string;
  special_event?: string;
  created_at: string;
  bar: {
    id: string;
    name: string;
    slug: string;
    neighbourhood: string;
    address: string;
  };
}

interface RecommendationScore {
  bar: any;
  totalScore: number;
  reasoning: string[];
}

export default function UserBarExperience() {
  const { user } = useAuth();
  const { favorites, isLoading: favoritesLoading, loadFavorites, removeFavorite } = useFavorites();
  const { visits, isLoading: visitsLoading, loadVisits, deleteVisit } = useBarVisits();
  const { recommendations, isLoading: recommendationsLoading, loadRecommendations } = useRecommendations();
  
  const [activeTab, setActiveTab] = useState<'favorites' | 'visits' | 'recommendations'>('favorites');
  const [showVisitLogger, setShowVisitLogger] = useState(false);
  const [editingVisit, setEditingVisit] = useState<UserVisit | null>(null);
  const [selectedBarForVisit, setSelectedBarForVisit] = useState<{ id: string; name: string } | null>(null);
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);
  
  const isLoading = favoritesLoading || visitsLoading || recommendationsLoading;

  useEffect(() => {
    if (user) {
      loadFavorites();
      loadVisits();
      loadRecommendations(5);
    }
  }, [user, loadFavorites, loadVisits, loadRecommendations]);

  const handleRemoveFavorite = async (barId: string) => {
    await removeFavorite(barId);
  };

  const handleDeleteVisit = async (visitId: string) => {
    await deleteVisit(visitId);
  };

  const handleVisitLogged = (visit: UserVisit) => {
    // The hooks will automatically update the state
    // We just need to refresh the data to ensure consistency
    loadVisits();
    setEditingVisit(null);
    setShowVisitLogger(false);
    setSelectedBarForVisit(null);
  };

  const openVisitLogger = (bar?: { id: string; name: string }, existingVisit?: UserVisit) => {
    if (existingVisit) {
      setEditingVisit(existingVisit);
      setSelectedBarForVisit({ id: existingVisit.bar_id, name: existingVisit.bar.name });
    } else if (bar) {
      setSelectedBarForVisit(bar);
      setEditingVisit(null);
    }
    setShowVisitLogger(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeOfDayLabel = (time: string) => {
    switch (time) {
      case 'afternoon': return 'Afternoon';
      case 'early_evening': return 'Early Evening';
      case 'peak_night': return 'Peak Night';
      case 'late_night': return 'Late Night';
      default: return time;
    }
  };

  const getGroupSizeLabel = (size: string) => {
    switch (size) {
      case 'solo': return 'Solo';
      case 'couple': return 'Couple';
      case 'small_group': return 'Small Group';
      case 'large_group': return 'Large Group';
      default: return size;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-zinc-800 p-1 rounded-lg">
        {[
          { key: 'favorites', label: 'Favorites', icon: Heart, count: favorites.length },
          { key: 'visits', label: 'Visits', icon: Calendar, count: visits.length },
          { key: 'recommendations', label: 'For You', icon: TrendingUp, count: recommendations.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-green-600 text-white'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-green-700' : 'bg-zinc-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your Favorite Bars</h3>
          </div>

          {favorites.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <Heart className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <p>No favorite bars yet</p>
              <p className="text-sm">Heart bars you love to save them here</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {favorites.map(favorite => (
                <div key={favorite.id} className="bg-zinc-800 rounded-lg border border-zinc-700 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{favorite.bar.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        {favorite.bar.neighbourhood}
                      </div>
                      <p className="text-sm text-zinc-300 mt-2">{favorite.bar.description}</p>
                      
                      <div className="flex items-center gap-4 mt-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Music className="w-3 h-3" />
                          {favorite.bar.top_music?.slice(0, 2).join(', ')}
                        </span>
                        <span>{favorite.bar.typical_vibe}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openVisitLogger({ id: favorite.bar_id, name: favorite.bar.name })}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Log a visit"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(favorite.bar_id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visits Tab */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your Bar Visits</h3>
            <button
              onClick={() => setShowVisitLogger(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Log Visit
            </button>
          </div>

          {visits.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <p>No visits logged yet</p>
              <p className="text-sm">Start tracking your nightlife experiences</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {visits.map(visit => (
                <div key={visit.id} className="bg-zinc-800 rounded-lg border border-zinc-700 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-white">{visit.bar.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-white font-medium">{visit.experience_rating}/10</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-zinc-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(visit.visit_date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {visit.bar.neighbourhood}
                        </span>
                        {visit.time_of_visit && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeOfDayLabel(visit.time_of_visit)}
                          </span>
                        )}
                        {visit.group_size && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {getGroupSizeLabel(visit.group_size)}
                          </span>
                        )}
                      </div>

                      {visit.comment && (
                        <div className="flex items-start gap-2 mt-3">
                          <MessageSquare className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-zinc-300">{visit.comment}</p>
                        </div>
                      )}

                      {visit.special_event && (
                        <div className="flex items-center gap-2 mt-2">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-purple-300">{visit.special_event}</span>
                        </div>
                      )}

                      {visit.reported_music_genres && visit.reported_music_genres.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <Music className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-zinc-300">
                            {visit.reported_music_genres.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openVisitLogger(undefined, visit)}
                        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Edit visit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVisit(visit.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Delete visit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recommended For You</h3>
            <button
              onClick={() => loadRecommendations(5)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <p>No recommendations available</p>
              <p className="text-sm">Add some favorites and visits to get personalized suggestions</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {recommendations.map(rec => (
                <div key={rec.bar.id} className="bg-zinc-800 rounded-lg border border-zinc-700 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-white">{rec.bar.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-medium">{rec.totalScore}/10</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-zinc-400 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {rec.bar.neighbourhood}
                        </span>
                        <span className="flex items-center gap-1">
                          <Music className="w-3 h-3" />
                          {rec.bar.top_music?.slice(0, 2).join(', ')}
                        </span>
                      </div>

                      <p className="text-sm text-zinc-300 mb-3">{rec.bar.description}</p>

                      <button
                        onClick={() => setExpandedRecommendation(
                          expandedRecommendation === rec.bar.id ? null : rec.bar.id
                        )}
                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Why recommended?
                        {expandedRecommendation === rec.bar.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      {expandedRecommendation === rec.bar.id && (
                        <div className="mt-3 p-3 bg-zinc-700/50 rounded-lg">
                          <ul className="space-y-1 text-sm text-zinc-300">
                            {rec.reasoning.map((reason, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-400 mt-1">•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openVisitLogger({ id: rec.bar.id, name: rec.bar.name })}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-zinc-700 rounded-lg transition-colors"
                        title="Log a visit"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Visit Logger Modal */}
      {showVisitLogger && selectedBarForVisit && (
        <BarVisitLogger
          barId={selectedBarForVisit.id}
          barName={selectedBarForVisit.name}
          existingVisit={editingVisit}
          onClose={() => {
            setShowVisitLogger(false);
            setSelectedBarForVisit(null);
            setEditingVisit(null);
          }}
          onVisitLogged={handleVisitLogged}
        />
      )}
    </div>
  );
}
