// lib/auth.ts
export interface UserData {
  role: string;
  access_token: string;
  name: string;
  matric_no?: string;
  admin_id?: string;
  staff_id?: string;
  id?: string;
  department?: string;
}

export interface LoginOptions {
  noRedirect?: boolean;
}

export function loginAs(data: UserData, options: LoginOptions = {}) {
  // Store all data with fallback mock values
  const defaults = {
    matric_no: "MAT/23__MOCK__",
    admin_id: "ADM/23__MOCK__",
    staff_id: "STF/23__MOCK__",
    id: "ID/23__MOCK__",
    department: "DEPT/23__MOCK__"
  };

  localStorage.setItem("role", data.role);
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("name", data.name);
  localStorage.setItem("matric_no", data.matric_no || defaults.matric_no);
  localStorage.setItem("admin_id", data.admin_id || defaults.admin_id);
  localStorage.setItem("staff_id", data.staff_id || defaults.staff_id);
  localStorage.setItem("_id", data.id || defaults.id);
  localStorage.setItem("department", data.department || defaults.department);

  // 🚀 Redirect unless noRedirect = true
  if (!options.noRedirect) {
    let targetRole = data.role;

    // 🧭 If role is HOD, redirect to lecturer dashboard instead
    if (data.role === 'hod') {
      targetRole = 'lecturer';
    }

    window.location.href = `/dashboard/${targetRole}`;
  }
}

// Helper function for backward compatibility (optional)
export function loginWithParams(
  role: string, 
  token: string, 
  name: string, 
  matric_no?: string,
  admin_id?: string,
  staff_id?: string,
  id?: string,
  department?: string,
  options: LoginOptions = {}
) {
  loginAs({ role, access_token, name, matric_no, admin_id, staff_id, id, department }, options);
}

export function getUserRole(): string | null {
  return localStorage.getItem("role");
}

export function getUserData() {
  return {
    role: localStorage.getItem("role"),
    token: localStorage.getItem("access_token"),
    name: localStorage.getItem("name"),
    matric_no: localStorage.getItem("matric_no"),
    admin_id: localStorage.getItem("admin_id"),
    staff_id: localStorage.getItem("staff_id"),
    department: localStorage.getItem("department"),
    id: localStorage.getItem("_id"),
  };
}

export function logout() {
  [
    "role",
    "access_token",
    "name",
    "matric_no",
    "admin_id",
    "staff_id",
    "department",
    "_id",
  ].forEach((key) => localStorage.removeItem(key));

  window.location.href = "/";
}