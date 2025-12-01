'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    Eye,
    Calendar,
    Tag,
    AlertCircle,
    CheckCircle,
    Clock,
    Loader2
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotification';
import { useDataFetcher } from '@/lib/dataFetcher';
import { Table } from '../ui/table/Table';
import { useAnnouncement } from '@/hooks/useAnnouncements';
import { Announcement } from '@/types/student.types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent } from '../ui/Card';
import StatsCard from '../ui/StatsCard';



const AnnouncementsAdminPanel = () => {
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { addNotification } = useNotifications()
    const { fetchData } = useDataFetcher()
    const {
        fetchAnnouncements,
        announcements,
        pagination,
        handleServerQuery,
        isLoading,
        handleSaveAnnouncement,
        deleteAnnouncement
    } = useAnnouncement()

    const categories = ['all', 'Academic', 'Financial', 'Event', 'Accommodation'];
    const statuses = ['all', 'active', 'expired', 'inactive'];

    // Initial fetch and when filters change
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-error text-on-brand';
            case 'medium': return 'bg-warning text-on-brand';
            case 'low': return 'bg-success text-on-brand';
            default: return 'bg-surface text-text-primary';
        }
    };

    const getStatusBadge = (announcement: Announcement) => {
        if (!announcement.isActive) {
            return <span className="px-2 py-1 bg-surface text-text2 text-xs rounded-full">Inactive</span>;
        }
        if (new Date(announcement.expiresAt) <= new Date()) {
            return <span className="px-2 py-1 bg-error/20 text-error text-xs rounded-full">Expired</span>;
        }
        return <span className="px-2 py-1 bg-success/20 text-success text-xs rounded-full">Active</span>;
    };

    if (isLoading && announcements.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex items-center gap-3 text-text-primary">
                    <Loader2 className="animate-spin" size={24} />
                    <span>Loading announcements...</span>
                </div>
            </div>
        );
    }

    const columns = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }: any) => {
                const courseName = row.original.name || "Unknown";
                const courseId = row.original._id; // assuming backend provides this
                const borrowed = row.original.borrowed
                const borrowed_department = row.original.borrowed_department
                const announcement = row.original
                let tooltipText;
                borrowed ? tooltipText = `This is a borrowed course from department of ${borrowed_department}` : ''

                return (
                    <>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-background2 rounded-lg overflow-hidden">
                                <img
                                    src={announcement.image}
                                    alt={announcement.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-medium text-text-primary line-clamp-1">
                                    {announcement.title}
                                </p>
                                <p className="text-text2 text-sm line-clamp-1">
                                    {announcement.description}
                                </p>
                            </div>
                        </div>
                    </>
                );
            },
        },

        { accessorKey: "category", header: "Category" },
        { accessorKey: "priority", header: "Priority" },
        {
            accessorKey: "status", header: "Status",
            cell: ({ row }: any) => {
                const announcement = row.original
                let variant, text;

                switch (announcement.isActive) {
                    case true:
                        variant = "success"; // 📘 beginner
                        text = "Active"
                        break;
                    case false:
                        variant = "error"; // ✅ intermediate
                        text = "InActive"
                        break;
                    default:
                        variant = "success";
                        text = "Active";
                        break;
                }

                return (
                    <>
                        <Badge variant={variant}>{text}</Badge>
                    </>
                );
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }: any) => {
                const announcement = row.original;


                return (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => toggleAnnouncementStatus(announcement._id, announcement.isActive)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${announcement.isActive
                                ? 'bg-error/20 text-error hover:bg-error/30'
                                : 'bg-success/20 text-success hover:bg-success/30'
                                }`}
                        >
                            {announcement.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                            onClick={() => setEditingAnnouncement(announcement)}
                            className="p-2 hover:bg-primary-10 rounded-lg transition-colors text-text2 hover:text-primary"
                        >
                            <Edit2 size={16} />
                        </button>
                        <button
                            onClick={() => deleteAnnouncement(announcement._id)}
                            className="p-2 hover:bg-error/20 rounded-lg transition-colors text-text2 hover:text-error"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                );
            },
        },

    ].filter(Boolean);


    return (
        <div className="min-h-screen bg-background p-6">
            {/* Notifications */}
            {(error || success) && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border ${error ? 'bg-error/20 border-error text-error' : 'bg-success/20 border-success text-success'
                    }`}>
                    {error || success}
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Announcements</h1>
                        <p className="text-text2 mt-2">Manage and create announcements for students</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-primary text-text-on-primary px-4 py-3 rounded-xl font-medium hover:bg-primary-hover transition-colors flex items-center gap-2"
                        disabled={saving}
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        New Announcement
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

                <StatsCard
                    label="Total Announcements"
                    value={announcements?.length ?? 0}
                    icon={<Tag size={24} />}
                    variant="primary"
                    loading={!announcements}
                />

                <StatsCard
                    label="Active"
                    value={announcements.filter(
                        a => a.isActive && new Date(a.expiresAt) > new Date()
                    ).length}
                    icon={<CheckCircle size={24} />}
                    variant="success"
                />

                <StatsCard
                    label="Expired"
                    value={announcements.filter(
                        a => new Date(a.expiresAt) <= new Date()
                    ).length}
                    icon={<Clock size={24} />}
                    variant="danger"
                />

                <StatsCard
                    label="High Priority"
                    value={announcements.filter(a => a.priority === "high").length}
                    icon={<AlertCircle size={24} />}
                    variant="warning"
                />

            </div>



            <Table
                pagination={pagination}
                columns={columns}
                data={announcements}
                enableSelection={false}
                serverMode={true}
                onServerQuery={handleServerQuery}
                enableExport={false}
                isLoading={isLoading}
                error={error}
                enableDropDown={true}
                dropDownData={[
                    { text: "Course Name", id: "name" },
                    { text: "Course Code", id: "code" },
                    { text: "Unit", id: "unit" },
                    { text: "Department", id: "department" },
                ]}
                dropDownText="Choose a filter"

            />


            {/* Empty State */}
            {/* {!loading && announcements.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-background2 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="text-text2" size={24} />
            </div>
            <h3 className="text-lg font-medium text-text-primary mb-2">No announcements found</h3>
            <p className="text-text2 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary text-text-on-primary px-6 py-2 rounded-xl font-medium hover:bg-primary-hover transition-colors"
            >
              Create Announcement
            </button>
          </div>
        )} */}

            {/* Create/Edit Modal */}
            {(isCreateModalOpen || editingAnnouncement) && (
                <AnnouncementForm
                    announcement={editingAnnouncement}
                    onClose={() => {
                        setIsCreateModalOpen(false);
                        setEditingAnnouncement(null);
                    }}
                    onSave={handleSaveAnnouncement}
                    loading={saving}
                />
            )}
        </div>
    );
};

