"use client";

import React, { useEffect, useState, useCallback } from "react";
import FormInput from "@/Components/CRUD/FormInput";
import { MemberType } from "@/app/Types/MemberType";
import Cropper from "react-easy-crop";
import { X, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { formatImage } from "@/utils/FormatImage";

type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: MemberType | null;
    isLoading?: boolean;
};

interface FormState {
    full_name: string;
    email: string;
    phone: string; // 1. Tambahkan state phone
    nik: string;
    address: string;
    password: string;
    photo: Blob | null;
    photoPreview: string;
    remove_photo: boolean;
}

interface FormErrors {
    full_name?: string | null;
    email?: string | null;
    phone?: string | null; // 2. Tambahkan error phone
    nik?: string | null;
    address?: string | null;
    password?: string | null;
}

const FormMember = ({ handleFormSubmit, data, isLoading }: Props) => {
    const [form, setForm] = useState<FormState>({
        full_name: "",
        email: "",
        phone: "",
        nik: "",
        address: "",
        password: '',
        photo: null,
        photoPreview: "",
        remove_photo: false,
    });

    const [error, setError] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    // --- State untuk Modal Crop ---
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const baseApi = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    useEffect(() => {
        if (data) {
            setForm({
                full_name: data.full_name || "",
                email: data.user?.email || "",
                phone: (data as any).phone || "", // Ambil data phone lama jika ada
                nik: data?.user?.nik || "",
                address: (data as any).address || "",
                password: '',
                photo: null,
                photoPreview: data.photo ? formatImage(data.photo) ?? '' : "",
                remove_photo: false,
            });
        } else {
            setForm({ full_name: "", email: "", phone: "", nik: "", address: "", password: '', photo: null, photoPreview: "", remove_photo: false });
        }
        setError({});
    }, [data, baseApi]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "nik") {
            const numericValue = value.replace(/[^0-9]/g, "");
            if (numericValue.length > 16) return;
            setForm((prev) => ({ ...prev, [name]: numericValue }));
        }
        // 3. LOGIKA AUTO-FORMAT PHONE +62
        else if (name === "phone") {
            // Bersihkan semua karakter kecuali angka dan plus
            let val = value.replace(/[^0-9+]/g, "");

            if (val.length > 0) {
                // Jika user ngetik "0", ubah jadi "+62"
                if (val.startsWith("0")) {
                    val = "+62" + val.substring(1);
                }
                // Jika user ngetik "62", tambahkan "+"
                else if (val.startsWith("62")) {
                    val = "+" + val;
                }
                // Jika tidak diawali "+62", paksa jadi "+62"
                else if (!val.startsWith("+62")) {
                    const cleanNumber = val.replace(/\+/g, '');
                    val = "+62" + cleanNumber;
                }
            }

            // Batasi maksimal 15 digit
            if (val.length > 16) return;

            setForm((prev) => ({ ...prev, [name]: val }));
        }
        else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }

        if (error[name as keyof FormErrors]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setIsCropModalOpen(true);
            };
            e.target.value = "";
        }
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPx: any) => {
        setCroppedAreaPixels(croppedAreaPx);
    }, []);

    const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob | null> => {
        const image = new Image();
        image.src = imageSrc;
        await new Promise((resolve) => (image.onload = resolve));

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
            0, 0, pixelCrop.width, pixelCrop.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/webp", 0.9);
        });
    };

    const handleCropImage = async () => {
        try {
            if (imageSrc && croppedAreaPixels) {
                const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
                if (croppedBlob) {
                    const croppedUrl = URL.createObjectURL(croppedBlob);
                    setForm((prev) => ({
                        ...prev,
                        photo: croppedBlob,
                        photoPreview: croppedUrl,
                        remove_photo: false
                    }));
                }
            }
        } catch (e) {
            console.error("Gagal melakukan crop gambar:", e);
        } finally {
            setIsCropModalOpen(false);
            setImageSrc(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.full_name.trim()) {
            newErrors.full_name = "Nama Anggota harus diisi";
            hasError = true;
        }

        if (!form.nik.trim()) {
            newErrors.nik = "NIK harus diisi";
            hasError = true;
        } else if (form.nik.length !== 16) {
            newErrors.nik = "NIK harus terdiri dari 16 digit angka";
            hasError = true;
        }

        if (!form.address.trim()) {
            newErrors.address = "Alamat harus diisi";
            hasError = true;
        }

        // Validasi opsional: Jika diisi, pastikan panjangnya wajar
        if (form.phone && form.phone.length < 10) {
            newErrors.phone = "Nomor telepon tidak valid";
            hasError = true;
        }

        if (hasError) {
            setError(newErrors);
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();

            Object.entries(form).forEach(([key, val]) => {
                if (key !== "photo" && key !== "photoPreview" && key !== "remove_photo" && val !== null && val !== undefined && val !== "") {
                    formData.append(key, String(val).trim());
                }
            });

            if (form.remove_photo) {
                formData.append("remove_photo", "1");
            }

            if (form.photo) {
                formData.append("photo", form.photo, "profile.webp");
            }

            await handleFormSubmit(formData, data?.id ?? null);
        } catch (err) {
            console.error("Terjadi kesalahan saat menyimpan data:", err);
        } finally {
            setLoading(false);
        }
    };

    // --- TAMPILAN SKELETON ---
    if (isLoading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 shrink-0 bg-slate-200 rounded-2xl"></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-10 w-full bg-slate-200 rounded-xl"></div>
                            <div className="h-3 w-3/4 bg-slate-200 rounded-md"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Skeleton Nama & NIK */}
                    <div className="space-y-2">
                        <div className="h-4 w-28 bg-slate-200 rounded-md"></div>
                        <div className="h-11 w-full bg-slate-200 rounded-xl"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-16 bg-slate-200 rounded-md"></div>
                        <div className="h-11 w-full bg-slate-200 rounded-xl"></div>
                    </div>

                    {/* Skeleton Email & Phone */}
                    <div className="space-y-2">
                        <div className="h-4 w-20 bg-slate-200 rounded-md"></div>
                        <div className="h-11 w-full bg-slate-200 rounded-xl"></div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
                        <div className="h-11 w-full bg-slate-200 rounded-xl"></div>
                    </div>

                    {/* Skeleton Alamat & Password */}
                    <div className="md:col-span-2 space-y-2">
                        <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
                        <div className="h-24 w-full bg-slate-200 rounded-xl"></div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <div className="h-4 w-36 bg-slate-200 rounded-md"></div>
                        <div className="h-11 w-full bg-slate-200 rounded-xl"></div>
                    </div>
                </div>

                <div className="pt-4">
                    <div className="h-[56px] w-full bg-slate-200 rounded-2xl"></div>
                </div>
            </div>
        );
    }

    // --- TAMPILAN FORM ASLI ---
    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Foto Profil</label>

                    <div className="w-full md:flex items-start justify-between gap-6">
                        <div className="flex items-center gap-6 w-full">
                            {form.photoPreview ? (
                                <div className="relative w-24 h-24 shrink-0">
                                    <img
                                        src={form.photoPreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-2xl border-2 border-green-100 shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, photo: null, photoPreview: "", remove_photo: true }))}
                                        className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-full shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-24 h-24 shrink-0 bg-slate-50 border border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400">
                                    <UploadCloud className="w-8 h-8 mb-1" />
                                    <span className="text-[10px] font-medium">No Image</span>
                                </div>
                            )}

                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 transition-all cursor-pointer"
                                />
                                <p className="text-xs text-slate-400 mt-2">
                                    Format didukung: JPG, PNG, WEBP. Maks 2MB. Gambar otomatis dipotong 1:1.
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <FormInput
                                type="text"
                                label="Nomor Anggota"
                                name="number_member"
                                value={data?.member_number}
                                onChange={handleChange}
                                placeholder="Contoh: Budi Santoso"
                                disabled
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Baris 1: Nama & NIK */}
                    <FormInput
                        type="text"
                        label="Nama Anggota"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder="Contoh: Budi Santoso"
                        disabled
                        error={error.full_name ?? ''}
                    />

                    <div className="flex flex-col">
                        <FormInput
                            type="text"
                            label="NIK"
                            name="nik"
                            value={form.nik}
                            onChange={handleChange}
                            placeholder="Contoh: 3171234567890001"
                            error={error.nik ?? ''}
                            disabled={data?.user?.nik ? true : false}
                        />
                        {!error.nik && (
                            <p className="text-[11px] font-medium text-slate-400 mt-1 ml-1 flex items-center">
                                * Masukkan tepat 16 digit angka ({form.nik.length}/16)
                            </p>
                        )}
                    </div>

                    {/* Baris 2: Email & Phone */}
                    <FormInput
                        type="email"
                        label="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Contoh: budi@example.com"
                        error={error.email ?? ''}
                        disabled={true}
                    />

                    <FormInput
                        type="text"
                        label="No. Telepon / WA"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Contoh: +6281234567890"
                        error={error.phone ?? ''}
                    />

                    <div className="md:col-span-2">
                        <FormInput
                            type="textarea"
                            label="Alamat Lengkap"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            placeholder="Contoh: Jl. Sudirman No. 12, Jakarta"
                            error={error.address ?? ''}
                            required={true}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <FormInput
                            type="password"
                            label="Password (Opsional)"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            error={error.password ?? ''}
                            information={
                                data
                                    ? "Kosongkan jika tidak ingin mengubah password."
                                    : "Password default sesuai nama jika dikosongkan."
                            }
                        />
                    </div>
                </div>

                <div className="flex items-center justify-right gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className=" flex-grow group relative overflow-hidden py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-md shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>MENGIRIM...</span>
                                </>
                            ) : (
                                <>
                                    <span>SIMPAN</span>
                                    <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </form>

            {/* --- Modal Cropper --- */}
            {isCropModalOpen && imageSrc && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                            <h3 className="font-bold text-slate-800">Sesuaikan Foto</h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCropModalOpen(false);
                                    setImageSrc(null);
                                }}
                                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="relative w-full h-[400px] bg-slate-900">
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="rect"
                            />
                        </div>

                        <div className="p-6 bg-white z-10 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCropModalOpen(false);
                                        setImageSrc(null);
                                    }}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCropImage}
                                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/30 transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    Terapkan Crop
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FormMember;