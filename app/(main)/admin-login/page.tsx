"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { loginAs } from "@/lib/auth";
import { useNotifications } from "@/hooks/useNotification";

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin, loading, error } = useAuth();
  const { addNotification } = useNotifications();

  const [admin_id, set_admin_id] = useState("");
  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error_message, set_error_message] = useState("");

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if ((!admin_id.trim() && !email.trim()) || !password.trim()) {
      set_error_message("Please provide Admin ID or Email and Password.");
      return;
    }

    set_error_message("");

    try {
      // Build payload — supports both admin_id and email login
      const payload = { admin_id: admin_id || undefined, email: email || undefined, password };

      const data = await adminLogin(payload);

      if (!data?.user || data?.user?.role !== "admin") {
        set_error_message("Access denied. Admin only.");
        return;
      }

      // Save session
      loginAs("admin", data?.user?.access_token, data?.user?.name, data?.user?.id, data?.user?.admin_id, );

      addNotification({ message: "Welcome back, Admin!", variant: "success" });
      // router.push("/dashboard/admin");
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
            University Admin Panel
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Superuser Login
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handle_submit} className="space-y-4">
          {/* ADMIN ID */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Admin ID</label>
            <input
              type="text"
              name="admin_id"
              value={admin_id}
              onChange={(e) => set_admin_id(e.target.value)}
              placeholder="Enter Admin ID (e.g., ADM-001)"
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
              <span>Login as Admin</span>
            )}
          </button>

          <p className="text-xs text-center text-gray-400 mt-3">
            For authorized staff only. Unauthorized access is prohibited.
          </p>
        </form>

        <footer className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} AFUED Portal — Admin Control
        </footer>
      </div>
    </div>
  );
}
