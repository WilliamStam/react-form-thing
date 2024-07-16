import {InputType} from "@/objects/inputs.ts";

export type FormType = {
    id: number,
    label: string,
    created_at: string,
    config: InputType[]
}