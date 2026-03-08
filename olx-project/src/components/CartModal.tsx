import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/useCart";
import type { Product } from "../services/productsApi";
import { ShoppingCart, Trash2, MapPin, CreditCard, Banknote, CheckCircle2, Package } from "lucide-react";

export default function CartModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const [checkout, setCheckout] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [payment, setPayment] = useState<"card" | "cash">("card");

    if (!open) return null;

    const total = cartItems.reduce((sum: number, item: Product) => sum + item.price, 0);

    const handleBuy = () => {
        if (!name || !address) {
            alert("Будь ласка введіть ім'я та адресу");
            return;
        }
        setOrderComplete(true);
        clearCart();
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setCheckout(false);
            setOrderComplete(false);
            setName("");
            setAddress("");
            setPayment("card");
        }, 300);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
            onClick={handleClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden"
                style={{ boxShadow: "0 32px 80px rgba(0,87,184,0.18)" }}
            >
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-[#0057b8] to-[#0080ff] px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {!orderComplete && (
                            checkout
                                ? <Package size={22} className="text-white/90" />
                                : <ShoppingCart size={22} className="text-white/90" />
                        )}
                        <h2 className="text-xl font-black text-white tracking-tight">
                            {orderComplete ? "Дякуємо!" : checkout ? "Оформлення" : "Ваш кошик"}
                        </h2>
                        {!orderComplete && !checkout && cartItems.length > 0 && (
                            <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                                {cartItems.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors text-white text-lg font-light"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-8">
                    <AnimatePresence mode="wait">

                        {/* === CART VIEW === */}
                        {!checkout && !orderComplete && (
                            <motion.div key="cart" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }}>
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center py-10 text-center">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                                            <ShoppingCart size={28} className="text-gray-300" />
                                        </div>
                                        <p className="text-gray-400 font-medium">Кошик порожній</p>
                                        <p className="text-gray-300 text-sm mt-1">Додайте товари зі списку</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col gap-3 max-h-72 overflow-y-auto mb-6 pr-1">
                                            {cartItems.map((item: Product) => (
                                                <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                                                    <div className="w-12 h-12 rounded-xl bg-[#0057b8]/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {item.imageUrl
                                                            ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-xl" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                                            : <span className="text-xl">📦</span>
                                                        }
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-800 text-sm truncate">{item.title}</p>
                                                        <p className="text-[#0057b8] font-bold text-base">{item.price.toLocaleString("uk-UA")} ₴</p>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0"
                                                    >
                                                        <Trash2 size={14} className="text-red-400" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="bg-[#f0f6ff] rounded-2xl p-4 mb-5 flex items-center justify-between">
                                            <span className="text-gray-600 font-semibold">Разом до оплати</span>
                                            <span className="text-[#0057b8] font-black text-xl">{total.toLocaleString("uk-UA")} ₴</span>
                                        </div>

                                        <button
                                            onClick={() => setCheckout(true)}
                                            className="w-full bg-[#0057b8] hover:bg-[#0046a0] text-white font-bold py-4 rounded-2xl transition-all text-base"
                                            style={{ boxShadow: "0 6px 20px rgba(0,87,184,0.3)" }}
                                        >
                                            Оформити замовлення →
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        )}

                        {/* === CHECKOUT VIEW === */}
                        {checkout && !orderComplete && (
                            <motion.div key="checkout" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.18 }} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    placeholder="Ваше ім'я"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border border-gray-200 bg-gray-50 px-5 py-4 rounded-2xl text-base outline-none focus:border-[#0057b8] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Адреса доставки"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full border border-gray-200 bg-gray-50 pl-10 pr-5 py-4 rounded-2xl text-base outline-none focus:border-[#0057b8] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                {/* Payment toggle */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setPayment("card")}
                                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-semibold text-sm transition-all ${payment === "card" ? "border-[#0057b8] bg-[#f0f6ff] text-[#0057b8]" : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"}`}
                                    >
                                        <CreditCard size={18} /> Карткою
                                    </button>
                                    <button
                                        onClick={() => setPayment("cash")}
                                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl border-2 font-semibold text-sm transition-all ${payment === "cash" ? "border-[#0057b8] bg-[#f0f6ff] text-[#0057b8]" : "border-gray-200 bg-gray-50 text-gray-400 hover:border-gray-300"}`}
                                    >
                                        <Banknote size={18} /> Готівкою
                                    </button>
                                </div>

                                <div className="flex items-center justify-between bg-[#f0f6ff] rounded-2xl px-5 py-3 mt-1">
                                    <span className="text-gray-500 text-sm font-medium">До оплати</span>
                                    <span className="text-[#0057b8] font-black text-lg">{total.toLocaleString("uk-UA")} ₴</span>
                                </div>

                                <div className="flex gap-3 mt-1">
                                    <button
                                        onClick={() => setCheckout(false)}
                                        className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-semibold hover:border-gray-300 transition-all"
                                    >
                                        ← Назад
                                    </button>
                                    <button
                                        onClick={handleBuy}
                                        className="flex-1 bg-[#0057b8] hover:bg-[#0046a0] text-white font-bold py-4 rounded-2xl transition-all"
                                        style={{ boxShadow: "0 6px 20px rgba(0,87,184,0.3)" }}
                                    >
                                        Замовити
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* === SUCCESS VIEW === */}
                        {orderComplete && (
                            <motion.div key="complete" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex flex-col items-center text-center py-6">
                                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
                                    <CheckCircle2 size={40} className="text-green-500" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">Замовлення прийнято!</h3>
                                <p className="text-gray-400 text-sm mb-8">Ваш товар буде доставлений протягом 48 годин.</p>
                                <button
                                    onClick={handleClose}
                                    className="bg-[#0057b8] hover:bg-[#0046a0] text-white font-bold px-10 py-4 rounded-2xl transition-all"
                                    style={{ boxShadow: "0 6px 20px rgba(0,87,184,0.3)" }}
                                >
                                    Чудово!
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}