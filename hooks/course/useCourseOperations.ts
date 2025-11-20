// useCourseOperations.ts
import { useState } from "react";
import { useDataFetcher } from "@/lib/dataFetcher";
import { useDialog } from "@/context/DialogContext";
import { useNotifications } from "@/hooks/useNotification";
import {Course, Pagination, ERROR_MESSAGES } from "@/types/courses.types";

export const useCourseOperations = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { fetchData } = useDataFetcher();
  const { closeDialog, setError: setDialogError } = useDialog();
  const { addNotification } = useNotifications();

  const handleApiError = (error: any, defaultMessage: string) => {
    const message = error?.message || defaultMessage;
    setError(message);
    setDialogError(message);
    return message;
  };

  const handleSuccess = (message: string) => {
    addNotification({ message, variant: 'success' });
  };

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

  const deleteCourse = async (courseId: string) => {
    try {
      await fetchData('course', 'DELETE', null, { params: courseId });
      setCourses(prev => prev.filter(course => course._id !== courseId));
      closeDialog();
      handleSuccess("Course deleted successfully");
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.DELETE);
    }
  };

  const handleServerQuery = async (query: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, pagination } = await fetchData("course", "POST", {
        fields: [query.filterId],
        page: query.page,
        search_term: query.search,
        sortField: query.sortField,
        sortOrder: query.sortOrder,
        pageSize: query.pageSize,
      });
      
      setCourses(data);
      setPagination(pagination);
    } catch (err) {
      handleApiError(err, ERROR_MESSAGES.FETCH_COURSES);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    courses,
    isLoading,
    error,
    pagination,
    
    // Setters
    setCourses,
    setIsLoading,
    setError,
    
    // Operations
    fetchCourses,
    fetchLecturerCourses,
    getCourseById,
    deleteCourse,
    handleServerQuery,
    handleApiError,
    handleSuccess,
  };
};