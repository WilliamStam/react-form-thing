import SelectInput from "@/inputs/SelectInput.tsx";
import TextInput from "@/inputs/TextInput.tsx";
import {Input} from "@/objects/inputs.ts"

const Inputs: Record<string, Input> = {
    "text": TextInput,
    "select": SelectInput,
};

export default Inputs