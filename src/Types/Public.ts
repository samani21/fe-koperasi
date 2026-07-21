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