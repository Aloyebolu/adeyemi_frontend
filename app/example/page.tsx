// "use client"
// import { Table } from "@/components/ui/Table";
// import { useDataFetcher } from "@/lib/dataFetcher";
// import React, { useState, useEffect } from "react";
// // import { Table } from "./Table";

// export default function UserTableWrapper() {
//   const [data, setData] = useState([]);
//   const {fetchData} = useDataFetcher()
//   const [pagination, setPagination] = useState({
//     current_page: 1,
//     total_pages: 1,
//     total_items: 0,
//     limit: 10,
//   });
//   const [loading, setLoading] = useState(false);

//   // 🔥 This is the real fetch logic
//      const handleServerQuery = async (query: any) => {
//     // setLoading(true);
//     try {
//       const params = new URLSearchParams({
//         page: query.page.toString(),
//         pageSize: query.pageSize.toString(),
//         search: query.search || "",
//         sortField: query.sortField || "",
//         sortOrder: query.sortOrder || "",
//         filterId: query.filterId || "", // 🧩 from dropdown
//       });

//       const { data } = await fetchData("faculty", "POST", {
//         fields: [query.filterId],
//         search_term: query.search
//       });

//       setData(data)
//       console.log(data)
      
//       console.log( query)
      
//       // setPagination({
//       //   current_page: json.page,
//       //   total_pages: json.totalPages,
//       //   total_items: json.totalItems,
//       //   limit: query.pageSize,
//       // });
//     } catch (err) {
//       console.error("Error fetching table data:", err);
//     } finally {
//     }
//   };

//   // // 🔄 Initial load
//   // useEffect(() => {
//   //   handleServerQuery({ page: 1, pageSize: 10 });
//   // }, []);

//   return (
//     <Table
//       columns={[
//         // { accessorKey: "", header: "ID" },
//         { accessorKey: "name", header: "Name" },
//       ]}
//       data={data}
//       serverMode={true}
//       onServerQuery={handleServerQuery}
//       pagination={pagination}
//       isLoading={loading}
//       enableDropDown={true}
//       dropDownData={[
//         { text: "All Users", id: "name" },
//         { text: "Active Users", id: "1" },
//         { text: "Inactive Users", id: "2" },
//       ]}
//       dropDownText="Filter Users"
//     />
//   );
// }
// "use client";
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

// export default function TestChart() {
//   const data = [
//     { month: "Jan", registrations: 10, resultsPublished: 5 },
//     { month: "Feb", registrations: 20, resultsPublished: 15 },
//   ];

//   return (
//     <ResponsiveContainer width="100%" height={300}>
//       <BarChart data={data}>
//         <XAxis dataKey="month" />
//         <YAxis />
//         <Tooltip />
//         <Bar dataKey="registrations" fill="#3b82f6" />
//         <Bar dataKey="resultsPublished" fill="#f43f5e" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Bell, BookOpen, Calendar, CreditCard, Search } from "lucide-react";

// Mock data for the demo
const mockAnnouncements = [
  {
    id: 1,
    title: "Semester Exams Begin Next Week",
    description: "Ensure you've completed your course registrations before the exam period begins.",
    category: "Academic"
  },
  {
    id: 2, 
    title: "School Fees Payment Deadline",
    description: "Final deadline for school fees payment is March 30th, 2024.",
    category: "Financial"
  },
  {
    id: 3,
    title: "New Hostel Allocation Open",
    description: "Apply now for the 2025/2026 academic session hostel allocation.",
    category: "Accommodation"
  }
];

