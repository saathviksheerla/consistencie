"use client";

import { useAuth } from "@/providers/AuthProvider";

export function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <header className="w-full h-16 border-b border-border bg-card/50 backdrop-blur shrink-0 flex items-center justify-between px-6 z-10 hidden md:flex">
            <div className="flex-1"></div>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <button
                    onClick={() => logout()}
                    className="text-xs ml-4 font-medium px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                    Log Out
                </button>
            </div>
        </header>
    );
}
