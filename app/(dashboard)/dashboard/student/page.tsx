// // StudentMain.tsx
// "use client";

// import { useEffect, useState } from "react";
// import theme from "@/styles/theme";
// import Image from "next/image";
// import { 
//   BookOpen, 
//   Eye, 
//   Calendar, 
//   FileText, 
//   Settings, 
//   Bell, 
//   Search,
//   TrendingUp,
//   Clock,
//   ChevronRight,
//   Bookmark,
//   Share2,
//   CreditCard,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   Download
// } from "lucide-react";

// interface Student {
//   id: string;
//   name: string;
//   department: string;
//   photo: string;
//   email: string;
//   level: string;
//   semester: string;
// }

// interface Activity {
//   id: string;
//   action: string;
//   time: string;
//   type: 'academic' | 'system' | 'profile' | 'registration' | 'financial';
//   icon: React.ReactNode;
// }

// interface Announcement {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   date: string;
//   category: string;
//   priority: 'high' | 'medium' | 'low';
// }

// interface QuickStat {
//   label: string;
//   value: string;
//   change?: string;
//   icon: React.ReactNode;
//   color: string;
// }

// interface SchoolFees {
//   amount: number;
//   paid: number;
//   balance: number;
//   status: 'paid' | 'partial' | 'pending' | 'overdue';
//   dueDate: string;
//   lastPaymentDate?: string;
//   breakdown: {
//     tuition: number;
//     accommodation: number;
//     medical: number;
//     library: number;
//     sports: number;
//     technology: number;
//     other: number;
//   };
//   paymentHistory: {
//     date: string;
//     amount: number;
//     method: string;
//     reference: string;
//   }[];
// }

// // Custom hook for sticky behavior
// const useSticky = () => {
//   const [isSticky, setIsSticky] = useState(false);
//   const elementRef = useState<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (elementRef.current) {
//         const rect = elementRef.current.getBoundingClientRect();
//         setIsSticky(rect.top <= 24); // 24px from top (matching top-6)
//       }
//     };

//     window.addEventListener('scroll', handleScroll, { passive: true });
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return [elementRef, isSticky] as const;
// };

// const StudentMain = () => {
//   const [student, setStudent] = useState<Student | null>(null);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [announcements, setAnnouncements] = useState<Announcement[]>([]);
//   const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
//   const [schoolFees, setSchoolFees] = useState<SchoolFees | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeCategory, setActiveCategory] = useState("all");
//   const [showFeesBreakdown, setShowFeesBreakdown] = useState(false);
//   const [stickyRef, isSticky] = useSticky();

//   useEffect(() => {
//     let mounted = true;
    
//     const loadData = async () => {
//       // Mock student data
//       const mockStudent: Student = {
//         id: "STU2025-001",
//         name: "John Doe",
//         department: "Computer Science",
//         photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//         email: "john.doe@university.edu",
//         level: "400 Level",
//         semester: "First Semester 2024/2025"
//       };

//       // Activity icons
//       const activityIcons = {
//         academic: <BookOpen size={16} />,
//         system: <Settings size={16} />,
//         profile: <FileText size={16} />,
//         registration: <Calendar size={16} />,
//         financial: <CreditCard size={16} />
//       };

