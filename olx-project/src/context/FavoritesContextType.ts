import type { Product } from "../services/productsApi";
import { createContext } from "react";

export interface FavoritesContextType {
    favorites: Product[];
    addToFavorites: (product: Product) => void;
    removeFromFavorites: (id: number) => void;
    isFavorite: (id: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);