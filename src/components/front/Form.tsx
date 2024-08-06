// import TextInput from "@/components/inputs/TextInput.tsx";

import {InputTextarea} from "primereact/inputtextarea";
import {ItemType} from "@/objects/items.ts";
import items from "@/items.ts";
import {FormType} from "@/objects/forms.ts";
import React, {useState, useEffect, useRef} from "react";
import {getForm} from "@/service.ts";
import ItemBlock from "@/components/Item"
import {clone_object} from "@/utilities"
const Form = ({id}: {
    id: string,
}) => {
    const [form, setForm] = useState<FormType>();
    
    const handleFieldUpdate = (updatedField: ItemType, index: number) => {
        if (form) {
            const updatedData: ItemType[] = [...form.config];
            updatedData[index] = updatedField;
            const new_form_value = {...form, config: updatedData};
            // form.config = updatedData
            setForm(new_form_value);
            console.log(updatedField,index)
        }
    };
    
    const textRef = useRef<HTMLTextAreaElement>();
    const handleJsonChange = () => {
        const new_form_value = {...clone_object(form), ...JSON.parse(textRef.current.value)};
        setForm(new_form_value);
    };
    
    console.log("fuck you react");
    
    
    const fetchForm = async (id: string) => {
        await getForm(id).then((formData) => setForm(formData));
    };
    useEffect(() => {
        console.log("Fetching form",id)
        fetchForm(id);
    }, [id]);
    
    
    
    return (
        <>
            <h1>{form?.id} - {form?.label}</h1>
            <div>
                {form?.config.map((block, index) => {
                    // component does exist
                    return <ItemBlock
                        item={block}
                        key={`item-${index}`}
                        onChange={(conf: ItemType) => handleFieldUpdate(conf,index)}
                    ></ItemBlock>
                })}
            </div>
            {!form && <div>loading...</div>}
            <div>
                <InputTextarea
                    style={{
                        width: "100%",
                        height: "100px"
                    }}
                    defaultValue={JSON.stringify(form)}
                    ref={textRef}
                    onBlur={handleJsonChange}
                ></InputTextarea>
            </div>
        </>
    );
};

export default Form;