//       const mockActivities: Activity[] = [
//         { id: "1", action: "Registered for CSC401 - Machine Learning", time: "2 hours ago", type: "registration", icon: activityIcons.registration },
//         { id: "2", action: "Paid school fees - ₦150,000", time: "Yesterday", type: "financial", icon: activityIcons.financial },
//         { id: "3", action: "Checked Exam Timetable for Final Exams", time: "Yesterday", type: "academic", icon: activityIcons.academic },
//         { id: "4", action: "Viewed Results for 2nd Semester 2023/2024", time: "3 days ago", type: "academic", icon: activityIcons.academic },
//         { id: "5", action: "Updated Profile Information", time: "1 week ago", type: "profile", icon: activityIcons.profile },
//         { id: "6", action: "Made partial fees payment - ₦50,000", time: "2 weeks ago", type: "financial", icon: activityIcons.financial },
//       ];

      // const mockAnnouncements: Announcement[] = [
      //   {
      //     id: "1",
      //     title: "Semester Exams Begin Next Week 📚",
      //     description: "Ensure you've completed your course registrations before the exam period begins. Check your timetable for specific dates.",
      //     image: "https://images.unsplash.com/photo-1600195077075-7c9b2e94b9c7?w=400&h=300&fit=crop",
      //     date: "2024-03-15",
      //     category: "Academic",
      //     priority: "high"
      //   },
      //   {
      //     id: "2",
      //     title: "School Fees Payment Deadline 🗓️",
      //     description: "Final deadline for school fees payment is March 30th, 2024. Late payments will attract penalties.",
      //     image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
      //     date: "2024-03-10",
      //     category: "Financial",
      //     priority: "high"
      //   },
      //   {
      //     id: "3",
      //     title: "New Hostel Allocation Open 🏠",
      //     description: "Apply now for the 2025/2026 academic session hostel allocation. Deadline is March 30th.",
      //     image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&h=300&fit=crop",
      //     date: "2024-03-10",
      //     category: "Accommodation",
      //     priority: "medium"
      //   },
      //   {
      //     id: "4",
      //     title: "Tech Fest 2025 🚀",
      //     description: "Join us for workshops, hackathons, and networking sessions at Tech Fest. Register by March 25th.",
      //     image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
      //     date: "2024-03-05",
      //     category: "Event",
      //     priority: "low"
      //   },
      // ];

//       const mockSchoolFees: SchoolFees = {
//         amount: 250000,
//         paid: 200000,
//         balance: 50000,
//         status: 'partial',
//         dueDate: '2024-03-30',
//         lastPaymentDate: '2024-03-10',
//         breakdown: {
//           tuition: 180000,
//           accommodation: 40000,
//           medical: 10000,
//           library: 8000,
//           sports: 5000,
//           technology: 5000,
//           other: 2000
//         },
//         paymentHistory: [
//           {
//             date: '2024-03-10',
//             amount: 150000,
//             method: 'Bank Transfer',
//             reference: 'REF789012'
//           },
//           {
//             date: '2024-02-15',
//             amount: 50000,
//             method: 'Online Payment',
//             reference: 'REF345678'
//           }
//         ]
//       };

//       const mockQuickStats: QuickStat[] = [
//         {
//           label: "CGPA",
//           value: "3.75",
//           change: "+0.15",
//           icon: <TrendingUp size={20} />,
//           color: "text-green-600"
//         },
//         {
//           label: "Registered Courses",
//           value: "6/6",
//           change: "100%",
//           icon: <BookOpen size={20} />,
//           color: "text-blue-600"
//         },
//         {
//           label: "Fees Status",
//           value: mockSchoolFees.status === 'paid' ? "Paid" : `${Math.round((mockSchoolFees.paid / mockSchoolFees.amount) * 100)}%`,
//           change: "",
//           icon: <CreditCard size={20} />,
//           color: mockSchoolFees.status === 'paid' ? "text-green-600" : mockSchoolFees.status === 'partial' ? "text-orange-600" : "text-red-600"
//         },
//         {
//           label: "Attendance Rate",
//           value: "78%",
//           change: "-2",
//           icon: <Clock size={20} />,
//           color: "text-purple-600"
//         }
//       ];

//       // Simulate network delay
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       if (!mounted) return;
      
//       setStudent(mockStudent);
//       setActivities(mockActivities);
//       setAnnouncements(mockAnnouncements);
//       setQuickStats(mockQuickStats);
//       setSchoolFees(mockSchoolFees);
//     };

//     loadData();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-NG', {
//       style: 'currency',
//       currency: 'NGN'
//     }).format(amount);
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'paid':
//         return <CheckCircle size={16} className="text-green-600" />;
//       case 'partial':
//         return <AlertTriangle size={16} className="text-orange-600" />;
//       case 'pending':
//         return <Clock size={16} className="text-yellow-600" />;
//       case 'overdue':
//         return <XCircle size={16} className="text-red-600" />;
//       default:
//         return <Clock size={16} className="text-gray-600" />;
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'paid':
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
//       case 'partial':
//         return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
//       case 'pending':
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
//       case 'overdue':
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
//     }
//   };

//   const filteredAnnouncements = announcements.filter(announcement => 
//     activeCategory === "all" || announcement.category === activeCategory
//   );

