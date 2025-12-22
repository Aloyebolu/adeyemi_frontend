"use client";

import { useRouter } from "next/navigation";

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1200] flex justify-center items-center">
      <div className="relative bg-white p-6 w-[90%] max-w-md rounded-xl shadow-xl animate-fadeIn">
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2 text-primary text-center">Select Your Portal</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Choose the login area appropriate for you.
        </p>

        <div className="space-y-3">
          {roles.map(role => (
            <button
              key={role.href}
              onClick={() => router.push(role.href)}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primaryHover transition"
            >
              {role.label} Login
            </button>
          ))}
        </div>
      </div>

      {/* Backdrop click */}
      <div
        className="absolute inset-0"
        onClick={closeModal}
      />
    </div>
  );
}
