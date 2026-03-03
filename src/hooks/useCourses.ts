import { useLocalStorage } from "./useLocalStorage";

export type CourseCategory = "ML" | "Math" | "Language" | "Other";

export interface Course {
    id: string;
    title: string;
    url: string;
    totalLessons: number;
    completedLessons: number;
    category: CourseCategory;
    createdAt: number;
}

export function useCourses() {
    const [courses, setCourses, isLoaded] = useLocalStorage<Course[]>("consistencie_courses", []);

    const addCourse = (course: Omit<Course, "id" | "completedLessons" | "createdAt">) => {
        const newCourse: Course = {
            ...course,
            id: crypto.randomUUID(),
            completedLessons: 0,
            createdAt: Date.now(),
        };
        setCourses((prev) => [...prev, newCourse]);
    };

    const updateCourseProgress = (id: string, completedLessons: number) => {
        setCourses((prev) =>
            prev.map((c) => (c.id === id ? { ...c, completedLessons: Math.min(completedLessons, c.totalLessons) } : c))
        );
    };

    const incrementProgress = (id: string) => {
        setCourses((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, completedLessons: Math.min(c.completedLessons + 1, c.totalLessons) } : c
            )
        );
    };

    const deleteCourse = (id: string) => {
        setCourses((prev) => prev.filter((c) => c.id !== id));
    };

    return {
        courses,
        isLoaded,
        addCourse,
        updateCourseProgress,
        incrementProgress,
        deleteCourse,
    };
}
