"use client";

import React, { useEffect, useState } from "react";
// import axios from "axios";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { CheckCircle, UserPlus, UserMinus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import toast from "react-hot-toast";

// =============================================================
// 🧠 TYPES
// =============================================================
interface Lecturer {
  _id: string;
  name: string;
  email: string;
  department?: string;
}

interface CourseAssignment {
  courseId: string;
  lecturers: Lecturer[];
}

// =============================================================
// 🧩 MOCK DATA (fallback when API not reachable)
// =============================================================
const mockLecturers: Lecturer[] = [
  { _id: "1", name: "Dr. Chidi Okafor", email: "chidi.okafor@university.edu" },
  { _id: "2", name: "Prof. Grace Adeoye", email: "grace.adeoye@university.edu" },
  { _id: "3", name: "Mr. Ibrahim Yusuf", email: "ibrahim.yusuf@university.edu" },
  { _id: "4", name: "Mrs. Ngozi Eze", email: "ngozi.eze@university.edu" },
  { _id: "5", name: "Dr. Aisha Mohammed", email: "aisha.mohammed@university.edu" },
];

// =============================================================
// 🧩 COMPONENT
// =============================================================
const CourseAssignmentPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const courseId = params.id;

  const [availableLecturers, setAvailableLecturers] = useState<Lecturer[]>([]);
  const [assignedLecturers, setAssignedLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiMode, setApiMode] = useState<boolean>(false); // false = use mock data

  // =============================================================
  // 🚀 Fetch Lecturers (API or Mock)
  // =============================================================
  const fetchLecturers = async () => {
    try {
      setLoading(true);

      if (apiMode) {
        // const { data } = await axios.get("/api/lecturers");
        setAvailableLecturers(data.data || []);
      } else {
        setAvailableLecturers(mockLecturers);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch lecturers");
      setAvailableLecturers(mockLecturers);
    } finally {
      setLoading(false);
    }
  };

  // =============================================================
  // 🚀 Fetch Assigned Lecturers
  // =============================================================
  const fetchAssigned = async () => {
    try {
      if (apiMode) {
        // const { data } = await axios.get(`/api/course/${courseId}/assignments`);
        setAssignedLecturers(data.data?.lecturers || []);
      } else {
        // Mock assigned data
        setAssignedLecturers([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch assigned lecturers");
    }
  };

  // =============================================================
  // 🧩 Assign Lecturer to Course
  // =============================================================
  const assignLecturer = async (lecturer: Lecturer) => {
    try {
      setAssignedLecturers((prev) => [...prev, lecturer]);
      setAvailableLecturers((prev) => prev.filter((l) => l._id !== lecturer._id));

      if (apiMode) {
        // await axios.post(`/api/course/${courseId}/assign`, { lecturerId: lecturer._id });
      }

      toast.success(`${lecturer.name} assigned successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to assign lecturer");
    }
  };

  // =============================================================
  // 🧩 Remove Lecturer
  // =============================================================
  const removeLecturer = async (lecturer: Lecturer) => {
    try {
      setAvailableLecturers((prev) => [...prev, lecturer]);
      setAssignedLecturers((prev) => prev.filter((l) => l._id !== lecturer._id));

      if (apiMode) {
        // await axios.delete(`/api/course/${courseId}/assign/${lecturer._id}`);
      }

      toast.success(`${lecturer.name} removed successfully`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove lecturer");
    }
  };

  // =============================================================
  // 🧩 Handle Drag & Drop
  // =============================================================
  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    const dragged = availableLecturers.find((lec) => lec._id === draggableId);
    if (!dragged) return;

    if (destination.droppableId === "assigned") {
      assignLecturer(dragged);
    }
  };

  // =============================================================
  // 🧩 Load Data on Mount
  // =============================================================
  useEffect(() => {
    fetchLecturers();
    fetchAssigned();
  }, []);

  // =============================================================
  // ✨ UI Renderers
  // =============================================================
  const renderLecturerCard = (lecturer: Lecturer, index: number, assigned: boolean) => (
    <Draggable draggableId={lecturer._id} index={index} key={lecturer._id} isDragDisabled={assigned}>
      {(provided) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          whileHover={{ scale: 1.02 }}
          className={`flex items-center justify-between rounded-2xl p-3 mb-2 border ${
            assigned
              ? "bg-green-50 border-green-400 opacity-75 cursor-not-allowed"
              : "bg-white border-gray-200 shadow-sm"
          }`}
        >
          <div>
            <p className="font-semibold text-gray-800">{lecturer.name}</p>
            <p className="text-sm text-gray-500">{lecturer.email}</p>
          </div>

          {assigned ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => assignLecturer(lecturer)}
            >
              <UserPlus size={18} />
            </Button>
          )}
        </motion.div>
      )}
    </Draggable>
  );

  const renderAssignedCard = (lecturer: Lecturer, index: number) => (
    <motion.div
      key={lecturer._id}
      whileHover={{ scale: 1.02 }}
      className="flex items-center justify-between bg-green-100 border border-green-300 rounded-2xl p-3 mb-2 shadow-sm"
    >
      <div>
        <p className="font-semibold text-green-900">{lecturer.name}</p>
        <p className="text-sm text-green-700">{lecturer.email}</p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => removeLecturer(lecturer)}
      >
        <UserMinus size={18} className="text-red-600" />
      </Button>
    </motion.div>
  );

  // =============================================================
  // 🧩 RENDER
  // =============================================================
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-blue-500" size={30} />
        </div>
      )}

      {!loading && (
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Available Lecturers */}
          <Droppable droppableId="available">
            {(provided) => (
              <Card
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="backdrop-blur-xl bg-white/70 shadow-xl border border-gray-100 rounded-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">
                    Available Lecturers
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {availableLecturers.length === 0 && (
                    <p className="text-gray-500 text-sm">No available lecturers</p>
                  )}

                  {availableLecturers.map((lec, index) =>
                    renderLecturerCard(lec, index, false)
                  )}

                  {provided.placeholder}
                </CardContent>
              </Card>
            )}
          </Droppable>

          {/* Assigned Lecturers */}
          <Droppable droppableId="assigned">
            {(provided) => (
              <Card
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="backdrop-blur-xl bg-green-50/70 shadow-xl border border-green-200 rounded-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-700">
                    Assigned Lecturers
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  {assignedLecturers.length === 0 && (
                    <p className="text-gray-500 text-sm">No lecturers assigned</p>
                  )}

                  {assignedLecturers.map((lec, index) =>
                    renderAssignedCard(lec, index)
                  )}

                  {provided.placeholder}
                </CardContent>
              </Card>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Bottom Control */}
      <div className="col-span-2 flex justify-between mt-6">
        <Button
          variant={apiMode ? "destructive" : "secondary"}
          onClick={() => setApiMode(!apiMode)}
        >
          {apiMode ? "Switch to Mock Mode" : "Switch to API Mode"}
        </Button>

        <Button
          variant="default"
          onClick={() => toast.success("Assignments Saved Successfully!")}
        >
          Save Assignments
        </Button>
      </div>
    </div>
  );
};

export default CourseAssignmentPage;
