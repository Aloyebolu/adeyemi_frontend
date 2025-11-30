import { useEffect, useState } from "react";
import { BookOpen, Settings, FileText, Calendar, CreditCard, TrendingUp, Clock } from "lucide-react";
import { Student, Activity, Announcement, QuickStat, SchoolFees } from "@/types/student.types";
import { useAnnouncement } from "../useAnnouncements";
import { useDataFetcher } from "@/lib/dataFetcher";
// import { useDataFetcher } from "@/hooks/useDataFetcher";

export const useStudentDashboard = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [schoolFees, setSchoolFees] = useState<SchoolFees | null>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { fetchAnnouncements, announcements } = useAnnouncement();
  const { get, fetchData } = useDataFetcher();

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!mounted) return;

      setLoading(true);
      setErrors({});

      // Individual fetch functions with their own error handling
      const fetchStudentData = async () => {
        try {
          const studentData = await fetchData<Student>("student/profile");
          if (!mounted) return;
            setStudent(studentData.data[0] || studentData.data);
        } catch (err) {
          if (!mounted) return;
          console.error("Failed to load student data:", err);
          setErrors(prev => ({ ...prev, student: err instanceof Error ? err.message : "Failed to load student data" }));
          setFallbackStudent();
        }
      };

      const fetchActivitiesData = async () => {
        try {
          const activitiesData = await get<Activity[]>("student/activities");
          if (!mounted) return;
          
          if (activitiesData.status === "success") {
            const activityIcons = {
              academic: <BookOpen size={16} />,
              system: <Settings size={16} />,
              profile: <FileText size={16} />,
              registration: <Calendar size={16} />,
              financial: <CreditCard size={16} />
            };

            const activitiesWithIcons = activitiesData.data.map(activity => ({
              ...activity,
              icon: activityIcons[activity.type as keyof typeof activityIcons] || <FileText size={16} />
            }));

            setActivities(activitiesWithIcons);
          } else {
            setErrors(prev => ({ ...prev, activities: "Failed to load activities" }));
            setFallbackActivities();
          }
        } catch (err) {
          if (!mounted) return;
          console.error("Failed to load activities:", err);
          setErrors(prev => ({ ...prev, activities: err instanceof Error ? err.message : "Failed to load activities" }));
          setFallbackActivities();
        }
      };

      const fetchSchoolFeesData = async () => {
        try {
          const feesData = await get<SchoolFees>("student/fees");
          if (!mounted) return;
          
          if (feesData.status === "success") {
            setSchoolFees(feesData.data);
          } else {
            setErrors(prev => ({ ...prev, fees: "Failed to load school fees" }));
            setFallbackSchoolFees();
          }
        } catch (err) {
          if (!mounted) return;
          console.error("Failed to load school fees:", err);
          setErrors(prev => ({ ...prev, fees: err instanceof Error ? err.message : "Failed to load school fees" }));
          setFallbackSchoolFees();
        }
      };

      const fetchQuickStatsData = async () => {
        try {
          const statsData = await get<QuickStat[]>("student/quick-stats");
          if (!mounted) return;
          
          if (statsData.status === "success") {
            const statsWithIcons = statsData.data.map(stat => {
              let icon, color;
              
              switch (stat.label.toLowerCase()) {
                case "cgpa":
                  icon = <TrendingUp size={20} />;
                  color = "text-green-600";
                  break;
                case "registered courses":
                  icon = <BookOpen size={20} />;
                  color = "text-blue-600";
                  break;
                case "fees status":
                  icon = <CreditCard size={20} />;
                  // We can't access feesData here since it's fetched separately, so we'll use a default
                  color = "text-orange-600";
                  break;
                case "attendance rate":
                  icon = <Clock size={20} />;
                  color = "text-purple-600";
                  break;
                default:
                  icon = <FileText size={20} />;
                  color = "text-gray-600";
              }

              return {
                ...stat,
                icon,
                color
              };
            });

            setQuickStats(statsWithIcons);
          } else {
            setErrors(prev => ({ ...prev, stats: "Failed to load quick stats" }));
            setFallbackQuickStats();
          }
        } catch (err) {
          if (!mounted) return;
          console.error("Failed to load quick stats:", err);
          setErrors(prev => ({ ...prev, stats: err instanceof Error ? err.message : "Failed to load quick stats" }));
          setFallbackQuickStats();
        }
      };

      // Execute all fetches concurrently but independently
      await Promise.all([
        fetchStudentData(),
        fetchActivitiesData(), 
        fetchSchoolFeesData(),
        fetchQuickStatsData(),
        fetchAnnouncements() // This one already has its own error handling
      ]);

      if (mounted) {
        setLoading(false);
      }
    };

    // Fallback data functions
    const setFallbackStudent = () => {
      const fallbackStudent: Student = {
        id: "STU2025-001",
        name: "John Doe",
        department: "Computer Science", 
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        email: "john.doe@university.edu",
        level: "400 Level",
        semester: "First Semester 2024/2025"
      };
      setStudent(fallbackStudent);
    };

    const setFallbackActivities = () => {
      const activityIcons = {
        academic: <BookOpen size={16} />,
        system: <Settings size={16} />,
        profile: <FileText size={16} />,
        registration: <Calendar size={16} />,
        financial: <CreditCard size={16} />
      };

      const fallbackActivities: Activity[] = [
        { id: "1", action: "Registered for CSC401 - Machine Learning", time: "2 hours ago", type: "registration", icon: activityIcons.registration },
        { id: "2", action: "Paid school fees - ₦150,000", time: "Yesterday", type: "financial", icon: activityIcons.financial }
      ];
      setActivities(fallbackActivities);
    };

    const setFallbackSchoolFees = () => {
      const fallbackSchoolFees: SchoolFees = {
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
      setSchoolFees(fallbackSchoolFees);
    };

    const setFallbackQuickStats = () => {
      const fallbackQuickStats: QuickStat[] = [
        { label: "CGPA", value: "3.75", change: "+0.15", icon: <TrendingUp size={20} />, color: "text-green-600" },
        { label: "Registered Courses", value: "6/6", change: "100%", icon: <BookOpen size={20} />, color: "text-blue-600" },
        { label: "Fees Status", value: "80%", change: "", icon: <CreditCard size={20} />, color: "text-orange-600" },
        { label: "Attendance Rate", value: "78%", change: "-2", icon: <Clock size={20} />, color: "text-purple-600" }
      ];
      setQuickStats(fallbackQuickStats);
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
    loading,
    errors
  };
};