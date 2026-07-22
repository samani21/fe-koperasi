type Align = "left" | "center" | "right";

export interface Column<T> {
    key: keyof T | string;
    label: string;
    width?: string;
    align?: Align;
    render?: (row: T, index: number) => React.ReactNode;
}


export interface AlertType {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
}

export interface Meta {
    last_page: number;
    limit: number;
    page: number;
    total: number;
}

export type SelectOption = {
    value: string | number;
    label: string;
};