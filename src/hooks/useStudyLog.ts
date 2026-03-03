import { useLocalStorage } from "./useLocalStorage";

export interface StudyLogEntry {
    id: string;
    date: string; // YYYY-MM-DD
    minutes: number;
    note?: string;
    topics: string[];
}

export function useStudyLog() {
    const [studyLog, setStudyLog, isLoaded] = useLocalStorage<StudyLogEntry[]>("consistencie_studyLog", []);

    const addLog = (entry: Omit<StudyLogEntry, "id" | "date"> & { date?: string }) => {
        const dateStr = entry.date || new Date().toISOString().split("T")[0];

        setStudyLog((prev) => {
            // Check if entry for today exists, if so append or just add a new record.
            // Easiest is to just allow multiple entries per day or sum them up. We'll append.
            const newEntry: StudyLogEntry = {
                ...entry,
                id: crypto.randomUUID(),
                date: dateStr,
            };
            return [...prev, newEntry];
        });
    };

    const calculateStreak = () => {
        if (!studyLog.length) return 0;

        // Get unique dates sorted descending
        const dates = [...new Set(studyLog.map(log => log.date))].sort((a, b) => b.localeCompare(a));

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = new Date(yesterday.getTime() - (yesterday.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

        // If today or yesterday isn't in dates, streak is 0
        if (!dates.includes(todayStr) && !dates.includes(yesterdayStr)) {
            return 0;
        }

        let streak = 0;
        let currentDate = new Date(dates.includes(todayStr) ? todayStr : yesterdayStr);

        for (let i = 0; i < 3650; i++) { // cap loop just in case
            const dStr = new Date(currentDate.getTime() - (currentDate.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
            if (dates.includes(dStr)) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    };

    return {
        studyLog,
        isLoaded,
        addLog,
        currentStreak: isLoaded ? calculateStreak() : 0,
    };
}
