// lib/auth.ts
export function loginAs(role: string, token: string, name : string, matric_no: string) {
  localStorage.setItem("role", role);
  localStorage.setItem("access_token", token)
  localStorage.setItem("name", name)
  localStorage.setItem("matric_no", matric_no || "MAT/23__MOCK__")




  // window.location.href = "/dashboard";
}

export function getUserRole() {
  return localStorage.getItem("role");
}

export function logout() {
  localStorage.removeItem("role");
  window.location.href = "/";
}
