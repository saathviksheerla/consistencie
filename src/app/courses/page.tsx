"use client";

import { useState } from "react";
import { useCourses, CourseCategory } from "@/hooks/useCourses";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { IconCheckCircle } from "@/components/Icons";

export default function CoursesPage() {
    const { courses, isLoaded, addCourse, incrementProgress, deleteCourse } = useCourses();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [totalLessons, setTotalLessons] = useState("");
    const [category, setCategory] = useState<CourseCategory>("Other");

    if (!isLoaded) return null;

    const handleAddCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !totalLessons) return;

        addCourse({
            title,
            url,
            totalLessons: Number(totalLessons),
            category,
        });

        // Reset and close
        setTitle("");
        setUrl("");
        setTotalLessons("");
        setCategory("Other");
        setIsAddModalOpen(false);
    };

    return (
        <div className="p-6 md:p-10 pb-20 max-w-5xl mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Courses & Playlists</h1>
                    <p className="text-muted-foreground">Track your progress through your learning materials.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>+ Add Course</Button>
            </header>

            {courses.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <p className="mb-4">You haven't added any courses yet.</p>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>Add your first course</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map(course => {
                        const progress = course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0;
                        const isDone = course.completedLessons >= course.totalLessons;

                        return (
                            <Card key={course.id} className="flex flex-col">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="truncate text-lg">
                                                {course.url ? (
                                                    <a href={course.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline transition-colors">
                                                        {course.title}
                                                    </a>
                                                ) : (
                                                    course.title
                                                )}
                                            </CardTitle>
                                            <Badge variant="secondary" className="mt-2 text-xs">{course.category}</Badge>
                                        </div>
                                        {isDone && <IconCheckCircle className="text-accent w-6 h-6 flex-shrink-0" />}
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-4 mt-auto">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-medium">{course.completedLessons} / {course.totalLessons} ({Math.round(progress)}%)</span>
                                        </div>
                                        <ProgressBar progress={progress} />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() => incrementProgress(course.id)}
                                            disabled={isDone}
                                        >
                                            {isDone ? "Completed" : "+1 Lesson"}
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 px-3"
                                            onClick={() => deleteCourse(course.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add Course Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Course or Playlist"
            >
                <form onSubmit={handleAddCourse} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <Input
                            placeholder="e.g. Next.js 14 Full Course"
                            value={title} onChange={e => setTitle(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">URL (Optional)</label>
                        <Input
                            type="url"
                            placeholder="https://youtube.com/..."
                            value={url} onChange={e => setUrl(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Total Lessons</label>
                            <Input
                                type="number" min={1} required
                                placeholder="e.g. 24"
                                value={totalLessons} onChange={e => setTotalLessons(e.target.value)}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-1 block">Category</label>
                            <Select
                                value={category}
                                onChange={e => setCategory(e.target.value as CourseCategory)}
                            >
                                <option value="ML">Machine Learning</option>
                                <option value="Math">Math</option>
                                <option value="Language">Language</option>
                                <option value="Other">Other</option>
                            </Select>
                        </div>
                    </div>
                    <Button type="submit" className="mt-2 text-primary-foreground">Add Course</Button>
                </form>
            </Modal>
        </div>
    );
}
