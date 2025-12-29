"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { loginAs } from "@/lib/auth";
import { useNotifications } from "@/hooks/useNotification";

export default function StudentLoginPage() {
  const router = useRouter();
  const { studentLogin, loading, error } = useAuth();
  const { addNotification } = useNotifications();

  const [matric_no, set_matric_no] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error_message, set_error_message] = useState("");

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if ((!matric_no.trim() && !email.trim()) || !password.trim()) {
      set_error_message("Please provide Matric No or Email and Password.");
      return;
    }

    set_error_message("");

    try {
      // Build payload — supports both matric_no and email login
      const payload = { matric_no: matric_no || undefined, email: email || undefined, password };

      const data = await studentLogin(payload);

      if (!data?.user || data?.user?.role !== "student") {
        set_error_message("Access denied. Student only.");
        return;
      }

      // Save session
      loginAs(
        data?.user
      );

      addNotification({ message: `Welcome back, ${data.user.name}!`, variant: "success" });
      // router.push("/dashboard/student");
    } catch (err: any) {
      const message = error || err.message || "Login failed";
      set_error_message(message);
      addNotification({ message, variant: "error" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="University Logo"
            className="w-16 h-16 mb-2 rounded-full"
          />
          <h1 className="text-2xl font-bold text-[#0B3D2E] text-center">
            University Student Portal
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Student Login
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handle_submit} className="space-y-4">
          {/* MATRIC NO */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Matric No</label>
            <input
              type="text"
              name="matric_no"
              value={matric_no}
              onChange={(e) => set_matric_no(e.target.value)}
              placeholder="Enter Matric No (e.g., 20/1234)"
              className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:ring-2 focus:ring-[#0B3D2E] outline-none"
            />
          </div>

          {/* EMAIL FIELD (Optional) */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email (Optional)</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => set_email(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:ring-2 focus:ring-[#0B3D2E] outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => set_password(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:ring-2 focus:ring-[#0B3D2E] outline-none"
            />
          </div>

          {/* ERROR MESSAGE */}
          {(error_message || error) && (
            <div className="text-sm text-red-600">{error_message || error}</div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition flex items-center justify-center gap-2 ${
              loading
                ? "bg-[#0B3D2E]/70 cursor-not-allowed"
                : "bg-[#0B3D2E] hover:bg-[#11543E]"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Verifying...</span>
              </>
            ) : (
              <span>Login as Student</span>
            )}
          </button>

          <p className="text-xs text-center text-gray-400 mt-3">
            For authorized students only. Unauthorized access is prohibited.
          </p>
        </form>

        <footer className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} AFUED Portal — Student Access
        </footer>
      </div>
    </div>
  );
}