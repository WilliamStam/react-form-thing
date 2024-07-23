import SelectItem from "@/components/items/SelectItem.tsx";
import TextItem from "@/components/items/TextItem.tsx";
import {Item} from "@/objects/items.ts"

const items: Record<string, Item> = {
    "text": TextItem,
    "select": SelectItem,
};

export default items