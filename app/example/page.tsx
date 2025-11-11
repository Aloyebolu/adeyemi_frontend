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
"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function TestChart() {
  const data = [
    { month: "Jan", registrations: 10, resultsPublished: 5 },
    { month: "Feb", registrations: 20, resultsPublished: 15 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="registrations" fill="#3b82f6" />
        <Bar dataKey="resultsPublished" fill="#f43f5e" />
      </BarChart>
    </ResponsiveContainer>
  );
}
