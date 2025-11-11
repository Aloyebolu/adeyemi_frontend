// hooks/useStudents.ts
"use client";

import { useCallback, useState } from "react";
import useUser from "@/hooks/useUser";
import { useDataFetcher } from "@/lib/dataFetcher";

/**
 * useStudents
 * - Uses your useDataFetcher (no direct fetch/axios)
 * - Exposes available/assigned lists and actions for assignment flows
 */

/* -------------------------
   Types
   ------------------------- */
export interface Lecturer {
  _id: string;
  name: string;
  email: string;
  department?: string;
}

export interface AssignmentRecord {
  _id?: string;
  course?: string | { _id: string };
  lecturers?: Array<{ user: any }>;
  semester?: string;
  session?: string;
  department?: string;
  [k: string]: any;
}

export interface UseStudentsResult {
  available: Lecturer[];
  assigned: Lecturer[];
  loading: boolean;
  error: string | null;
  fetchLecturers: () => Promise<void>;
  fetchAssignedForCourse: (courseId: string) => Promise<void>;
  assignLecturerToCourse: (courseId: string, lecturer: Lecturer) => Promise<void>;
  removeLecturerFromCourse: (courseId: string, lecturerId: string) => Promise<void>;
  saveAssignments: (
    courseId: string,
    meta?: { semester?: string; session?: string; department?: string }
  ) => Promise<void>;
  clearError: () => void;
}

/* -------------------------
   Mock fallback
   ------------------------- */
const MOCK_LECTURERS: Lecturer[] = [
  { _id: "1", name: "Dr. Chidi Okafor", email: "chidi.okafor@university.edu" },
  { _id: "2", name: "Prof. Grace Adeoye", email: "grace.adeoye@university.edu" },
  { _id: "3", name: "Mr. Ibrahim Yusuf", email: "ibrahim.yusuf@university.edu" },
  { _id: "4", name: "Mrs. Ngozi Eze", email: "ngozi.eze@university.edu" },
  { _id: "5", name: "Dr. Aisha Mohammed", email: "aisha.mohammed@university.edu" },
];

/* -------------------------
   Hook
   ------------------------- */