//   if (!student || !schoolFees) {
//     return (
//       <div className="flex-1 p-6 flex justify-center items-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//           <p className="text-gray-500 dark:text-gray-400">Loading student dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto">
//       {/* Header with Search and Notifications */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Dashboard</h1>
//           <p className="text-gray-600 dark:text-gray-400">Welcome back, {student.name}</p>
//         </div>
//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <div className="relative flex-1 sm:flex-initial">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search announcements..."
//               className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <button className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//             <Bell size={20} className="text-gray-600 dark:text-gray-400" />
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Student Info and Quick Actions */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Welcome Card with Stats */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//             <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
//               <div className="w-20 h-20 rounded-full overflow-hidden relative border-4 border-white dark:border-gray-800 shadow-lg">
//                 <Image
//                   src={student.photo}
//                   alt="Profile"
//                   fill
//                   className="object-cover"
//                   sizes="80px"
//                   priority
//                 />
//               </div>
//               <div className="flex-1">
//                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
//                   {student.name}
//                 </h2>
//                 <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
//                   <span>🎓 {student.department}</span>
//                   <span>📊 {student.level}</span>
//                   <span>📅 {student.semester}</span>
//                 </div>
//                 <p className="text-gray-500 dark:text-gray-400 text-sm">
//                   {student.email} • {student.id}
//                 </p>
//               </div>
//             </div>
            
//             {/* Quick Stats */}
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
//               {quickStats.map((stat, index) => (
//                 <div key={index} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xs">
//                   <div className={`flex justify-center items-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 mx-auto mb-2 ${stat.color}`}>
//                     {stat.icon}
//                   </div>
//                   <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
//                   {stat.change && (
//                     <div className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ?'text-error' : 'text-gray-500'}`}>
//                       {stat.change}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* School Fees Card */}
// // School Fees Card with Enhanced Progress Bar
// <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//   <div className="flex justify-between items-start mb-6">
//     <div>
//       <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//         <CreditCard size={20} />
//         School Fees Status
//       </h3>
//       <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//         Due Date: {new Date(schoolFees.dueDate).toLocaleDateString()}
//       </p>
//     </div>
//     <div className="flex items-center gap-2">
//       <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schoolFees.status)} flex items-center gap-1`}>
//         {getStatusIcon(schoolFees.status)}
//         {schoolFees.status.charAt(0).toUpperCase() + schoolFees.status.slice(1)}
//       </span>
//     </div>
//   </div>

//   {/* Enhanced Fees Progress */}
//   <div className="mb-6">
//     <div className="flex justify-between items-center mb-3">
//       <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//         Payment Progress
//       </span>
//       <div className="flex items-center gap-2">
//         <span className="text-sm text-gray-600 dark:text-gray-400">
//           {Math.round((schoolFees.paid / schoolFees.amount) * 100)}%
//         </span>
//         <span className="text-sm text-gray-500 dark:text-gray-400">
//           ({formatCurrency(schoolFees.paid)} of {formatCurrency(schoolFees.amount)})
//         </span>
//       </div>
//     </div>
    
//     {/* Enhanced Progress Bar */}
//     <div className="relative">
//       {/* Background Track */}
//       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
//         {/* Animated Progress Fill */}
//         <div 
//           className={`h-4 rounded-full relative overflow-hidden transition-all duration-1000 ease-out ${
//             schoolFees.status === 'paid' ? 'bg-gradient-to-r from-green-500 to-green-600' :
//             schoolFees.status === 'partial' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
//             schoolFees.status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
//             'bg-gradient-to-r from-yellow-500 to-yellow-600'
//           }`}
//           style={{ 
//             width: `${(schoolFees.paid / schoolFees.amount) * 100}%`,
//             transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
//           }}
//         >
//           {/* Shimmer Animation */}
//           <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          
//           {/* Progress Pulse Effect */}
//           <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg animate-pulse"></div>
//         </div>
//       </div>
      
//       {/* Progress Markers */}
//       <div className="flex justify-between mt-2 px-1">
//         {[0, 25, 50, 75, 100].map((marker) => (
//           <div key={marker} className="flex flex-col items-center">
//             <div 
//               className={`w-1 h-1 rounded-full ${
//                 (schoolFees.paid / schoolFees.amount) * 100 >= marker 
//                   ? 'bg-current' 
//                   : 'bg-gray-300 dark:bg-gray-600'
//               }`}
//             ></div>
//             <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//               {marker}%
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>

