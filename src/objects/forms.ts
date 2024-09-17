import {ItemType} from "@/objects/items.ts";

export type FormType = {
    id: number | null,
    label: string | null,
    created_at: string | null,
    config: ItemType[]
}