"use client";

import React, { useEffect, useState } from "react";
import { FrontOfficeType } from "./Type";
import FormInput from "@/Components/CRUD/FormInput";
import ButtonSubmit from "@/Components/CRUD/ButtonSubmit";

type Props = {
    handleFormSubmit: (form: FormData, id: number | null) => void;
    data: FrontOfficeType | null;
    onCancel?: () => void;
};

interface FormState {
    name: string;
    email: string;
    password: string;
}

interface FormErrors {
    name?: string | null;
    email?: string | null;
    password?: string | null;
}

const CreateOrUpdate = ({ handleFormSubmit, data, onCancel }: Props) => {
    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        password: '',
    });

    const [error, setError] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    // Sinkronisasi data saat props `data` berubah (Misal edit data)
    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                email: data.email || "",
                password: '' // Password sengaja dikosongkan saat edit demi keamanan
            });
        } else {
            setForm({ name: "", email: "", password: '' });
        }
        setError({});
    }, [data]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (error[name as keyof FormErrors]) {
            setError((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validasi Input Frontend (SOP 1: Cegah request buang-buang server kalau form kosong)
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!form.name.trim()) {
            newErrors.name = "Nama Front Office harus diisi";
            hasError = true;
        }
        if (!form.email.trim()) {
            newErrors.email = "Email harus diisi";
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
                if (val !== null && val !== undefined && val !== "") {
                    formData.append(key, String(val).trim()); // trim untuk amankan spasi berlebih
                }
            });

            await handleFormSubmit(formData, data?.id ?? null);
        } catch (err) {
            console.error("Terjadi kesalahan saat menyimpan data front office:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
                type="text"
                label="Nama Front Office"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Budi Santoso"
                error={error.name ?? ''}
                required={true}
            />
            <FormInput
                type="email"
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Contoh: budi@example.com"
                error={error.email ?? ''}
                required={true}
            />
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
            <ButtonSubmit onClose={onCancel} isSubmitting={loading} />
        </form>
    );
};

export default CreateOrUpdate;