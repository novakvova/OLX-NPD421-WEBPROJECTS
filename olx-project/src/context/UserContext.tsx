import { useState, useEffect, type ReactNode } from "react";
import { UserContext, type User } from "./UserContextType";

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUserState(JSON.parse(storedUser));
    }, []);

    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}