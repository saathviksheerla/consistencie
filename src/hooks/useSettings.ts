import { useLocalStorage } from "./useLocalStorage";

export interface Settings {
    reminderTime: string; // HH:mm format
    streakFreezeUsed: boolean;
}

const defaultSettings: Settings = {
    reminderTime: "18:00",
    streakFreezeUsed: false,
};

export function useSettings() {
    const [settings, setSettings, isLoaded] = useLocalStorage<Settings>("consistencie_settings", defaultSettings);

    const updateSettings = (updates: Partial<Settings>) => {
        setSettings((prev) => ({ ...prev, ...updates }));
    };

    return {
        settings,
        isLoaded,
        updateSettings,
    };
}