// Announcement Form Component
const AnnouncementForm = ({
    announcement,
    onClose,
    onSave,
    loading
}: {
    announcement?: Announcement | null;
    onClose: () => void;
    onSave: (data: AnnouncementFormData) => void;
    loading: boolean;
}) => {
    const [formData, setFormData] = useState<AnnouncementFormData>({
        title: announcement?.title || '',
        description: announcement?.description || '',
        content: announcement?.content || '',
        category: announcement?.category || 'Academic',
        priority: announcement?.priority || 'medium',
        image: announcement?.image || '',
        expiresAt: announcement?.expiresAt ? new Date(announcement.expiresAt).toISOString().slice(0, 16) : '',
        isActive: announcement?.isActive ?? true,
        targetAudience: ['all'],
        tags: []
    });

    const [errors, setErrors] = useState<Partial<AnnouncementFormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<AnnouncementFormData> = {};

        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.content.trim()) newErrors.content = 'Content is required';
        if (!formData.image.trim()) newErrors.image = 'Image URL is required';
        if (!formData.expiresAt) newErrors.expiresAt = 'Expiration date is required';
        if (formData.expiresAt && new Date(formData.expiresAt) <= new Date()) {
            newErrors.expiresAt = 'Expiration date must be in the future';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface-elevated rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border">
                    <h2 className="text-xl font-bold text-text-primary">
                        {announcement ? 'Edit Announcement' : 'Create New Announcement'}
                    </h2>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`w-full px-4 py-3 bg-background2 border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-20 ${errors.title ? 'border-error' : 'border-border'
                                    }`}
                                placeholder="Enter announcement title"
                            />
                            {errors.title && <p className="text-error text-sm mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Category *
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                className="w-full px-4 py-3 bg-background2 border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-20"
                            >
                                <option value="Academic">Academic</option>
                                <option value="Financial">Financial</option>
                                <option value="Event">Event</option>
                                <option value="Accommodation">Accommodation</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Priority *
                            </label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                className="w-full px-4 py-3 bg-background2 border border-border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-20"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Expiration Date *
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.expiresAt}
                                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                className={`w-full px-4 py-3 bg-background2 border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-20 ${errors.expiresAt ? 'border-error' : 'border-border'
                                    }`}
                            />
                            {errors.expiresAt && <p className="text-error text-sm mt-1">{errors.expiresAt}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Description *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className={`w-full px-4 py-3 bg-background2 border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-20 resize-none ${errors.description ? 'border-error' : 'border-border'
                                }`}
                            placeholder="Enter brief description"
                        />
                        {errors.description && <p className="text-error text-sm mt-1">{errors.description}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Image URL *
                        </label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className={`w-full px-4 py-3 bg-background2 border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-20 ${errors.image ? 'border-error' : 'border-border'
                                }`}
                            placeholder="https://example.com/image.jpg"
                        />
                        {errors.image && <p className="text-error text-sm mt-1">{errors.image}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Content *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows={6}
                            className={`w-full px-4 py-3 bg-background2 border rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-20 resize-none ${errors.content ? 'border-error' : 'border-border'
                                }`}
                            placeholder="Enter full announcement content"
                        />
                        {errors.content && <p className="text-error text-sm mt-1">{errors.content}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="rounded border-border text-primary focus:ring-primary-20"
                        />
                        <label htmlFor="isActive" className="text-sm text-text-primary">
                            Active announcement
                        </label>
                    </div>
                </div>

                <div className="p-6 border-t border-border flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-3 border border-border text-text-primary rounded-xl hover:bg-background2 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-3 bg-primary text-text-on-primary rounded-xl font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        {announcement ? 'Update Announcement' : 'Create Announcement'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementsAdminPanel;