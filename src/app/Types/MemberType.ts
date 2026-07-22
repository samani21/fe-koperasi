export interface UserType {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    nik: string;
}

export interface MemberType {
    id: number;
    address: string;
    member_number: string;
    full_name: string;
    phone: string;
    photo: string;
    user: UserType;
}
