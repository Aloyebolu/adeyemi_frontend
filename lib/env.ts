// lib/env.ts
export function isDevMode(): boolean {
  return process.env.NEXT_PUBLIC_DEV_MODE === "true" || 
         process.env.NODE_ENV === "development";
}

export function getDevCredentials() {
  return {
    admin: {
      email: process.env.NEXT_PUBLIC_DEV_ADMIN_EMAIL || "admin@test.com",
      password: process.env.NEXT_PUBLIC_DEV_ADMIN_PASSWORD || "admin123",
    },
    lecturer: {
      staff_id: process.env.NEXT_PUBLIC_DEV_LECTURER_ID || "LEC001",
      password: process.env.NEXT_PUBLIC_DEV_LECTURER_PASSWORD || "lecturer123",
    },
    student: {
      matric_no: process.env.NEXT_PUBLIC_DEV_STUDENT_ID || "STU001",
      password: process.env.NEXT_PUBLIC_DEV_STUDENT_PASSWORD || "student123",
    },
  };
}