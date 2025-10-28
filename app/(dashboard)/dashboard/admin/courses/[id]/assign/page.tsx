// app/course/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import useStudents, { Lecturer } from "@/hooks/useStudents";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { CheckCircle, UserPlus, UserMinus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import toast from "react-hot-toast";
import { useNotifications } from "@/hooks/useNotification";

interface Props {
  params: { id: string };
}

export default function CourseAssignmentPage({ params }: Props) {
    const resolvedParams = React.use(params); 
  const {id} = resolvedParams;
  const courseId = id;
  const {
    available,
    assigned,
    loading,
    error,
    fetchLecturers,
    fetchAssignedForCourse,
    assignLecturerToCourse,
    removeLecturerFromCourse,
    saveAssignments,
    clearError,
  } = useStudents();

  const {addNotification} = useNotifications()
  const [localLoading, setLocalLoading] = useState(false);
  const [apiModeLocal, setApiModeLocal] = useState<boolean>(true); // purely UI toggle; real mode controlled by your USE_API in useDataFetcher

  // initial load
  useEffect(() => {
    (async () => {
      try {
        await fetchLecturers();
        await fetchAssignedForCourse(courseId);
      } catch (err: any) {

        toast.error(err?.message || "Failed to load data");
        addNotification({message: err?.message || "Failed to load data", variant: "error"})
      }
    })();
  }, []);

  // }, [fetchLecturers, fetchAssignedForCourse, courseId]);

  // show any hook error via toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleAssignClick = async (lecturer: Lecturer) => {
    setLocalLoading(true);
    try {
      await assignLecturerToCourse(courseId, lecturer);
      toast.success(`${lecturer.name} assigned`);
      addNotification({message: `${lecturer.name} assigned`, variant: "success"})
    } catch (err: any) {
      toast.error(err?.message || "Assign failed");
      addNotification({message: err?.message || "Assign failed", variant: "error"})
    } finally {
      setLocalLoading(false);
    }
  };

  const handleRemoveClick = async (lecturer: Lecturer) => {
    setLocalLoading(true);
    try {
      await removeLecturerFromCourse(courseId, lecturer._id);
      toast.success(`${lecturer.name} removed`);
      addNotification({message: `${lecturer.name} removed`, variant: "success"})
    } catch (err: any) {
      toast.error(err?.message || "Remove failed");
      addNotification({message: err?.message || "Remove failed", variant: "error"})
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === "assigned") {
      const lect = available.find((l) => l._id === draggableId);
      if (lect) handleAssignClick(lect);
    }
  };

  const handleSave = async () => {
    setLocalLoading(true);
    try {
      await saveAssignments(courseId);
      toast.success("Assignments saved successfully");
      addNotification({message: "Assignments saved successfully", variant: "success"})
    } catch (err: any) {
      toast.error(err?.message || "Save failed");
      addNotification({message: err?.message || "Save failed", variant: "error"})
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      {(loading || localLoading) && (
        <div className="flex justify-center items-center h-40 col-span-2">
          <Loader2 className="animate-spin" size={30} />
        </div>
      )}

      {!loading && (
        <DragDropContext onDragEnd={handleDragEnd}>
          {/* Available Lecturers */}
          <Droppable droppableId="available">
            {(provided) => (
              <Card
                ref={provided.innerRef as any}
                {...provided.droppableProps}
                className="backdrop-blur-xl bg-white/70 shadow-xl border border-gray-100 rounded-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-800">Available Lecturers</CardTitle>
                </CardHeader>

                <CardContent>
                  {available.length === 0 && <p className="text-gray-500 text-sm">No available lecturers</p>}

                  {available.map((lec, index) => (
                    <Draggable draggableId={lec._id} index={index} key={lec._id}>
                      {(provided) => (
                        <motion.div
                          ref={provided.innerRef as any}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          whileHover={{ scale: 1.02 }}
                          className={`flex items-center justify-between rounded-2xl p-3 mb-2 border bg-white border-gray-200 shadow-sm`}
                        >
                          <div>
                            <p className="font-semibold text-gray-800">{lec.name}</p>
                            <p className="text-sm text-gray-500">{lec.email}</p>
                          </div>

                          <Button size="sm" variant="ghost" onClick={() => handleAssignClick(lec)}>
                            <UserPlus size={18} />
                          </Button>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </CardContent>
              </Card>
            )}
          </Droppable>

          {/* Assigned Lecturers */}
          <Droppable droppableId="assigned">
            {(provided) => (
              <Card
                ref={provided.innerRef as any}
                {...provided.droppableProps}
                className="backdrop-blur-xl bg-green-50/70 shadow-xl border border-green-200 rounded-2xl"
              >
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-700">Assigned Lecturers</CardTitle>
                </CardHeader>

                <CardContent>
                  {assigned.length === 0 && <p className="text-gray-500 text-sm">No lecturers assigned</p>}

                  {assigned.map((lec) => (
                    <div key={lec._id} className="flex items-center justify-between bg-green-100 border border-green-300 rounded-2xl p-3 mb-2 shadow-sm">
                      <div>
                        <p className="font-semibold text-green-900">{lec.name}</p>
                        <p className="text-sm text-green-700">{lec.email}</p>
                      </div>

                      <Button size="sm" variant="ghost" onClick={() => handleRemoveClick(lec)}>
                        <UserMinus size={18} className="text-red-600" />
                      </Button>
                    </div>
                  ))}

                  {provided.placeholder}
                </CardContent>
              </Card>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Bottom Controls */}
      <div className="col-span-2 flex justify-between mt-6">
        <Button variant={apiModeLocal ? "destructive" : "secondary"} onClick={() => setApiModeLocal((p) => !p)}>
          {apiModeLocal ? "API Mode (using configured endpoint)" : "Local View Mode"}
        </Button>

        <div className="flex items-center gap-3">
          <Button
            variant="default"
            onClick={() => {
              clearError();
              fetchLecturers();
              fetchAssignedForCourse(courseId);
            }}
          >
            Refresh
          </Button>

          <Button variant="primary" onClick={handleSave}>
            Save Assignments
          </Button>
        </div>
      </div>
    </div>
  );
}
