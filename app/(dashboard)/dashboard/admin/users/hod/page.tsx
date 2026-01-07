'use client'
import NotesCard from "@/components/ui/card/NotesCard";
import LecturerDashboard from "../lecturers/page";

interface Department {
  _id: string;
  name: string;
}

interface Hod {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: string;
}

export default function HodDashboard() {

  const notes = [
    { text: "HODs are pre-created lecturers in the system" },
    { text: "To add a new HOD, first create a lecturer profile" },
    { text: "After creating the lecturer, you can assign them as an HOD from the Department list page" },
    { text: "Ensure the lecturer belongs to the department you want to assign them as HOD for" },
    { text: "HODs have oversight over operations within their department" },
    { text: "You can edit or remove HOD assignments at any time" },
  ]
  return (
    <>
      <LecturerDashboard role="hod" lecturerType="hod" />
      <NotesCard title="HOD Management" notes={notes} />
    </>

  );
}
