import { ReactElement } from "react";
import { LayoutDashboard, Users, Wallet } from "lucide-react";

// INTERFACES
export interface MenuChild {
    label: string;
    href: string;
}

export interface MenuSide {
    Icon: React.ElementType;
    label: string;
    count?: number;
    href: string;
    child?: MenuChild[];
    role: string[];
    children?: ReactElement<Element>;
}

export const menuSidebar: MenuSide[] = [
    {
        Icon: LayoutDashboard,
        label: "Dashboard",
        href: '/superadmin',
        role: ['superadmin']
    },
    {
        Icon: LayoutDashboard,
        label: "Dashboard",
        href: '/front-office',
        role: ['frontoffice', 'fo']
    },
    {
        Icon: LayoutDashboard,
        label: "Beranda Anggota",
        href: '/member',
        role: ['member']
    },
    {
        Icon: Users,
        label: "Data Master",
        href: '/superadmin/master',
        role: ['superadmin'],
        child: [
            {
                label: 'Front Office',
                href: 'front-office'
            },
            {
                label: 'Anggota',
                href: 'member'
            },
        ]
    },
    {
        Icon: Users,
        label: "Data Master",
        href: '/front-office/master',
        role: ['frontoffice'],
        child: [
            {
                label: 'Anggota',
                href: 'member'
            },
        ]
    }
];