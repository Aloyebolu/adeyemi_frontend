"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function LoginModal() {
  const router = useRouter();

  const roles = [
    { label: "Student", href: "/student-login" },
    { label: "Lecturer", href: "/lecturer-login" },
    { label: "HOD", href: "/hod-login" },
    { label: "Administrator", href: "/admin-login" }, // not shown publicly
  ];

  const closeModal = () => router.back();

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      {/* MODAL CONTAINER */}
      <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-2xl relative animate-[fadeIn_0.2s_ease-out]">

        {/* CLOSE BUTTON */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={20} />
        </button>

        {/* TITLE */}
        <h1 className="text-xl font-bold text-primary text-center mb-1">
          Select Your Portal
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Continue to the login area that matches your role
        </p>

        {/* BUTTONS */}
        <div className="space-y-3">
          {roles.map((role) => (
            <button
              key={role.href}
              onClick={() => router.push(role.href)}
              className="
                w-full py-3 rounded-lg font-semibold
                bg-primary text-white hover:bg-primaryHover
                transition duration-200 shadow
              "
            >
              {role.label} Login
            </button>
          ))}
        </div>
      </div>

      {/* BACKDROP CLICK TO CLOSE */}
      <div
        className="absolute inset-0"
        onClick={closeModal}
      />
    </div>
  );
}
