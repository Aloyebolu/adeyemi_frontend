"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { loginAs } from "@/lib/auth";
import { useNotifications } from "@/hooks/useNotification";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading, error } = useAuth();
  const { addNotification } = useNotifications();

  const [email, set_email] = useState("");
  const [password, set_password] = useState("");
  const [error_message, set_error_message] = useState("");
  const [role, set_role] = useState<"student" | "lecturer" | "admin">("student");

  useEffect(() => {
    const roleFromUrl = searchParams.get("role");
    if (["student", "lecturer", "admin"].includes(roleFromUrl || "")) {
      set_role(roleFromUrl as "student" | "lecturer" | "admin");
    }
  }, [searchParams]);

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      set_error_message("Please fill in all fields.");
      return;
    }

    set_error_message("");

    try {
      const payload = { email, password };
      const data = await login(payload);

      loginAs(
        data?.user.role || "user",
        data?.user?.token,
        data?.user?.name,
        data?.user?.matric_no || "SET/23/__MOCK__"
      );

      switch (data?.user.role) {
        case "student":
          router.push("/dashboard/student");
          break;
        case "lecturer":
          router.push("/dashboard/lecturer");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        default:
          router.push("/dashboard/student");
          break;
      }
    } catch (err) {
      addNotification({ message: error, variant: "error" });
      error && set_error_message(error);
    }
  };

  const get_label = () => {
    switch (role) {
      case "lecturer":
        return "Lecturer ID";
      case "admin":
        return "Admin ID";
      default:
        return "Matric No";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* UNIVERSITY HEADER */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="AFUED Logo"
            className="w-16 h-16 mb-2 rounded-full"
          />
          <h1 className="text-2xl font-bold text-[#0B3D2E] text-center">
            Adeyemi Federal University of Education
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Official Portal Login
          </p>
        </div>

        <form onSubmit={handle_submit} className="space-y-4">
          {/* ROLE SELECT */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) =>
                set_role(e.target.value as "student" | "lecturer" | "admin")
              }
              className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:ring-2 focus:ring-[#0B3D2E] outline-none"
            >
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* EMAIL / ID FIELD */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {get_label()}
            </label>
            <input
              name="email"
              type="text"
              value={email}
              onChange={(e) => set_email(e.target.value)}
              placeholder={`Enter your ${get_label()}`}
              className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:ring-2 focus:ring-[#0B3D2E] outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {role === "student"
                ? "Example: SET/23/001"
                : role === "lecturer"
                ? "Example: LEC-045"
                : "Example: ADM-001"}
            </p>
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
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
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>

          {/* FOOTER */}
          <p className="text-sm text-center text-gray-500 mt-3">
            Don’t have an account?{" "}
            <a href="/signup" className="text-[#0B3D2E] font-semibold">
              Sign up
            </a>
          </p>
        </form>

        <footer className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} AFUED Portal — All Rights Reserved
        </footer>
      </div>
    </div>
  );
}
