import { createContext } from "react";
import type { Product } from "../services/productsApi";

export interface CartContextType {
    cartItems: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);