export default function useStudents(): UseStudentsResult {
  const { fetchData } = useDataFetcher();
  // useUser is left in place in case fetchData relies on it; not used directly here
  useUser();

  const [available, setAvailable] = useState<Lecturer[]>([]);
  const [assigned, setAssigned] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  /**
   * fetchLecturers
   * GET /lecturers
   */
  const fetchLecturers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchData("lecturers", "GET");
      const payload = res?.data ?? res;

      if (Array.isArray(payload) && payload.length > 0) {
        // If backend returns objects in different shape, normalize here
        const normalized = payload.map((p: any) => ({
          _id: p._id ?? p.id ?? String(p.user ?? p),
          name: p.name ?? p.fullName ?? p.username ?? "Unknown",
          email: p.email ?? p.user?.email ?? "",
          department: p.department ?? p.dept ?? undefined,
        })) as Lecturer[];

        setAvailable(normalized);
      } else {
        // fallback to mock lecturers
        setAvailable(MOCK_LECTURERS);
      }
    } catch (err: any) {
      console.error("useStudents.fetchLecturers:", err);
      setError(err?.message ?? "Failed to fetch lecturers");
      setAvailable(MOCK_LECTURERS);
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  /**
   * fetchAssignedForCourse
   * GET /course/assignments?course=<id>
   */
  const fetchAssignedForCourse = useCallback(
    async (courseId: string) => {
      setLoading(true);
      setError(null);
      try {
        // call inferred endpoint for assignments
        const res = await fetchData("course/assignments", "GET", undefined, {
          // your useDataFetcher expects `params` to be appended; we include query string
          params: `?course=${courseId}`,
        });
        const payload = res?.data ?? res;

        // payload might be an array of assignment records
        if (Array.isArray(payload) && payload.length > 0) {
          // try to find exact assignment for course
          const match: AssignmentRecord | undefined =
            payload.find(
              (a: AssignmentRecord) =>
                String(typeof a.course === "object" && a.course !== null ? a.course._id : a.course ?? "") === String(courseId)
            ) ?? payload[0];

          const lecturersRaw = match?.lecturers ?? [];
          // lecturers may be objects like { user: <id or user object> } or plain lecturer objects
          const normalized: Lecturer[] = (lecturersRaw as any[]).map((l) => {
            // if shape is { user: { _id, name, email } }
            if (l?.user && typeof l.user === "object") {
              return {
                _id: l.user._id ?? l.user.id ?? String(l.user),
                name: l.user.name ?? l.user.fullName ?? "Unknown",
                email: l.user.email ?? "",
              } as Lecturer;
            }

            // if shape is { user: "<id>" } or plain { _id, name, email }
            if (typeof l === "string" || typeof l?.user === "string") {
              // no names provided — try to match from available list
              const id = (typeof l === "string" ? l : l.user) as string;
              const found = available.find((a) => a._id === id);
              if (found) return found;
              return { _id: id, name: "Unknown", email: "" };
            }

            // assume it's already a lecturer object
            return {
              _id: l._id ?? l.id ?? String(l),
              name: l.name ?? "Unknown",
              email: l.email ?? "",
            } as Lecturer;
          });

          setAssigned(normalized);
          // remove assigned from available
          setAvailable((prev) => prev.filter((p) => !normalized.some((n) => n._id === p._id)));
        } else {
          // no assignments found
          setAssigned([]);
        }
      } catch (err: any) {
        console.error("useStudents.fetchAssignedForCourse:", err);
        setError(err?.message ?? "Failed to fetch assigned lecturers");
        setAssigned([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchData, available]
  );

  /**
   * assignLecturerToCourse
   * POST /course/assign  { course, lecturers: [{ user }] }
   * Optimistic update and revert on failure.
   */
  const assignLecturerToCourse = useCallback(
    async (courseId: string, lecturer: Lecturer) => {
      setError(null);

      
      try {
        await fetchData("course/assign", "POST", {
          course: courseId,
          lecturers: [{ user: lecturer._id }],
        });
        // optimistic update
        setAssigned((prev) => [...prev, lecturer]);
        setAvailable((prev) => prev.filter((p) => p._id !== lecturer._id));
      } catch (err: any) {
        // revert

        setError(err?.message ?? "Failed to assign lecturer");
        throw err;
      }
    },
    [fetchData]
  );

  /**
   * removeLecturerFromCourse
   * Attempt 1: POST /course/remove-lecturer { course, userId }
   * Fallback: GET assignments -> update assignment via PUT /course/update-assignment
   */
  const removeLecturerFromCourse = useCallback(
    async (courseId: string, lecturerId: string) => {
      setError(null);
      const removed = assigned.find((l) => l._id === lecturerId) ?? null;

      // optimistic update
      setAssigned((prev) => prev.filter((l) => l._id !== lecturerId));
      if (removed) setAvailable((prev) => [removed, ...prev]);

      try {
        // try remove endpoint first
        await fetchData("course/remove-lecturer", "POST", {
          course: courseId,
          userId: lecturerId,
        });
      } catch (err: any) {
        console.warn("removeLecturer fallback triggered", err);
        // fallback flow: fetch assignment record and update it
        try {
          const resp = await fetchData("course/assignments", "GET", undefined, {
            params: `?course=${courseId}`,
          });
          const payload = resp?.data ?? resp;
          const record: AssignmentRecord | null =
            Array.isArray(payload) && payload.length > 0 ? payload[0] : null;

          if (!record || !record._id) {
            throw new Error("Assignment record not found for update fallback");
          }

          // build new lecturers list excluding the removed lecturer
          const currentLecturers = Array.isArray(record.lecturers) ? record.lecturers : [];
          const newLecturers = currentLecturers.filter(
            (l: any) => String(l.user ?? l) !== String(lecturerId) && String(l.user?._id ?? l._id ?? l) !== String(lecturerId)
          );

          // update assignment record
          await fetchData("course/update-assignment", "PUT", {
            id: record._id,
            lecturers: newLecturers,
          });
        } catch (err2: any) {
          // revert optimistic update
          if (removed) {
            setAssigned((prev) => [removed, ...prev]);
            setAvailable((prev) => prev.filter((p) => p._id !== removed._id));
          }
          setError(err2?.message ?? "Failed to remove lecturer");
          throw err2;
        }
      }
    },
    [assigned, fetchData]
  );

  /**
   * saveAssignments
   * - If assignment record exists -> PUT /course/update-assignment
   * - Else -> POST /course/assign
   */
  const saveAssignments = useCallback(
    async (courseId: string, meta?: { semester?: string; session?: string; department?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetchData("course/assignments", "GET", undefined, {
          params: `?course=${courseId}`,
        });
        const payload = resp?.data ?? resp;
        const existing: AssignmentRecord | null = Array.isArray(payload) && payload.length > 0 ? payload[0] : null;

        const lecturersPayload = assigned.map((l) => ({ user: l._id }));

        if (existing && existing._id) {
          // update
          await fetchData("course/update-assignment", "PUT", {
            id: existing._id,
            lecturers: lecturersPayload,
            ...meta,
          });
        } else {
          // create
          await fetchData("course/assign", "POST", {
            course: courseId,
            lecturers: lecturersPayload,
            ...meta,
          });
        }
      } catch (err: any) {
        console.error("useStudents.saveAssignments:", err);
        setError(err?.message ?? "Failed to save assignments");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [assigned, fetchData]
  );

  return {
    available,
    assigned,
    loading,
    error,
    fetchLecturers,
    fetchAssignedForCourse,
    assignLecturerToCourse,
    removeLecturerFromCourse,
    saveAssignments,
    clearError,
  };
}