//     {/* Enhanced Stats Cards */}
//     <div className="grid grid-cols-3 gap-4 mt-6">
//       <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transform hover:scale-105 transition-transform duration-200">
//         <div className="text-lg font-bold text-red-500 dark:text-red-400 animate-pulse">
//           {formatCurrency(schoolFees.balance)}
//         </div>
//         <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Balance Due</div>
//         {schoolFees.balance > 0 && (
//           <div className="text-xs text-red-500 mt-1 animate-bounce">
//             ⚠️ Pay Now
//           </div>
//         )}
//       </div>
      
//       <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transform hover:scale-105 transition-transform duration-200">
//         <div className="text-lg font-bold text-green-500 dark:text-green-400">
//           {formatCurrency(schoolFees.paid)}
//         </div>
//         <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Amount Paid</div>
//         {schoolFees.paid > 0 && (
//           <div className="text-xs text-green-500 mt-1">
//             ✓ {Math.round((schoolFees.paid / schoolFees.amount) * 100)}% Complete
//           </div>
//         )}
//       </div>
      
//       <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transform hover:scale-105 transition-transform duration-200">
//         <div className="text-lg font-bold text-blue-500 dark:text-blue-400">
//           {formatCurrency(schoolFees.amount)}
//         </div>
//         <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total Fees</div>
//         <div className="text-xs text-blue-500 mt-1">
//           {schoolFees.dueDate && new Date(schoolFees.dueDate) > new Date() ? (
//             `Due in ${Math.ceil((new Date(schoolFees.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`
//           ) : 'Past Due'}
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Enhanced Fees Actions */}
//   <div className="flex gap-3 mb-6">
//     <button className="flex-1 bg-primary text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
//       <CreditCard size={18} />
//       Pay Fees Now
//     </button>
//     <button 
//       className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
//       onClick={() => setShowFeesBreakdown(!showFeesBreakdown)}
//     >
//       <FileText size={18} />
//       {showFeesBreakdown ? 'Hide Breakdown' : 'View Breakdown'}
//     </button>
//     <button className="px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105">
//       <Download size={18} />
//     </button>
//   </div>

//   {/* Enhanced Fees Breakdown with Animation */}
//   <div className={`overflow-hidden transition-all duration-500 ${
//     showFeesBreakdown ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
//   }`}>
//     <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
//       <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//         <FileText size={18} />
//         Fees Breakdown
//       </h4>
      
