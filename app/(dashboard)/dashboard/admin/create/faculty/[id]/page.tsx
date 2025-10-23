"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/Tooltip";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useFaculty } from "@/hooks/useFaculty";
import { usePage } from "@/hooks/usePage";

interface Department {
  _id: string;
  name: string;
  code: string;
  hod: string | null;
}

interface FacultyData {
  _id: string;
  name: string;
  code: string;
  dep_count: number;
  recent_departments: Department[];
  created_by_name: string;
}

interface PageProps {
  params: { id: string };
}

export default function FacultyPage({ params }: PageProps) {
  const { id } = params;
  const { getDepById } = useFaculty();
  const [faculty, setFaculty] = useState<FacultyData | null>(null);
  const [loading, setLoading] = useState(true);
  const {setPage}= usePage()

  useEffect(() => {
    async function fetchFaculty() {
      setLoading(true);
      const data = await getDepById(id);
      setPage(`Faculty of ${data?.[0]?.name || ''}`)
      setFaculty(data?.[0] || null);
      setLoading(false);
    }
    fetchFaculty();
  }, [id]);

  if (loading) return <p className="text-gray-500 p-4">Loading faculty...</p>;
  if (!faculty) return <p className="text-red-500 p-4">Faculty not found</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Faculty Header */}
<div className="bg-white shadow-sm rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
  <div>
    <h1 className="text-4xl font-bold text-indigo-700">{faculty.name}</h1>
    <p className="text-gray-500 mt-1">Code: <span className="font-medium">{faculty.code}</span></p>
    <p className="text-gray-600 mt-1">Created by: <span className="font-medium">{faculty.created_by_name}</span></p>
    <p className="text-gray-600 mt-1">Total Departments: <span className="font-medium">{faculty.dep_count}</span></p>
  </div>

  <div className="flex space-x-3 mt-4 sm:mt-0">
    <Button variant="primary">
      View Details
    </Button>
    <Button variant="outline">
      Edit Faculty
    </Button>
  </div>
</div>


      {/* Departments Section */}
      <h2 className="text-2xl font-semibold text-gray-700">Recent Departments</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.recent_departments.map((dep) => (
          <div
            key={dep._id}
            className={`border rounded-lg p-4 shadow-sm transition hover:shadow-md ${
              !dep.hod ? "bg-yellow-50" : "bg-white"
            }`}
          >
            <h3 className="text-lg font-semibold text-blue-600">
              <Link href={`/departments/${dep._id}`} className="hover:underline">
                {dep.name} ({dep.code})
              </Link>
            </h3>

            <p className="mt-2 text-gray-600">
              HOD:{" "}
              {dep.hod ? (
                <Link href={`/lecturers/${dep.hod}`} className="text-indigo-600 hover:underline">
                  View HOD
                </Link>
              ) : (
                <span className="text-red-500 italic">No HOD assigned</span>
              )}
            </p>

            {/* Actions */}
            <div className="flex mt-4 space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => console.log("Edit", dep)}
                    disabled={!dep.hod}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {dep.hod ? "Edit Department" : "Assign a HOD first"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => console.log("Delete", dep)}
                    disabled={!dep.hod}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {dep.hod ? "Delete Department" : "Assign a HOD first"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => console.log("Assign HOD", dep)}
                    disabled={!!dep.hod}
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {dep.hod ? "HOD already assigned" : "Assign HOD"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
