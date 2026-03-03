import { useLocalStorage } from "./useLocalStorage";

export type MilestoneStatus = "Not Started" | "In Progress" | "Done";

export interface Milestone {
    id: string;
    title: string;
    targetDate: string; // YYYY-MM-DD
    linkedCourseId?: string;
    status: MilestoneStatus;
    createdAt: number;
}

export function useMilestones() {
    const [milestones, setMilestones, isLoaded] = useLocalStorage<Milestone[]>("consistencie_milestones", []);

    const addMilestone = (milestone: Omit<Milestone, "id" | "status" | "createdAt">) => {
        const newEntry: Milestone = {
            ...milestone,
            id: crypto.randomUUID(),
            status: "Not Started",
            createdAt: Date.now(),
        };
        setMilestones((prev) => [...prev, newEntry]);
    };

    const updateStatus = (id: string, status: MilestoneStatus) => {
        setMilestones((prev) =>
            prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
    };

    const deleteMilestone = (id: string) => {
        setMilestones((prev) => prev.filter((m) => m.id !== id));
    };

    return {
        milestones,
        isLoaded,
        addMilestone,
        updateStatus,
        deleteMilestone,
    };
}
