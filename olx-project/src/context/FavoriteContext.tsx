import { useState, type ReactNode } from "react";
import { FavoritesContext } from "./FavoritesContextType.ts";
import type { Product } from "../services/productsApi";

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
    const [favorites, setFavorites] = useState<Product[]>([]);

    const addToFavorites = (product: Product) => {
        setFavorites(prev => [...prev, product]);
    };

    const removeFromFavorites = (id: number) => {
        setFavorites(prev => prev.filter(p => p.id !== id));
    };

    const isFavorite = (id: number) => favorites.some(p => p.id === id);

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};