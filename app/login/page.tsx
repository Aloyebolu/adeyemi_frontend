"use client";

import { useRouter } from "next/navigation";
import HomePage from "../page";

export default function LoginModal() {
  const router = useRouter();

  const roles = [
    { label: "Student", href: "/student-login" },
    { label: "Lecturer", href: "/lecturer-login" },
    { label: "HOD", href: "/hod-login" },
    { label: "Administrator", href: "/admin-login" },
  ];

  const closeModal = () => router.back();

  return (
<>
<HomePage />
</>

  );
}
 