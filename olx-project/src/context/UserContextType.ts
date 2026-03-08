import { createContext } from "react";

export interface User {
    username: string;
    email: string;
    token?: string;
}

export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);