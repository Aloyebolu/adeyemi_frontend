'use client'
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


  return (
    <LecturerDashboard role="dean" lecturerType="dean"/>
  );
}
