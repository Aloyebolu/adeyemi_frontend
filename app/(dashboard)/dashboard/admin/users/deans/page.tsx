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
    { text: "Deans are pre-created lecturers in the system" },
    { text: "To add a new Dean, first create a lecturer profile" },
    { text: "After creating the lecturer, you can assign them as a Dean From the Faculty list page" },
    { text: "Ensure the lecturer belongs to the faculty you want to assign them as Dean for" },
    { text: "Deans have oversight over all departments within their faculty" },
    { text: "You can edit or remove Dean assignments at any time" },

  ]

  return (
    <>
      <LecturerDashboard role="dean" lecturerType="dean" />
      <NotesCard title="Dean Management" notes={notes}/>
    </>

  );
}
