"use client";

import React, { useEffect, useState } from "react";
import useStudents, { Lecturer } from "@/hooks/useStudents";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/Button";
import { Loader2, UserPlus, UserMinus } from "lucide-react";
import toast from "react-hot-toast";
import { useNotifications } from "@/hooks/useNotification";

interface Props {
  params: { id: string };
}

export default function CourseAssignmentPage({ params }: any) {
  const resolvedParams : any = React.use(params);
  const { id: courseId } = resolvedParams;

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

  const { addNotification } = useNotifications();
  const [saving, setSaving] = useState(false);
  const [buttonLoading, setButtonLoading] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await fetchLecturers();
        await fetchAssignedForCourse(courseId);
      } catch (err: any) {
        toast.error("Failed to load data");
      }
    })();
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    if (destination.droppableId === "assigned") {
      const lec = available.find((l) => String(l._id) === draggableId);
      if (lec) handleAssignClick(lec);
    } else if (destination.droppableId === "available") {
      const lec = assigned.find((l) => String(l._id) === draggableId);
      if (lec) handleRemoveClick(lec);
    }
  };

  const handleAssignClick = async (lecturer: Lecturer) => {
    setButtonLoading(lecturer._id);
    try {
      await assignLecturerToCourse(courseId, lecturer);
      toast.success(`${lecturer.name} assigned`);
      addNotification({ message: `${lecturer.name} assigned`, variant: "success" });
    } catch (err: any) {
      addNotification({ message: err.message , variant: "error" });
    } finally {
      setButtonLoading(null);
    }
  };

  const handleRemoveClick = async (lecturer: Lecturer) => {
    setButtonLoading(lecturer._id);
    try {
      await removeLecturerFromCourse(courseId, lecturer._id);
      toast.success(`${lecturer.name} removed`);
      addNotification({ message: `${lecturer.name} removed`, variant: "success" });
    } catch (err: any) {
      toast.error("Remove failed");
    } finally {
      setButtonLoading(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAssignments(courseId);
      toast.success("Assignments saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Available Lecturers */}
            <Droppable droppableId="available">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl bg-white shadow-lg p-4 border transition-all duration-200 ${
                    snapshot.isDraggingOver ? "border-blue-400 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <h2 className="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2">
                    Available Lecturers <UserPlus className="text-blue-500" size={20} />
                  </h2>
                  <div className="space-y-2">
                    {available.length === 0 && (
                      <p className="text-sm text-gray-500">No available lecturers</p>
                    )}
                    {available.map((lec, index) => (
                      <Draggable draggableId={String(lec._id)} index={index} key={lec._id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex justify-between items-center p-3 rounded-lg border cursor-grab active:cursor-grabbing transition ${
                              snapshot.isDragging
                                ? "bg-blue-100 border-blue-300"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <div>
                              <p className="font-semibold text-gray-800">{lec.name}</p>
                              <p className="text-sm text-gray-500">{lec.email}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleAssignClick(lec)}
                              disabled={buttonLoading === lec._id}
                            >
                              {buttonLoading === lec._id ? (
                                <Loader2 size={18} className="animate-spin" />
                              ) : (
                                <UserPlus size={18} />
                              )}
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>

            {/* Assigned Lecturers */}
            <Droppable droppableId="assigned">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`rounded-xl bg-green-50 shadow-lg p-4 border transition-all duration-200 ${
                    snapshot.isDraggingOver ? "border-green-400 bg-green-100" : "border-green-200"
                  }`}
                >
                  <h2 className="font-bold text-xl mb-3 text-green-700 flex items-center gap-2">
                    Assigned Lecturers <UserMinus className="text-green-600" size={20} />
                  </h2>
                  <div className="space-y-2">
                    {assigned.length === 0 && (
                      <p className="text-sm text-gray-500">No assigned lecturers</p>
                    )}
                    {assigned.map((lec, index) => (
                      <Draggable draggableId={String(lec._id)} index={index} key={lec._id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex justify-between items-center p-3 rounded-lg border cursor-grab active:cursor-grabbing transition ${
                              snapshot.isDragging
                                ? "bg-green-100 border-green-300"
                                : "bg-white border-green-200 hover:bg-green-50"
                            }`}
                          >
                            <div>
                              <p className="font-semibold text-green-800">{lec.name}</p>
                              <p className="text-sm text-green-700">{lec.email}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveClick(lec)}
                              disabled={buttonLoading === lec._id}
                            >
                              {buttonLoading === lec._id ? (
                                <Loader2 size={18} className="animate-spin text-red-600" />
                              ) : (
                                <UserMinus size={18} className="text-red-600" />
                              )}
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="animate-spin mr-2" size={18} />}
              Save Assignments
            </Button>
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
