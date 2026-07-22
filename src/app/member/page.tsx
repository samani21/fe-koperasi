"use client"
import MainLayout from '@/Components/Layout/MainLayout'
import { Get } from '@/utils/Get';
import React, { useEffect, useState } from 'react'
import { MemberType } from '../Types/MemberType';
import FormMember from './Components/FormMember';
import { Post } from '@/utils/Post';
import Alert from '@/Components/CRUD/Alert';
import { AlertType } from '@/Components/CRUD/CRUD';

type Props = {}

function page({ }: Props) {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<MemberType | null>(null);
    const [showAlert, setShowAlert] = useState<AlertType | null>(null);

    useEffect(() => {
        getMember();
    }, [])

    const getMember = async () => {
        try {
            const res = await Get<{ success: boolean, data: MemberType }>('member/show');
            if (res?.success) {
                setData(res?.data)
            }
        } catch {
            // Error handling bisa ditambahkan di sini
        } finally {
            setLoading(false);
        }
    }

    const handleFormSubmit = async (formData: FormData, id: number | null) => {
        try {
            const endpoint = `/member/${id}`;
            const res = await Post(endpoint, formData);

            if (res) {
                getMember(); // Refresh data
                setShowAlert({ type: 'success', message: id ? 'Berhasil update data' : 'Berhasil simpan data', isOpen: true });
            }
        } catch (err: any) {
            setShowAlert({ type: 'error', message: 'Gagal proses data: ' + err.message, isOpen: true });
        }
    };

    return (
        <MainLayout>
            {/* Lempar state loading ke dalam FormMember */}
            <FormMember
                handleFormSubmit={handleFormSubmit}
                data={data}
                isLoading={loading}
            />

            {showAlert?.isOpen && (
                <Alert
                    type={showAlert.type}
                    message={showAlert.message}
                    onClose={() => setShowAlert(null)}
                />
            )}
        </MainLayout>
    )
}

export default page