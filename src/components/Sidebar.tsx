"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IconHome, IconBookOpen, IconBookmark, IconCalendar, IconMap, IconFlame } from "./Icons";
import { useSettings } from "@/hooks/useSettings";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

const navigation = [
    { name: "Dashboard", href: "/", icon: IconHome },
    { name: "Courses", href: "/courses", icon: IconBookOpen },
    { name: "Bookmarks", href: "/bookmarks", icon: IconBookmark },
    { name: "Log", href: "/log", icon: IconCalendar },
    { name: "Roadmap", href: "/roadmap", icon: IconMap },
];

export function Sidebar({ className = "" }: { className?: string }) {
    const pathname = usePathname();
    const { settings, updateSettings, isLoaded } = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [tempTime, setTempTime] = useState("18:00");

    const openSettings = () => {
        if (isLoaded) setTempTime(settings.reminderTime);
        setIsSettingsOpen(true);
    };

    const saveSettings = (e: React.FormEvent) => {
        e.preventDefault();
        updateSettings({ reminderTime: tempTime });
        setIsSettingsOpen(false);
    };

    return (
        <>
            <div className={`flex flex-col h-full bg-card p-4 ${className}`}>
                <div className="flex items-center gap-2 px-2 py-4 mb-8">
                    <div className="bg-accent text-accent-foreground p-1.5 rounded-lg">
                        <IconFlame className="w-5 h-5 text-zinc-950" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">consistencie</span>
                </div>

                <nav className="flex-1 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive
                                        ? "bg-primary/20 text-accent font-medium"
                                        : "text-muted-foreground hover:bg-muted/50 hover:text-white"
                                    }
                `}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto px-2 py-4 border-t border-border flex justify-between items-center">
                    <p className="text-xs text-muted-foreground hidden lg:block">Keep up the momentum.</p>
                    <button
                        onClick={openSettings}
                        className="text-xs font-medium text-muted-foreground hover:text-white transition-colors p-2 hover:bg-muted rounded-md"
                        title="Settings"
                    >
                        ⚙️
                    </button>
                </div>
            </div>

            <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Settings">
                <form onSubmit={saveSettings} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Daily Reminder Time</label>
                        <p className="text-xs text-muted-foreground mb-3">Set a time to receive a browser push notification so you don't break your streak.</p>
                        <Input
                            type="time"
                            value={tempTime}
                            onChange={e => setTempTime(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="mt-2 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors">
                        Save Preferences
                    </button>
                </form>
            </Modal>
        </>
    );
}
