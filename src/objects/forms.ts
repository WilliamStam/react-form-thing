import {ItemType} from "@/objects/items.ts";

export type FormType = {
    id: number | null,
    label: string | null,
    created_at: string | null,
    config: ItemType[]
}
export type HandleFormOnChangeType = (values: FormType) => void;
export type HandleFormConfigOnChangeType = (values: ItemType[]) => void;