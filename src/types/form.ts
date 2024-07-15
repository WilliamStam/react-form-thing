export type ItemType = {
    type: string;
    [key: string]: any;
}

export type FormType = {
    id: number,
    label: string,
    created_at: string,
    config: ItemType[]
}