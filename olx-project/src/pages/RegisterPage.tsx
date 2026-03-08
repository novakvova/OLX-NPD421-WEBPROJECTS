import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { register } from "../services/authApi";
import { useUser } from "../context/useUser";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const user = await register(username, email, password);
            setUser(user);
            navigate("/profile");
        } catch (err) {
            console.error("Помилка реєстрації:", err);
            setError("Помилка реєстрації. Можливо такий email вже існує.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h1 className="text-3xl font-black text-gray-900 mb-2 text-center">Реєстрація</h1>
                <p className="text-gray-400 text-sm text-center mb-6">Створіть свій акаунт</p>

                {error && (
                    <div className="mb-4 text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Ім'я користувача"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-200 bg-gray-50 p-4 rounded-xl text-base outline-none focus:border-[#0057b8] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-200 bg-gray-50 p-4 rounded-xl text-base outline-none focus:border-[#0057b8] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-200 bg-gray-50 p-4 rounded-xl text-base outline-none focus:border-[#0057b8] focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-[#0057b8] hover:bg-[#0046a0] text-white font-bold p-4 rounded-xl transition-all text-base mt-1"
                        style={{ boxShadow: "0 4px 14px rgba(0,87,184,0.3)" }}
                    >
                        Зареєструватися
                    </button>
                </form>

                <p className="text-center text-sm text-gray-400 mt-6">
                    Вже маєте акаунт?{" "}
                    <NavLink to="/login" className="text-[#0057b8] font-semibold hover:underline">
                        Увійти
                    </NavLink>
                </p>
            </div>
        </div>
    );
}