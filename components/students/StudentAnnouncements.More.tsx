'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Tag, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  BookOpen,
  Share2,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

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
  createdBy: {
    name: string;
    email: string;
  };
}

interface MoreProps {
  announcement: Announcement;
}

const More: React.FC<MoreProps> = ({ announcement }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if announcement is saved on mount
  useEffect(() => {
    const savedAnnouncements = localStorage.getItem('savedAnnouncements');
    if (savedAnnouncements) {
      const savedList = JSON.parse(savedAnnouncements);
      const isAlreadySaved = savedList.some((item: Announcement) => item._id === announcement._id);
      setIsSaved(isAlreadySaved);
    }
  }, [announcement._id]);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'bg-error text-on-brand',
          icon: AlertCircle,
          label: 'High Priority'
        };
      case 'medium':
        return {
          color: 'bg-warning text-on-brand',
          icon: Clock,
          label: 'Medium Priority'
        };
      case 'low':
        return {
          color: 'bg-success text-on-brand',
          label: 'Low Priority'
        };
      default:
        return {
          color: 'bg-surface text-text-primary',
          label: 'Standard'
        };
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Academic: 'bg-blue-500',
      Financial: 'bg-green-500',
      Event: 'bg-purple-500',
      Accommodation: 'bg-orange-500'
    };
    return colors[category as keyof typeof colors] || 'bg-primary';
  };

  // Save to LocalStorage
  const handleSave = () => {
    const saved = localStorage.getItem('savedAnnouncements');
    let savedList = saved ? JSON.parse(saved) : [];
    
    if (isSaved) {
      // Remove from saved
      savedList = savedList.filter((item: Announcement) => item._id !== announcement._id);
      setIsSaved(false);
    } else {
      // Add to saved
      if (!savedList.some((item: Announcement) => item._id === announcement._id)) {
        savedList.push(announcement);
        setIsSaved(true);
      }
    }
    
    localStorage.setItem('savedAnnouncements', JSON.stringify(savedList));
    
    // Show feedback
    console.log(isSaved ? 'Removed from saved' : 'Saved for later');
  };

  // Share functionality
  const handleShare = async () => {
    const shareData = {
      title: announcement.title,
      text: announcement.description,
      url: window.location.href,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const priorityConfig = getPriorityConfig(announcement.priority);
  const PriorityIcon = priorityConfig.icon;

  // Calculate content height and determine if it should be expandable
  const contentWords = announcement.content.split(' ');
  const isLongContent = contentWords.length > 100;
  const displayContent = isLongContent && !isExpanded 
    ? contentWords.slice(0, 100).join(' ') + '...'
    : announcement.content;

  return (
    <div className="bg-surface-elevated rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="p-6 border-b border-border bg-background2">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text-primary mb-2 leading-tight">
              {announcement.title}
            </h3>
            <p className="text-text2 text-lg leading-relaxed">
              {announcement.description}
            </p>
          </div>
          
          {/* Priority Badge */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ml-4 flex-shrink-0 ${priorityConfig.color}`}>
            {PriorityIcon && <PriorityIcon size={16} />}
            <span>{priorityConfig.label}</span>
          </div>
        </div>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(announcement.category)}`} />
            <span className="font-medium">{announcement.category}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>Published: {new Date(announcement.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>

          <div className="flex items-center gap-2">
            <Tag size={16} />
            {/* <span>By: {announcement.createdBy.name}</span> */}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full h-80 bg-background2">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse bg-border rounded-lg w-full h-full" />
              </div>
            )}
            <img
              src={announcement.image}
              alt={announcement.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-background2 text-text2">
            <div className="text-center">
              <BookOpen size={48} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Image not available</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={20} className="text-primary" />
          <h4 className="text-lg font-semibold text-text-primary">Announcement Details</h4>
        </div>

        <div 
          className={`prose prose-lg max-w-none text-text-primary transition-all duration-300 ${
            !isExpanded && isLongContent ? 'max-h-96 overflow-hidden' : ''
          }`}
        >
          <div 
            className="leading-relaxed text-text-primary whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ 
              __html: displayContent.replace(/\n/g, '<br/>') 
            }}
          />
        </div>

        {/* Expand/Collapse Button */}
        {isLongContent && (
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-medium"
            >
              {isExpanded ? (
                <>
                  <ChevronUp size={20} />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={20} />
                  Read Full Announcement
                </>
              )}
            </button>
          </div>
        )}

        {/* Content Statistics */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm text-text2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <BookOpen size={14} />
                {contentWords.length} words
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {Math.ceil(contentWords.length / 200)} min read
              </span>
            </div>
            
            {announcement.isActive ? (
              <span className="flex items-center gap-1 text-success">
                <div className="w-2 h-2 bg-success rounded-full" />
                Active
              </span>
            ) : (
              <span className="flex items-center gap-1 text-error">
                <div className="w-2 h-2 bg-error rounded-full" />
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-background2 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text2 text-sm">
            <ExternalLink size={16} />
            <span>Last updated: {new Date(announcement.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-surface text-text-primary rounded-xl hover:bg-surface-hover transition-colors text-sm font-medium"
            >
              <Share2 size={16} />
              Share
            </button>
            
            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors text-sm font-medium ${
                isSaved 
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;