'use client'
import { useState, useEffect } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import { Trash2 } from "lucide-react";
import { courseTypes, courseUnits, levels, semesters } from "@/constants/options";
import { useSuggestionFetcher } from "./useSuggestionFetcher";
import { CourseDetails } from "./course/CourseDetails";
export interface Announcement {
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

interface AnnouncementFormData {
  title: string;
  description: string;
  content: string;
  category: 'Academic' | 'Financial' | 'Event' | 'Accommodation';
  priority: 'low' | 'medium' | 'high';
  image: string;
  expiresAt: string;
  isActive: boolean;
  targetAudience: string[];
  tags: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export const useAnnouncement = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [pagination, setPagination] = useState({})
    const {addNotification} = useNotifications()
    const {fetchData}= useDataFetcher()
  
    const categories = ['all', 'Academic', 'Financial', 'Event', 'Accommodation'];
    const statuses = ['all', 'active', 'expired', 'inactive'];
  
    // API base URL
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  const alert = () => ({
    success: (message: string) => {
      addNotification({ message, variant: "success" });
    },
    error: (message: string) => {
      addNotification({ message, variant: "error" });
    }
  });
  
    // Fetch announcements
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(false);
        setError(null);
        
        const {data, pagination} = await fetchData("announcements") 
        
          setAnnouncements(data);
          setPagination(pagination)
  
      } catch (err) {
      //   console.error('Error fetching announcements:', err);
          alert().error(err.message||"Failed to fetch announcemeents")
          // addNotification({variant: "error", "message": "Failes"})
  
      } finally {
        setIsLoading(false);
      }
    };
  
    // Create announcement
    const createAnnouncement = async (formData: AnnouncementFormData) => {
      try {
        setSaving(true);
        setError(null);
  
        const {data} = await fetchData("announcements", "POST", formData)
  
          alert().success('Announcement created successfully!');
          await fetchAnnouncements(); // Refresh the list
          return true;
  
      } catch (err) {
        alert().error(err instanceof Error ? err.message : 'Failed to create announcement');
        console.error('Error creating announcement:', err);
        return false;
      } finally {
        setSaving(false);
      }
    };
  
    // Update announcement
    const updateAnnouncement = async (id: string, formData: AnnouncementFormData) => {
      try {
        setSaving(true);
        setError(null);
  
        const response = await fetch(`${API_BASE}/announcements/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update announcement');
        }
  
        const result: ApiResponse<Announcement> = await response.json();
        
        if (result.success) {
          setSuccess('Announcement updated successfully!');
          await fetchAnnouncements(); // Refresh the list
          return true;
        } else {
          throw new Error(result.message || 'Failed to update announcement');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update announcement');
        console.error('Error updating announcement:', err);
        return false;
      } finally {
        setSaving(false);
      }
    };
  
    // Delete announcement
    const deleteAnnouncement = async (id: string) => {
      if (!confirm('Are you sure you want to delete this announcement?')) {
        return;
      }
  
      try {
        setError(null);
  
  
        const {data} = await fetchData("announcements", "DELETE", {}, {
            
            params:`${id}`
        }
    )
       
          alert().success('Announcement deleted successfully!');
          await fetchAnnouncements(); 
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete announcement');
        console.error('Error deleting announcement:', err);
      }
    };
  
    // Toggle announcement status
    const toggleAnnouncementStatus = async (id: string, currentStatus: boolean) => {
      try {
        setError(null);
  
        const response = await fetch(`${API_BASE}/announcements/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update announcement status');
        }
  
        const result = await response.json();
        
        if (result.success) {
          setSuccess(`Announcement ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
          await fetchAnnouncements();
        } else {
          throw new Error(result.message || 'Failed to update announcement status');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update announcement status');
        console.error('Error updating announcement status:', err);
      }
    };
  
    // Handle form submission
    const handleSaveAnnouncement = async (formData: AnnouncementFormData) => {
      const isSuccess = editingAnnouncement 
        ? await updateAnnouncement(editingAnnouncement._id, formData)
        : await createAnnouncement(formData);
  
      if (isSuccess) {
        setIsCreateModalOpen(false);
        setEditingAnnouncement(null);
      }
    };
 
  const handleServerQuery = async (query: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, pagination } = await fetchData("announcements", "POST", {
        fields: [query.filterId],
        page: query.page,
        search_term: query.search,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
        pageSize: "3",
      });
      
      setAnnouncements(data);
      setPagination(pagination);
    } catch (err) {
      
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    announcements,
    isLoading,
    error,
    pagination,
    handleSaveAnnouncement,
    toggleAnnouncementStatus,
    deleteAnnouncement,
    // Actions

    handleServerQuery,
    
    // Data fetching
    editingAnnouncement,
    createAnnouncement,
    fetchAnnouncements,
  };
};