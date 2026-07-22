export interface UserType {
    id: number;
    name: string;
    email: string;
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
