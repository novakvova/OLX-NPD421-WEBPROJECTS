import { useState } from "react";
import { Heart, MapPin, Clock, Trash2 } from "lucide-react";
import type { Product as APIProduct } from "../services/productsApi";
import { useCart } from "../context/useCart";
import { useFavorites } from "../context/useFavorites";

interface Props {
    product: APIProduct;
    onDelete?: () => void;
}

export default function ProductCard({ product, onDelete }: Props) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);

    const { addToCart } = useCart();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    const favorite = isFavorite(Number(product.id));

    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (favorite) removeFromFavorites(Number(product.id));
        else addToFavorites({ ...product, id: Number(product.id) });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) onDelete();
    };

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: "#fff",
                borderRadius: 14,
                overflow: "hidden",
                border: hovered ? "1.5px solid #0057b8" : "1.5px solid #e8edf2",
                boxShadow: hovered
                    ? "0 8px 24px rgba(0,87,184,0.12)"
                    : "0 1px 4px rgba(0,0,0,0.05)",
                transform: hovered ? "translateY(-3px)" : "none",
                transition: "all 0.2s ease",
                cursor: "pointer",
                position: "relative",
            }}
        >
            <div
                style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    background: "#f4f6f9",
                    overflow: "hidden",
                }}
            >
                {!imgError ? (
                    <img
                        src={product.imageUrl}
                        alt={product.title}
                        onError={() => setImgError(true)}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transform: hovered ? "scale(1.05)" : "scale(1)",
                            transition: "transform 0.4s ease",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 48,
                        }}
                    >
                        📦
                    </div>
                )}

                <button
                    onClick={toggleFavorite}
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 50,
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.95)",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                >
                    <Heart
                        size={16}
                        strokeWidth={2}
                        style={{
                            fill: favorite ? "#e03131" : "none",
                            color: favorite ? "#e03131" : "#8aa4bf",
                        }}
                    />
                </button>

                {onDelete && (
                    <button
                        onClick={handleDelete}
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.95)",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        }}
                    >
                        <Trash2 size={16} strokeWidth={2} color="#8aa4bf" />
                    </button>
                )}
            </div>

            <div style={{ padding: "14px 16px" }}>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#0057b8", marginBottom: 6 }}>
                    {product.price.toLocaleString("uk-UA")} ₴
                </p>
                <p style={{ fontSize: 14, marginBottom: 10 }}>{product.title}</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                    }}
                    style={{
                        marginBottom: 10,
                        width: "100%",
                        background: "#0057b8",
                        color: "#fff",
                        fontWeight: 600,
                        padding: "10px",
                        borderRadius: 12,
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Додати в кошик
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8aa4bf" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin size={13} /> {product.location}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={12} /> {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
        </div>
    );
}