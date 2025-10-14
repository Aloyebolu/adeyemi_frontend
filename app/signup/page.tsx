"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { loginAs } from "@/lib/auth";
import { useNotifications } from "@/hooks/useNotification";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, loading, error } = useAuth();
  const { addNotification } = useNotifications();

  const [form, set_form] = useState({
    id_value: "",
    password: "",
    role: "lecturer",
  });

  const [error_message, set_error_message] = useState("");

  useEffect(() => {
    const roleFromUrl = searchParams.get("role");
    if (roleFromUrl && ["lecturer", "admin"].includes(roleFromUrl)) {
      set_form((prev) => ({ ...prev, role: roleFromUrl }));
    }
  }, [searchParams]);

  const get_label = (r: string) => {
    if (r === "admin") return "Admin ID";
    if (r === "lecturer") return "Lecturer ID";
    return "Matric No";
  };

  const handle_change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    set_form({ ...form, [e.target.name]: e.target.value });
  };

  const handle_submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!form.id_value.trim() || !form.password.trim()) {
      set_error_message("Please fill in all fields.");
      return;
    }

    set_error_message("");

    try {
      const payload = {
        id_value: form.id_value,
        password: form.password,
        role: form.role,
      };

      const data = await signup(payload);

      // Save session
      loginAs(
        data?.user.role || "user",
        data?.user?.token,
        data?.user?.name,
        data?.user?.id || form.id_value
      );

      // Redirect after signup
      switch (data?.user.role) {
        case "lecturer":
          router.push("/dashboard/lecturer");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        default:
          router.push("/");
          break;
      }
    } catch (err) {
      console.error(err);
      addNotification({ message: error || "Signup failed", variant: "error" });
      error && set_error_message(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB] p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="AFUED Logo"
            className="w-16 h-16 mb-2 rounded-full"
          />
          <h1 className="text-2xl font-bold text-[#0B3D2E] text-center">
            AFUED {form.role.charAt(0).toUpperCase() + form.role.slice(1)} Signup
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            Create an account to access the AFUED Portal
          </p>
        </div>

        <form onSubmit={handle_submit} className="space-y-4">
          {/* ROLE SELECT */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handle_change}
              className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:ring-2 focus:ring-[#0B3D2E] outline-none"
            >
              <option value="lecturer">Lecturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* ID FIELD */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              {get_label(form.role)}
            </label>
            <input
              name="id_value"
              type="text"
              value={form.id_value}
              onChange={handle_change}
              placeholder={`Enter your ${get_label(form.role)}`}
              className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:ring-2 focus:ring-[#0B3D2E] outline-none"
            />
          </div>

          {/* PASSWORD FIELD */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handle_change}
              placeholder="Enter your password"
              className="w-full border border-[#D1D5DB] rounded-lg p-2 focus:ring-2 focus:ring-[#0B3D2E] outline-none"
            />
          </div>

          {/* ERROR MESSAGE */}
          {(error_message || error) && (
            <div className="text-sm text-red-600">
              {error_message || error}
            </div>
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
                <span>Signing up...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>

          {/* FOOTER LINK */}
          <p className="text-sm text-center text-gray-500 mt-3">
            Already have an account?{" "}
            <a href="/" className="text-[#0B3D2E] font-semibold">
              Login
            </a>
          </p>
        </form>

        {/* FOOTER */}
        <footer className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} AFUED Portal — All Rights Reserved
        </footer>
      </div>
    </div>
  );
}
