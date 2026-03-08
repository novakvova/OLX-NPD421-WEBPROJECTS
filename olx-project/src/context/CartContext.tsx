import { useState, type ReactNode } from "react";
import { CartContext } from "./CartContextType";
import type { Product } from "../services/productsApi";

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartItems, setCartItems] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        setCartItems(prev => [...prev, product]);
    };

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}