const StudentDemoPage = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Student Dashboard Demo
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Scroll Position: <span className="font-mono">{Math.round(scrollPosition)}px</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Refresh Demo
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Column (75% width) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Explanation Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                How Sticky Positioning Works
              </h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold text-blue-800 dark:text-blue-300">🎯 What you'll see:</p>
                  <ul className="mt-2 space-y-2 list-disc list-inside">
                    <li>The <strong>right sidebar</strong> (announcements) will <strong>stick to the top</strong> as you scroll down</li>
                    <li>It will <strong>stop sticking</strong> when it reaches the bottom of its parent container</li>
                    <li>Watch the scroll position indicator in the header</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">✅ Sticky Behavior</h3>
                    <p className="text-sm">
                      The announcements section uses <code>position: sticky</code> and <code>top-6</code> 
                      to stick 24px from the top of the viewport.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📏 Scroll Limits</h3>
                    <p className="text-sm">
                      It stops sticking when it reaches the bottom of the main content area, 
                      ensuring it doesn't overlap the footer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Long Scrollable Content */}
            <div className="space-y-6">
              {Array.from({ length: 20 }, (_, i) => (
                <ContentBlock key={i} index={i} />
              ))}
            </div>

          </div>

          {/* Sticky Sidebar Column (25% width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Sticky Announcements Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-blue-500 shadow-blue-200 dark:shadow-blue-900/30">
                <div className="bg-blue-500 text-white p-4 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <h3 className="font-bold text-lg">STICKY ANNOUNCEMENTS</h3>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">
                    This section sticks to the top as you scroll!
                  </p>
                </div>
                
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {mockAnnouncements.map((announcement) => (
                    <div 
                      key={announcement.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {announcement.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            {announcement.description}
                          </p>
                          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full mt-2">
                            {announcement.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Indicator */}
                <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Scroll down to see sticky behavior →</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <span>Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Sticky Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  {[
                    { icon: BookOpen, label: "Courses", color: "bg-blue-500" },
                    { icon: Calendar, label: "Schedule", color: "bg-green-500" },
                    { icon: CreditCard, label: "Payments", color: "bg-purple-500" },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
            <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Column (75% width) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Explanation Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                How Sticky Positioning Works
              </h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold text-blue-800 dark:text-blue-300">🎯 What you'll see:</p>
                  <ul className="mt-2 space-y-2 list-disc list-inside">
                    <li>The <strong>right sidebar</strong> (announcements) will <strong>stick to the top</strong> as you scroll down</li>
                    <li>It will <strong>stop sticking</strong> when it reaches the bottom of its parent container</li>
                    <li>Watch the scroll position indicator in the header</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">✅ Sticky Behavior</h3>
                    <p className="text-sm">
                      The announcements section uses <code>position: sticky</code> and <code>top-6</code> 
                      to stick 24px from the top of the viewport.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📏 Scroll Limits</h3>
                    <p className="text-sm">
                      It stops sticking when it reaches the bottom of the main content area, 
                      ensuring it doesn't overlap the footer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Long Scrollable Content */}
            <div className="space-y-6">
              {Array.from({ length: 20 }, (_, i) => (
                <ContentBlock key={i} index={i} />
              ))}
            </div>

          </div>

          {/* Sticky Sidebar Column (25% width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Sticky Announcements Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-blue-500 shadow-blue-200 dark:shadow-blue-900/30">
                <div className="bg-blue-500 text-white p-4 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <h3 className="font-bold text-lg">STICKY ANNOUNCEMENTS</h3>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">
                    This section sticks to the top as you scroll!
                  </p>
                </div>
                
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {mockAnnouncements.map((announcement) => (
                    <div 
                      key={announcement.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {announcement.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            {announcement.description}
                          </p>
                          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full mt-2">
                            {announcement.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Indicator */}
                <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Scroll down to see sticky behavior →</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <span>Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Sticky Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  {[
                    { icon: BookOpen, label: "Courses", color: "bg-blue-500" },
                    { icon: Calendar, label: "Schedule", color: "bg-green-500" },
                    { icon: CreditCard, label: "Payments", color: "bg-purple-500" },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
            <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Content Column (75% width) */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Explanation Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                How Sticky Positioning Works
              </h2>
              
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="font-semibold text-blue-800 dark:text-blue-300">🎯 What you'll see:</p>
                  <ul className="mt-2 space-y-2 list-disc list-inside">
                    <li>The <strong>right sidebar</strong> (announcements) will <strong>stick to the top</strong> as you scroll down</li>
                    <li>It will <strong>stop sticking</strong> when it reaches the bottom of its parent container</li>
                    <li>Watch the scroll position indicator in the header</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">✅ Sticky Behavior</h3>
                    <p className="text-sm">
                      The announcements section uses <code>position: sticky</code> and <code>top-6</code> 
                      to stick 24px from the top of the viewport.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">📏 Scroll Limits</h3>
                    <p className="text-sm">
                      It stops sticking when it reaches the bottom of the main content area, 
                      ensuring it doesn't overlap the footer.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Long Scrollable Content */}
            <div className="space-y-6">
              {Array.from({ length: 20 }, (_, i) => (
                <ContentBlock key={i} index={i} />
              ))}
            </div>

          </div>

          {/* Sticky Sidebar Column (25% width) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* Sticky Announcements Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-blue-500 shadow-blue-200 dark:shadow-blue-900/30">
                <div className="bg-blue-500 text-white p-4 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <h3 className="font-bold text-lg">STICKY ANNOUNCEMENTS</h3>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">
                    This section sticks to the top as you scroll!
                  </p>
                </div>
                
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {mockAnnouncements.map((announcement) => (
                    <div 
                      key={announcement.id}
                      className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {announcement.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                            {announcement.description}
                          </p>
                          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full mt-2">
                            {announcement.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual Indicator */}
                <div className="bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 p-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Scroll down to see sticky behavior →</span>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <span>Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Sticky Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  {[
                    { icon: BookOpen, label: "Courses", color: "bg-blue-500" },
                    { icon: Calendar, label: "Schedule", color: "bg-green-500" },
                    { icon: CreditCard, label: "Payments", color: "bg-purple-500" },
                  ].map((action, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon size={16} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {action.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer to show scroll boundary */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-lg font-semibold mb-4">🎉 You've reached the bottom!</h3>
          <p className="text-gray-300">
            Notice how the sticky sidebar stopped sticking and scrolled normally with the rest of the content.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Content block component to create scrollable content
const ContentBlock = ({ index }: { index: number }) => {
  const colors = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100'];
  const darkColors = ['dark:bg-red-900/20', 'dark:bg-blue-900/20', 'dark:bg-green-900/20', 'dark:bg-yellow-900/20', 'dark:bg-purple-900/20'];
  
  const colorIndex = index % colors.length;
  
  return (
    <div className={`${colors[colorIndex]} ${darkColors[colorIndex]} rounded-2xl p-6 border border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{index + 1}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Content Block {index + 1}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Scroll position indicator in header shows current scroll position
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span className="font-medium">Sticky Element:</span>
          <div className="text-gray-600 dark:text-gray-400 mt-1">
            Right sidebar sticks until footer
          </div>
        </div>
        
        <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span className="font-medium">Scroll Behavior:</span>
          <div className="text-gray-600 dark:text-gray-400 mt-1">
            Smooth scrolling with visual feedback
          </div>
        </div>
        
        <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <span className="font-medium">Viewport Tracking:</span>
          <div className="text-gray-600 dark:text-gray-400 mt-1">
            Real-time scroll position monitoring
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDemoPage;