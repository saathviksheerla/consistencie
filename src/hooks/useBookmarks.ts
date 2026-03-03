import { useLocalStorage } from "./useLocalStorage";

export type BookmarkCategory = "Repo" | "Docs" | "Reference" | "Tool";

export interface Bookmark {
    id: string;
    title: string;
    url: string;
    category: BookmarkCategory;
    isPinned: boolean;
    createdAt: number;
}

export function useBookmarks() {
    const [bookmarks, setBookmarks, isLoaded] = useLocalStorage<Bookmark[]>("consistencie_bookmarks", []);

    const addBookmark = (bookmark: Omit<Bookmark, "id" | "isPinned" | "createdAt">) => {
        const newBookmark: Bookmark = {
            ...bookmark,
            id: crypto.randomUUID(),
            isPinned: false,
            createdAt: Date.now(),
        };
        setBookmarks((prev) => [...prev, newBookmark]);
    };

    const togglePin = (id: string) => {
        setBookmarks((prev) =>
            prev.map((b) => (b.id === id ? { ...b, isPinned: !b.isPinned } : b))
        );
    };

    const deleteBookmark = (id: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
    };

    return {
        bookmarks,
        isLoaded,
        addBookmark,
        togglePin,
        deleteBookmark,
    };
}
