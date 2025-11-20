import { useState } from "react";
import { Pagination } from "../useCourse";
import { useDataFetcher } from "@/lib/dataFetcher";

export const useCourseData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { fetchData } = useDataFetcher();

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, pagination } = await fetchData("course");
      setCourses(data);
      setPagination(pagination);
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_COURSES);
    } finally {
      setIsLoading(false);
    }
  };
    const handleApiError = (error: any, defaultMessage: string) => {
    const message = error?.message || defaultMessage;
    setError(message);
    setDialogError(message);
    return message;
  };

  /**
   * Fetches courses assigned to the current lecturer
   */
  const fetchLecturerCourses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data } = await fetchData("course/lecturer");
      setCourses(data);
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_LECTURER_COURSES);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches a single course by ID
   */
  const getCourseById = async (courseId: string): Promise<Course | undefined> => {
    setIsLoading(true);
    
    try {
      const { data } = await fetchData("course", "GET", null, { params: courseId });
      return data;
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_COURSE);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };
  const handleServerQuery = async (query: any) => { /* ... */ };

  return {
    courses,
    pagination,
    isLoading,
    error,
    setCourses,
    setPagination,
    setIsLoading,
    setError,
    fetchCourses,
    fetchLecturerCourses,
    getCourseById,
    handleServerQuery,
  };
};