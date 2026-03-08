import { useUser } from "../context/useUser";
import { Navigate, useNavigate } from "react-router-dom";
import { User, Mail, LogOut } from "lucide-react";

export default function ProfilePage() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    if (!user) return <Navigate to="/login" />;

    const handleLogout = () => {
        setUser(null);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-[#0057b8]/10 flex items-center justify-center mb-4">
                        <User size={36} className="text-[#0057b8]" />
                    </div>
                    <h1 className="text-2xl font-black text-gray-900">Профіль</h1>
                    <p className="text-gray-400 text-sm mt-1">Ваші особисті дані</p>
                </div>

                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <User size={18} className="text-[#0057b8] flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Ім'я</p>
                            <p className="font-semibold text-gray-800">{user.username}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <Mail size={18} className="text-[#0057b8] flex-shrink-0" />
                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">Email</p>
                            <p className="font-semibold text-gray-800">{user.email}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 font-semibold p-4 rounded-xl transition-all border border-red-100"
                >
                    <LogOut size={18} />
                    Вийти
                </button>
            </div>
        </div>
    );
}