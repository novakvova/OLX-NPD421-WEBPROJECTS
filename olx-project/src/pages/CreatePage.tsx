import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, MapPin, Upload, X, Package, DollarSign, AlignLeft } from "lucide-react";
import { CATEGORIES } from "../constant/Categories";
import { useCreateProductMutation } from "../services/productsApi";

interface FormState {
    title: string;
    description: string;
    price: string;
    location: string;
    category: string;
}

interface FormErrors {
    title?: string;
    price?: string;
    location?: string;
    category?: string;
    global?: string;
}

export default function CreateProduct() {
    const [form, setForm] = useState<FormState>({ title: "", description: "", price: "", location: "", category: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const [createProduct, { isLoading: loading }] = useCreateProductMutation();

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!form.title.trim()) newErrors.title = "Назва товару обов'язкова";
        else if (form.title.length < 3) newErrors.title = "Мінімум 3 символи";
        if (!form.price.trim()) newErrors.price = "Вкажіть ціну";
        else if (isNaN(Number(form.price)) || Number(form.price) <= 0) newErrors.price = "Введіть коректну ціну";
        if (!form.location.trim()) newErrors.location = "Вкажіть розташування";
        if (!form.category) newErrors.category = "Оберіть категорію";
        return newErrors;
    };

    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSuccess(false);
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
        setErrors({});
        try {

            let uploadedImageUrl = "";
            if (imageFile) {
                const formData = new FormData();
                formData.append("file", imageFile);
                const uploadRes = await fetch("https://localhost:5000/api/products/upload", {
                    method: "POST",
                    body: formData,
                });
                if (uploadRes.ok) {
                    const { url } = await uploadRes.json();
                    uploadedImageUrl = url;
                }
            }

            await createProduct({
                title: form.title,
                price: Number(form.price),
                location: form.location,
                category: form.category,
                imageUrl: uploadedImageUrl,
                userId: 1,
            }).unwrap();
            setSuccess(true);
            setForm({ title: "", description: "", price: "", location: "", category: "" });
            setImagePreview(null);
            setImageFile(null);
            setTimeout(() => navigate("/"), 1500);
        } catch {
            setErrors({ global: "Помилка сервера. Спробуйте пізніше." });
        }
    };

    const categories = CATEGORIES.filter(c => c !== 'Всі');

    return (
        <div style={{ minHeight: "calc(100vh - 80px)", background: "linear-gradient(135deg, #f0f4ff 0%, #f5f7fa 50%, #eef2ff 100%)" }}
             className="flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-3xl">


                <div className="text-center mb-8">
                    <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">Нове оголошення</h1>
                    <p className="text-gray-400 text-base">Розкажіть про свій товар</p>
                </div>


                {errors.global && (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-2xl mb-4 text-sm">
                        <AlertCircle size={16} className="flex-shrink-0" />{errors.global}
                    </div>
                )}
                {success && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl mb-4 text-sm">
                        <CheckCircle size={16} className="flex-shrink-0" />Товар успішно опубліковано! Переходимо на головну...
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ boxShadow: "0 25px 60px rgba(0,87,184,0.12)" }}>


                    <div className="p-10 pb-0">
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        {imagePreview ? (
                            <div className="relative rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: '21/8' }}>
                                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                <button
                                    onClick={() => { setImagePreview(null); setImageFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                                >
                                    <X size={15} className="text-gray-600" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full mb-8 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/50 hover:bg-blue-50 hover:border-[#0057b8] transition-all flex flex-col items-center justify-center gap-3 py-12 cursor-pointer group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#0057b8]/10 flex items-center justify-center group-hover:bg-[#0057b8]/20 transition-colors">
                                    <Upload size={20} className="text-[#0057b8]" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-600">Додати фотографію</p>
                                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG до 10MB</p>
                                </div>
                            </button>
                        )}
                    </div>


                    <div className="px-10 pb-10 space-y-8">


                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-2.5">Назва товару</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                placeholder="Наприклад: iPhone 14 Pro, 256GB"
                                className={`w-full rounded-xl px-5 py-5 text-lg text-gray-800 placeholder-gray-300 outline-none transition-all border ${errors.title ? "border-red-200 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-100 bg-gray-50 focus:border-[#0057b8] focus:bg-white focus:ring-2 focus:ring-blue-100"}`}
                            />
                            {errors.title && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.title}</p>}
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2.5">
                                    <span className="inline-flex items-center gap-1.5"><DollarSign size={13} className="text-[#0057b8]" />Ціна (₴)</span>
                                </label>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                                    placeholder="0"
                                    className={`w-full rounded-xl px-5 py-5 text-lg text-gray-800 placeholder-gray-300 outline-none transition-all border ${errors.price ? "border-red-200 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-100 bg-gray-50 focus:border-[#0057b8] focus:bg-white focus:ring-2 focus:ring-blue-100"}`}
                                />
                                {errors.price && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-base font-semibold text-gray-700 mb-2.5">
                                    <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-[#0057b8]" />Місто</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    placeholder="Київ"
                                    className={`w-full rounded-xl px-5 py-5 text-lg text-gray-800 placeholder-gray-300 outline-none transition-all border ${errors.location ? "border-red-200 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100" : "border-gray-100 bg-gray-50 focus:border-[#0057b8] focus:bg-white focus:ring-2 focus:ring-blue-100"}`}
                                />
                                {errors.location && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{errors.location}</p>}
                            </div>
                        </div>


                        <div>
                            <label className="block text-base font-semibold text-gray-700 mb-3">Категорія</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setForm({ ...form, category: cat })}
                                        className={`px-5 py-3 rounded-xl text-base font-medium transition-all ${
                                            form.category === cat
                                                ? 'bg-[#0057b8] text-white shadow-md shadow-blue-200'
                                                : 'bg-gray-50 border border-gray-100 text-gray-500 hover:border-[#0057b8] hover:text-[#0057b8] hover:bg-blue-50'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                            {errors.category && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle size={11} />{errors.category}</p>}
                        </div>


                        <div>
                            <label className="flex items-center gap-1.5 text-base font-semibold text-gray-700 mb-2.5">
                                <AlignLeft size={13} className="text-[#0057b8]" /> Опис
                                <span className="text-gray-300 font-normal">(необов'язково)</span>
                            </label>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Стан товару, комплектація, особливості..."
                                className="w-full rounded-xl border border-gray-100 bg-gray-50 px-5 py-5 text-lg text-gray-800 placeholder-gray-300 outline-none transition-all focus:border-[#0057b8] focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none"
                            />
                        </div>


                        <button
                            disabled={loading}
                            onClick={handleSubmit}
                            className="w-full bg-[#0057b8] hover:bg-[#0046a0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-5 rounded-2xl transition-all flex items-center justify-center gap-2"
                            style={{ boxShadow: "0 8px 24px rgba(0,87,184,0.35)" }}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Публікація...
                                </>
                            ) : (
                                <>
                                    <Package size={18} strokeWidth={2} />
                                    Опублікувати оголошення
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}