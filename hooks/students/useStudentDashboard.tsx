import { useEffect, useState } from "react";
import { BookOpen, Settings, FileText, Calendar, CreditCard, TrendingUp, Clock } from "lucide-react";
import { Student, Activity, Announcement, QuickStat, SchoolFees } from "@/types/student.types";
import { useAnnouncement } from "../useAnnouncements";

export const useStudentDashboard = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [schoolFees, setSchoolFees] = useState<SchoolFees | null>(null);
  const [loading, setLoading] = useState(true);

  const { fetchAnnouncements, announcements } = useAnnouncement();

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      // Mock student
      const mockStudent: Student = {
        id: "STU2025-001",
        name: "John Doe",
        department: "Computer Science",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        email: "john.doe@university.edu",
        level: "400 Level",
        semester: "First Semester 2024/2025"
      };

      const activityIcons = {
        academic: <BookOpen size={16} />,
        system: <Settings size={16} />,
        profile: <FileText size={16} />,
        registration: <Calendar size={16} />,
        financial: <CreditCard size={16} />
      };

      const mockActivities: Activity[] = [
        { id: "1", action: "Registered for CSC401 - Machine Learning", time: "2 hours ago", type: "registration", icon: activityIcons.registration },
        { id: "2", action: "Paid school fees - ₦150,000", time: "Yesterday", type: "financial", icon: activityIcons.financial }
      ];

      const mockSchoolFees: SchoolFees = {
        amount: 250000,
        paid: 200000,
        balance: 50000,
        status: 'partial',
        dueDate: '2024-03-30',
        lastPaymentDate: '2024-03-10',
        breakdown: {
          tuition: 180000,
          accommodation: 40000,
          medical: 10000,
          library: 8000,
          sports: 5000,
          technology: 5000,
          other: 2000
        },
        paymentHistory: [
          { date: '2024-03-10', amount: 150000, method: "bank_transfer", reference: 'REF789012' },
          { date: '2024-01-10', amount: 320000, method: "online_payment", reference: 'REF3429012', status: "failed" },
          { date: '2024-01-10', amount: 32000000, method: "stripe", reference: 'REF3429012', status: "pending" }
        ]
      };

      const mockQuickStats: QuickStat[] = [
        { label: "CGPA", value: "3.75", change: "+0.15", icon: <TrendingUp size={20} />, color: "text-green-600" },
        { label: "Registered Courses", value: "6/6", change: "100%", icon: <BookOpen size={20} />, color: "text-blue-600" },
        { label: "Fees Status", value: mockSchoolFees.status === 'paid' ? "Paid" : `${Math.round((mockSchoolFees.paid / mockSchoolFees.amount) * 100)}%`, change: "", icon: <CreditCard size={20} />, color: mockSchoolFees.status === 'paid' ? "text-green-600" : mockSchoolFees.status === 'partial' ? "text-orange-600" : "text-red-600" },
        { label: "Attendance Rate", value: "78%", change: "-2", icon: <Clock size={20} />, color: "text-purple-600" }
      ];

      // Simulate async delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!mounted) return;

      setStudent(mockStudent);
      setActivities(mockActivities);
      setQuickStats(mockQuickStats);
      setSchoolFees(mockSchoolFees);

      // Fetch announcements from hook
      fetchAnnouncements();

      setLoading(false);
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    student,
    activities,
    announcements,
    quickStats,
    schoolFees,
    loading
  };
};
