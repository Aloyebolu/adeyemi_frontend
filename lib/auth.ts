// lib/auth.ts
interface LoginOptions {
  noRedirect?: boolean;
}

export function loginAs(
  role: string,
  token: string,
  name: string,
  matric_no?: string,
  admin_id?: string,
  staff_id?: string,
  id?: string,
  options?: LoginOptions
) {
  localStorage.setItem("role", role);
  localStorage.setItem("access_token", token);
  localStorage.setItem("name", name);
  localStorage.setItem("matric_no", matric_no || "MAT/23__MOCK__");
  localStorage.setItem("admin_id", admin_id || "ADM/23__MOCK__");
  localStorage.setItem("staff_id", staff_id || "STF/23__MOCK__");
  localStorage.setItem("_id", id || "ID/23__MOCK__");

// 🚀 Redirect unless noRedirect = true
if (!options?.noRedirect) {
  let targetRole = role;

  // 🧭 If role is HOD, redirect to lecturer dashboard instead
  if (role === 'hod') {
    targetRole = 'lecturer';
  }

  window.location.href = `/dashboard/${targetRole}`;
}

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
    "_id",
  ].forEach((key) => localStorage.removeItem(key));

  window.location.href = "/";
}
