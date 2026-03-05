"use client";

import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import React, { useMemo } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}

// Wrapper hook to keep compatibility with our previous mock components
export function useAuth() {
    const { data: session, status } = useSession();

    const user = useMemo(() => session?.user
        ? {
            id: session.user.id,
            name: session.user.name || "Student",
            email: session.user.email || "",
            isGuest: false,
        }
        : null, [session?.user]);

    return {
        user,
        isLoading: status === "loading",
        login: () => signIn("google", { callbackUrl: "/dashboard" }), // Triggers Google sign-in explicitly
        logout: () => signOut({ callbackUrl: "/" }),
    };
}
