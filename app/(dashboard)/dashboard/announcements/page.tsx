'use client';

import { useState, useEffect } from 'react';
import {
  Bookmark,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Share2,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Tag,
  Search,
  Filter
} from 'lucide-react';
import { useAnnouncement } from '@/hooks/useAnnouncements';
import { usePage } from '@/hooks/usePage';

interface Announcement {
  _id: string;
  title: string;
  description: string;
  content: string;
  category: 'Academic' | 'Financial' | 'Event' | 'Accommodation';
  priority: 'low' | 'medium' | 'high';
  image: string;
  date: string;
  expiresAt: string;
  isActive: boolean;
  createdBy?: {
    name: string;
    email: string;
  };
}

type TabType = 'all' | 'saved';
type CategoryFilter = 'All' | Announcement['category'];

const AnnouncementsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [savedAnnouncements, setSavedAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null);
  const { fetchAnnouncements, announcements } = useAnnouncement();
  const { setPage } = usePage()
  useEffect(() => {
    setPage("Announcements")
  }, []);

  // Fetch all announcements
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchAnnouncements();
      setLoading(false);
    };
    loadData();
  }, []);

  // Load saved announcements from localStorage
  useEffect(() => {
    const loadSavedAnnouncements = () => {
      const savedIds = localStorage.getItem('savedAnnouncements');
      if (savedIds && announcements.length > 0) {
        const ids = JSON.parse(savedIds);
        const saved = announcements.filter(announcement =>
          ids.includes(announcement._id)
        );
        setSavedAnnouncements(saved);
      }
    };

    if (announcements.length > 0) {
      loadSavedAnnouncements();
    }
  }, [announcements]);

  // Save/Unsave announcement
  const toggleSaveAnnouncement = (announcementId: string) => {
    const savedIds = localStorage.getItem('savedAnnouncements');
    let ids = savedIds ? JSON.parse(savedIds) : [];

    if (ids.includes(announcementId)) {
      // Remove from saved
      ids = ids.filter((id: string) => id !== announcementId);
      setSavedAnnouncements(prev => prev.filter(a => a._id !== announcementId));
    } else {
      // Add to saved
      ids.push(announcementId);
      const announcementToSave = announcements.find(a => a._id === announcementId);
      if (announcementToSave) {
        setSavedAnnouncements(prev => [...prev, announcementToSave]);
      }
    }

    localStorage.setItem('savedAnnouncements', JSON.stringify(ids));
  };

  // Remove announcement from saved (in saved tab)
  const removeSavedAnnouncement = (id: string) => {
    const savedIds = localStorage.getItem('savedAnnouncements');
    if (savedIds) {
      const ids = JSON.parse(savedIds);
      const updatedIds = ids.filter((savedId: string) => savedId !== id);
      localStorage.setItem('savedAnnouncements', JSON.stringify(updatedIds));

      // Update local state
      setSavedAnnouncements(prev => prev.filter(announcement => announcement._id !== id));
    }
  };

  // Clear all saved announcements
  const clearAllSaved = () => {
    if (confirm('Are you sure you want to clear all saved announcements?')) {
      localStorage.removeItem('savedAnnouncements');
      setSavedAnnouncements([]);
    }
  };

  // Filter announcements based on active tab and filters
  const getFilteredAnnouncements = () => {
    let filtered = activeTab === 'all' ? announcements : savedAnnouncements;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(announcement =>
        announcement.category === categoryFilter
      );
    }

    // Apply priority filter
    if (priorityFilter !== 'All') {
      filtered = filtered.filter(announcement =>
        announcement.priority === priorityFilter
      );
    }

    return filtered;
  };

  const filteredAnnouncements = getFilteredAnnouncements();

  // Share functionality
  const handleShare = async (announcement: Announcement) => {
    const shareData = {
      title: announcement.title,
      text: announcement.description,
      url: window.location.href + `?announcement=${announcement._id}`,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Toggle announcement expansion
  const toggleExpand = (id: string) => {
    setExpandedAnnouncement(expandedAnnouncement === id ? null : id);
  };

  // Get unique categories from announcements
  const categories = ['All', ...new Set(announcements.map(a => a.category))] as CategoryFilter[];
  const priorities = ['All', 'low', 'medium', 'high'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-border rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-surface rounded-2xl p-6">
                  <div className="h-6 bg-border rounded mb-4"></div>
                  <div className="h-4 bg-border rounded mb-2"></div>
                  <div className="h-4 bg-border rounded mb-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">Announcements</h1>
              <p className="text-text2">
                Stay updated with the latest news and updates from the university
              </p>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              {/* Saved count badge */}
              {savedAnnouncements.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary text-on-brand rounded-lg text-sm">
                  <Bookmark size={16} />
                  <span>{savedAnnouncements.length} saved</span>
                </div>
              )}

              {/* Clear saved button (only in saved tab) */}
              {activeTab === 'saved' && savedAnnouncements.length > 0 && (
                <button
                  onClick={clearAllSaved}
                  className="flex items-center gap-2 px-4 py-2 bg-error text-on-brand rounded-xl hover:bg-error-hover transition-colors text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text2 hover:text-text-primary'
                }`}
            >
              All Announcements ({announcements.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'saved'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text2 hover:text-text-primary'
                }`}
            >
              <Bookmark size={16} />
              Saved ({savedAnnouncements.length})
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-surface rounded-xl p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text2" size={20} />
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex-1">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text2" size={20} />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                    className="w-full pl-10 pr-4 py-3 bg-background2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary appearance-none"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority Filter */}
              <div className="flex-1">
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text2" size={20} />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-background2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary appearance-none"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-text2">
            Showing {filteredAnnouncements.length} {activeTab === 'all' ? 'announcement' : 'saved announcement'}{filteredAnnouncements.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
            {categoryFilter !== 'All' && ` in ${categoryFilter}`}
            {priorityFilter !== 'All' && ` with ${priorityFilter} priority`}
          </p>
        </div>

        {/* Announcements Grid */}
        {filteredAnnouncements.length > 0 ? (
          <div className="space-y-6">
            {filteredAnnouncements.map((announcement) => {
              const isSaved = savedAnnouncements.some(a => a._id === announcement._id);
              const isExpanded = expandedAnnouncement === announcement._id;
              const contentWords = announcement.content.split(' ');
              const isLongContent = contentWords.length > 100;
              const displayContent = isLongContent && !isExpanded
                ? contentWords.slice(0, 100).join(' ') + '...'
                : announcement.content;

              return (
                <div
                  key={announcement._id}
                  className="bg-surface-elevated rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Image */}
                    <div className="lg:w-1/3 h-64 lg:h-auto">
                      <img
                        src={announcement.image}
                        alt={announcement.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${announcement.category === 'Academic' ? 'bg-blue-100 text-blue-800' :
                                announcement.category === 'Financial' ? 'bg-green-100 text-green-800' :
                                  announcement.category === 'Event' ? 'bg-purple-100 text-purple-800' :
                                    'bg-orange-100 text-orange-800'
                              }`}>
                              {announcement.category}
                            </span>

                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${announcement.priority === 'high' ? 'bg-error text-on-brand' :
                                announcement.priority === 'medium' ? 'bg-warning text-on-brand' :
                                  'bg-success text-on-brand'
                              }`}>
                              {announcement.priority === 'high' && <AlertCircle size={12} />}
                              <span className="capitalize">{announcement.priority}</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-text-primary mb-2">
                            {announcement.title}
                          </h3>
                          <p className="text-text2 mb-4">
                            {announcement.description}
                          </p>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-4 text-sm text-text2 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          <span>{new Date(announcement.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} />
                          <span>{contentWords.length} words</span>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="mb-4">
                        <div
                          className="text-text-primary whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: displayContent.replace(/\n/g, '<br/>')
                          }}
                        />
                        {isLongContent && (
                          <button
                            onClick={() => toggleExpand(announcement._id)}
                            className="flex items-center gap-1 text-primary hover:text-primary-hover mt-2 text-sm font-medium"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp size={16} />
                                Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown size={16} />
                                Read Full Announcement
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleSaveAnnouncement(announcement._id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors text-sm font-medium ${isSaved
                                ? 'bg-success text-on-brand hover:bg-success-hover'
                                : 'bg-primary text-text-on-primary hover:bg-primary-hover'
                              }`}
                          >
                            {isSaved ? (
                              <>
                                <BookmarkCheck size={16} />
                                Saved
                              </>
                            ) : (
                              <>
                                <Bookmark size={16} />
                                Save for Later
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleShare(announcement)}
                            className="flex items-center gap-2 px-4 py-2 bg-surface text-text-primary rounded-xl hover:bg-surface-hover transition-colors text-sm font-medium"
                          >
                            <Share2 size={16} />
                            Share
                          </button>
                        </div>

                        {activeTab === 'saved' && (
                          <button
                            onClick={() => removeSavedAnnouncement(announcement._id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-surface text-text2 rounded-lg hover:bg-surface-hover transition-colors text-xs"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-surface rounded-2xl border border-border p-12 text-center">
            {activeTab === 'all' ? (
              <>
                <BookOpen size={64} className="mx-auto text-text2 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">No announcements found</h3>
                <p className="text-text2 mb-6 max-w-md mx-auto">
                  {searchTerm || categoryFilter !== 'All' || priorityFilter !== 'All'
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'There are currently no announcements. Check back later!'}
                </p>
                {(searchTerm || categoryFilter !== 'All' || priorityFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCategoryFilter('All');
                      setPriorityFilter('All');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-text-on-primary rounded-xl hover:bg-primary-hover transition-colors font-medium"
                  >
                    Clear Filters
                  </button>
                )}
              </>
            ) : (
              <>
                <Bookmark size={64} className="mx-auto text-text2 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">No saved announcements</h3>
                <p className="text-text2 mb-6 max-w-md mx-auto">
                  When you find an announcement you want to read later, click the "Save for Later" button to add it here.
                </p>
                <button
                  onClick={() => setActiveTab('all')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-text-on-primary rounded-xl hover:bg-primary-hover transition-colors font-medium"
                >
                  <ExternalLink size={20} />
                  Browse Announcements
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;