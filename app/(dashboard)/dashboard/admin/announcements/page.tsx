import AnnouncementsAdminPanel from '@/components/admin/AnnouncementsAdminPanel';

// This would typically fetch data from your API
const mockAnnouncements = [
  {
    _id: '1',
    title: 'Final Exam Schedule Released',
    description: 'The final exam schedule for Spring 2024 has been published',
    category: 'Academic',
    priority: 'high',
    image: '/api/placeholder/400/200',
    date: '2024-01-15',
    expiresAt: '2024-02-15',
    isActive: true,
    createdBy: {
      name: 'Dr. Smith',
      email: 'smith@university.edu'
    }
  },
  {
    _id: '2',
    title: 'Scholarship Applications Open',
    description: 'Apply for merit-based scholarships for the upcoming semester',
    category: 'Financial',
    priority: 'medium',
    image: '/api/placeholder/400/200',
    date: '2024-01-10',
    expiresAt: '2024-01-30',
    isActive: true,
    createdBy: {
      name: 'Financial Aid Office',
      email: 'finaid@university.edu'
    }
  }
];

export default function AdminAnnouncementsPage() {
  return (
    <div>
      <AnnouncementsAdminPanel initialAnnouncements={mockAnnouncements} />
    </div>
  );
}