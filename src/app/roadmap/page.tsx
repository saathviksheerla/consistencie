"use client";

import { useState } from "react";
import { useMilestones, MilestoneStatus } from "@/hooks/useMilestones";
import { useCourses } from "@/hooks/useCourses";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { IconMap, IconCheckCircle } from "@/components/Icons";

export default function RoadmapPage() {
    const { milestones, isLoaded: mlLoaded, addMilestone, updateStatus, deleteMilestone } = useMilestones();
    const { courses, isLoaded: cLoaded } = useCourses();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [linkedCourseId, setLinkedCourseId] = useState("");

    if (!mlLoaded || !cLoaded) return null;

    const handleAddMilestone = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !targetDate) return;

        addMilestone({
            title,
            targetDate,
            linkedCourseId: linkedCourseId || undefined,
        });

        setTitle("");
        setTargetDate("");
        setLinkedCourseId("");
        setIsAddModalOpen(false);
    };

    // Sort by date nearest to furthest
    const sortedMilestones = [...milestones].sort(
        (a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="p-6 md:p-10 pb-20 max-w-5xl mx-auto w-full flex flex-col gap-8 animate-in fade-in duration-500">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Roadmap & Deadlines</h1>
                    <p className="text-muted-foreground">Keep your eyes on the prize and hit your goals.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>+ Add Milestone</Button>
            </header>

            {milestones.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                        <IconMap className="w-12 h-12 mb-4 opacity-20" />
                        <p className="mb-4">No milestones set. Where are you heading next?</p>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>Set a Goal</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="flex flex-col gap-4 relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-6 top-4 bottom-4 w-px bg-border hidden md:block" />

                    {sortedMilestones.map((m) => {
                        const linkedCourse = courses.find(c => c.id === m.linkedCourseId);
                        const target = new Date(m.targetDate);
                        target.setHours(0, 0, 0, 0);
                        const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                        const isDone = m.status === "Done";

                        let statusBadge = null;
                        if (isDone) {
                            statusBadge = <Badge variant="success">Achieved</Badge>;
                        } else if (diffDays < 0) {
                            statusBadge = <Badge variant="danger">Overdue ({Math.abs(diffDays)}d)</Badge>;
                        } else if (diffDays === 0) {
                            statusBadge = <Badge variant="warning">Due Today</Badge>;
                        } else if (diffDays <= 7) {
                            statusBadge = <Badge variant="warning">{diffDays} days left</Badge>;
                        } else {
                            statusBadge = <Badge variant="outline">{diffDays} days away</Badge>;
                        }

                        return (
                            <Card key={m.id} className={`relative md:ml-12 ${isDone ? 'opacity-70' : ''}`}>
                                {/* Timeline dot */}
                                <div className={`absolute -left-[54px] top-6 w-4 h-4 rounded-full border-4 border-background hidden md:block 
                  ${isDone ? 'bg-green-500' : diffDays < 0 ? 'bg-red-500' : diffDays <= 7 ? 'bg-yellow-500' : 'bg-muted-foreground'}
                `} />

                                <CardContent className="p-5 flex flex-col md:flex-row gap-4 justify-between md:items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className={`text-lg font-semibold ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                                                {m.title}
                                            </h3>
                                            {statusBadge}
                                        </div>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span>Target: {new Date(m.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            {linkedCourse && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                                    <span className="truncate max-w-[200px]">Course: {linkedCourse.title}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {!isDone ? (
                                            <Button variant="outline" size="sm" onClick={() => updateStatus(m.id, "Done")} className="gap-2">
                                                <IconCheckCircle className="w-4 h-4" />
                                                Mark Done
                                            </Button>
                                        ) : (
                                            <Button variant="ghost" size="sm" onClick={() => updateStatus(m.id, "In Progress")}>
                                                Undo
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => deleteMilestone(m.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add Milestone Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add Milestone"
            >
                <form onSubmit={handleAddMilestone} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Title</label>
                        <Input
                            placeholder="e.g. Finish Module 1"
                            value={title} onChange={e => setTitle(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Target Date</label>
                        <Input
                            type="date"
                            value={targetDate} onChange={e => setTargetDate(e.target.value)} required
                            min={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Linked Course (Optional)</label>
                        <Select
                            value={linkedCourseId}
                            onChange={e => setLinkedCourseId(e.target.value)}
                        >
                            <option value="">None</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </Select>
                    </div>
                    <Button type="submit" className="mt-2 text-primary-foreground">Set Milestone</Button>
                </form>
            </Modal>
        </div>
    );
}
