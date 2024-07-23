import {ItemType} from "@/objects/items.ts";

export type FormType = {
    id: number,
    label: string,
    created_at: string,
    config: ItemType[]
}