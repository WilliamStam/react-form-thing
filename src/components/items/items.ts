import {InputGroup, SelectGroup} from "@/components/items/groups.ts";
import TextItem from "@/components/items/input/TextItem.tsx";
import DateTimeItem from "@/components/items/input/DateItem.tsx";
import NumberItem from "@/components/items/input/NumberItem.tsx";
import SelectItem from "@/components/items/select/SelectItem.tsx";
import {ItemRegistry} from "@/objects/items.ts";


const items = new ItemRegistry();
items.registerItem(TextItem, InputGroup);
items.registerItem(NumberItem, InputGroup);
items.registerItem(DateTimeItem, InputGroup);
items.registerItem(SelectItem, SelectGroup);


export default items;