//       {/* Animated Breakdown Items */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         {Object.entries(schoolFees.breakdown).map(([key, value], index) => (
//           <div 
//             key={key}
//             className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
//             style={{
//               animationDelay: `${index * 100}ms`,
//               animation: 'slideInUp 0.5s ease-out forwards'
//             }}
//           >
//             <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize flex items-center gap-2">
//               <div 
//                 className="w-2 h-2 rounded-full"
//                 style={{
//                   backgroundColor: `hsl(${index * 45}, 70%, 50%)`
//                 }}
//               ></div>
//               {key}
//             </span>
//             <span className="font-bold text-gray-900 dark:text-white">
//               {formatCurrency(value)}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Enhanced Payment History */}
//       <div className="mt-6">
//         <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//           <Clock size={18} />
//           Payment History
//         </h4>
//         <div className="space-y-3">
//           {schoolFees.paymentHistory.map((payment, index) => (
//             <div 
//               key={index}
//               className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 border-l-4 border-green-500"
//               style={{
//                 animationDelay: `${index * 150}ms`,
//                 animation: 'slideInRight 0.5s ease-out forwards'
//               }}
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
//                   <CreditCard size={16} className="text-green-600 dark:text-green-400" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-gray-900 dark:text-white">
//                     {formatCurrency(payment.amount)}
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     {new Date(payment.date).toLocaleDateString()} • {payment.method}
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-bold text-green-600 flex items-center gap-1 justify-end">
//                   <CheckCircle size={14} />
//                   Completed
//                 </p>
//                 <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
//                   {payment.reference}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
//           {/* Quick Actions Grid */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
//               <Settings size={20} />
//               Quick Actions
//             </h3>
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//               {[
//                 { icon: <BookOpen size={24} />, label: "Course Registration", color: "bg-blue-500" },
//                 { icon: <Eye size={24} />, label: "View Results", color: "bg-green-500" },
//                 { icon: <Calendar size={24} />, label: "Exam Timetable", color: "bg-orange-500" },
//                 { icon: <CreditCard size={24} />, label: "Pay Fees", color: "bg-purple-500" },
//               ].map((action, index) => (
//                 <button
//                   key={index}
//                   className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
//                 >
//                   <div className={`p-3 rounded-lg ${action.color} text-white mb-2 group-hover:scale-110 transition-transform`}>
//                     {action.icon}
//                   </div>
//                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
//                     {action.label}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                 <Clock size={20} />
//                 Recent Activity
//               </h3>
//               <button className="text-sm text-primary hover:text-primary/80 font-medium">
//                 View All
//               </button>
//             </div>
//             <div className="space-y-3">
//               {activities.map((activity) => (
//                 <div
//                   key={activity.id}
//                   className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
//                 >
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
//                     {activity.icon}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
//                       {activity.action}
//                     </p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                       {activity.time}
//                     </p>
//                   </div>
//                   <ChevronRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Right Column - Sticky Announcements */}
//         <div className="space-y-6">
//           {/* Sticky Container */}
//           <div 
//             ref={stickyRef}
//             className="sticky top-6 space-y-6 transition-all duration-200"
//           >
//             {/* Announcements with Filter */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
//                   <Bell size={20} />
//                   Announcements
//                 </h3>
//                 <div className="flex gap-1">
//                   {["all", "Academic", "Financial", "Event", "Accommodation"].map((category) => (
//                     <button
//                       key={category}
//                       className={`px-3 py-1 text-xs rounded-full transition-colors ${
//                         activeCategory === category
//                           ? "bg-primary text-white"
//                           : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
//                       }`}
//                       onClick={() => setActiveCategory(category)}
//                     >
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
//                 {filteredAnnouncements.map((announcement) => (
//                   <div
//                     key={announcement.id}
//                     className="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
//                   >
//                     <div className="relative h-40 overflow-hidden">
//                       <Image
//                         src={announcement.image}
//                         alt={announcement.title}
//                         fill
//                         className="object-cover transition-transform group-hover:scale-105"
//                         placeholder="blur"
//                         blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk9SQHLJtw=="
//                       />
//                       <div className="absolute top-3 left-3">
//                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           announcement.priority === 'high' 
//                             ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
//                             : announcement.priority === 'medium'
//                             ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
//                             : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//                         }`}>
//                           {announcement.category}
//                         </span>
//                       </div>
//                       <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
//                         <button className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">
//                           <Bookmark size={14} />
//                         </button>
//                         <button className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-colors">
//                           <Share2 size={14} />
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div className="p-4">
//                       <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
//                         {announcement.title}
//                       </h4>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
//                         {announcement.description}
//                       </p>
//                       <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
//                         <span>{new Date(announcement.date).toLocaleDateString()}</span>
//                         <button className="text-primary hover:text-primary/80 font-medium flex items-center gap-1">
//                           Read More
//                           <ChevronRight size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Upcoming Deadlines */}
//             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
//                 Upcoming Deadlines
//               </h3>
//               <div className="space-y-3">
//                 {[
//                   { task: "School Fees Payment", due: "Mar 30, 2024", urgent: schoolFees.balance > 0 },
//                   { task: "Course Registration", due: "Mar 20, 2024", urgent: true },
//                   { task: "Hostel Application", due: "Mar 30, 2024", urgent: false },
//                   { task: "Tech Fest Registration", due: "Mar 25, 2024", urgent: false },
//                 ].map((deadline, index) => (
//                   <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         {deadline.task}
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">
//                         Due: {deadline.due}
//                       </p>
//                     </div>
//                     {deadline.urgent && (
//                       <span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs rounded-full font-medium">
//                         Urgent
//                       </span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Custom Scrollbar Styles */}
//       <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f5f9;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #cbd5e1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #94a3b8;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-track {
//           background: #374151;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #4b5563;
//         }
//         .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #6b7280;
//         }
//       `}</style>
//     </main>
//   );
// };

// export default StudentMain;

import { StudentMain } from '@/components/students';

export default function StudentPage() {
  return <StudentMain />;
}