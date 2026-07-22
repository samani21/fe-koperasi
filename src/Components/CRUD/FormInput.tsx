"use client";

import React, { ChangeEvent, useMemo, useState, useEffect, useRef } from "react";
import { AlertTriangle, Eye, EyeOff, Info, Check } from "lucide-react";
import { SelectOption } from "./CRUD";

// ==========================================
// TYPES
// ==========================================
type Props = {
    label: string;
    type: "text" | "number" | "date" | "email" | "password" | "autocomplete" | "image";
    name: string;
    value?: any;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | any) => void;
    error?: string;
    min?: number | string;
    max?: number | string;
    required?: boolean;
    options?: SelectOption[]; // Hanya dipakai jika type === "autocomplete"
    placeholder?: string;
    disabled?: boolean;
    information?: string;
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function FormInput({
    label, type, name, value, onChange, error, min, max,
    required = false, options = [], placeholder, disabled = false, information
}: Props) {
    // --- States ---
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // --- Base Styles (Tema Koperasi - Green) ---
    const baseInput = `w-full px-4 py-2.5 bg-white border rounded-xl focus:outline-none focus:ring-[3px] transition-all duration-300 text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm
        ${disabled
            ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed shadow-none"
            : "border-slate-200 hover:border-slate-300 focus:border-green-600 focus:ring-green-600/20"
        } ${error ? "!border-red-500 focus:!border-red-500 focus:!ring-red-500/20" : ""}`;

    const fileStyle = `file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 file:transition-colors cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed file:cursor-not-allowed" : ""}`;

    // --- Hooks & Effects ---

    // Autocomplete: Sinkronisasi nilai value ke search input
    useEffect(() => {
        if (type === "autocomplete" && value !== undefined) {
            const selected = options.find((opt) => opt.value?.toString() === value?.toString());
            if (selected) setSearch(selected.label);
            else if (!value) setSearch(""); // Reset jika value kosong
        }
    }, [value, options, type]);

    // Menutup dropdown autocomplete jika klik di luar komponen
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Image: Membuat Object URL untuk Preview Gambar
    useEffect(() => {
        if (type === "image" && value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (type === "image" && typeof value === 'string') {
            // Berjaga-jaga jika value berupa URL gambar yang sudah ada (dari server)
            setPreview(value);
        } else {
            setPreview(null);
        }
    }, [value, type]);

    // Filter options untuk Autocomplete
    const filteredOptions = useMemo(() => {
        if (!open) return [];
        if (!search) return options;
        return options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()));
    }, [search, options, open]);

    // --- Render Switcher ---
    const renderInputElement = () => {
        switch (type) {
            case "autocomplete":
                return (
                    <div ref={wrapperRef} className="relative">
                        <input
                            type="text"
                            disabled={disabled}
                            placeholder={placeholder || `Cari ${label}...`}
                            value={search}
                            onFocus={() => { if (!disabled) { setOpen(true); setSearch(""); } }}
                            onChange={(e) => {
                                if (!disabled) {
                                    setSearch(e.target.value);
                                    setOpen(true);
                                    // Kosongkan value utama jika user mengetik ulang
                                    if (value) onChange({ target: { name, value: '' } });
                                }
                            }}
                            className={baseInput}
                        />
                        {open && !disabled && (
                            <div className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-2 max-h-56 overflow-y-auto shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((opt) => {
                                        const isSelected = opt.value?.toString() === value?.toString();
                                        return (
                                            <div
                                                key={opt.value}
                                                onClick={() => {
                                                    setSearch(opt.label);
                                                    setOpen(false);
                                                    onChange({ target: { name, value: opt.value } });
                                                }}
                                                className={`px-4 py-2.5 cursor-pointer text-sm flex justify-between items-center transition-colors
                                                ${isSelected ? "bg-green-50 text-green-700 font-semibold" : "hover:bg-slate-50 text-slate-700"}`}
                                            >
                                                {opt.label}
                                                {isSelected && <Check size={16} className="text-green-600" />}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="px-4 py-3 text-sm text-slate-400 text-center">Pilihan tidak ditemukan</div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "password":
                return (
                    <div className="relative flex items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            name={name}
                            disabled={disabled}
                            value={value ?? ""}
                            onChange={onChange}
                            placeholder={placeholder}
                            className={`${baseInput} pr-12`}
                        />
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                );

            case "image":
                return (
                    <div className="space-y-3">
                        {preview && (
                            <div className="relative inline-block group">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className={`w-32 h-32 object-cover rounded-xl border border-slate-200 shadow-sm ${disabled ? "opacity-60" : "group-hover:shadow-md transition-shadow"}`}
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            name={name}
                            disabled={disabled}
                            onChange={(e) => {
                                if (disabled) return;
                                const file = e.target.files?.[0];
                                if (file) {
                                    onChange({ target: { name, value: file } });
                                }
                            }}
                            className={`${baseInput} !p-0 !bg-transparent !border-0 !shadow-none ${fileStyle}`}
                        />
                    </div>
                );

            // Default untuk: text, number, date, email
            default:
                return (
                    <input
                        type={type}
                        name={name}
                        disabled={disabled}
                        value={value ?? ""}
                        onChange={onChange}
                        min={type === "number" || type === "date" ? min : undefined}
                        max={type === "number" || type === "date" ? max : undefined}
                        placeholder={placeholder}
                        className={baseInput}
                    />
                );
        }
    };

    return (
        <div className="flex flex-col space-y-2 w-full">
            {/* Header (Label & Info) */}
            <div className="flex items-center gap-2">
                <label className={`text-sm font-bold tracking-wide flex items-center gap-1 ${disabled ? "text-slate-400" : "text-slate-700"}`}>
                    {label} {required && <span className="text-red-500">*</span>}
                </label>

                {information && (
                    <div className="group relative flex items-center justify-center cursor-help">
                        <Info size={16} className="text-slate-400 hover:text-green-600 transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            {information}
                            <svg className="absolute text-slate-800 h-2 w-full left-0 top-full" viewBox="0 0 255 255">
                                <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
                            </svg>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Element */}
            {renderInputElement()}

            {/* Error Message */}
            {error && (
                <p className="text-sm font-medium text-red-500 flex items-center mt-1.5 animate-in slide-in-from-top-1 fade-in duration-200">
                    <AlertTriangle size={16} className="mr-1.5 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}