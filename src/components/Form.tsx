// import TextInput from "@/components/inputs/TextInput.tsx";
import SelectInput from "@/items/SelectInput.tsx";
import TextInput from "@/items/TextInput.tsx";
import {Field} from "@/objects.ts";
import {FormType, ItemType} from "@/types/form.ts";
import React, {useState, useEffect} from "react";
import {getForm} from "@/service.ts";
const Items: Record<string, Field> = {
    "text": TextInput,
    "select": SelectInput,
};

const Form = ({id}: {
    id: string
}) => {
    
    
    
    const [form, setForm] = useState<FormType>();
    
    const fetchForm = async (id:string) => {
        await getForm(id).then((formData) => setForm(formData));
    }
    
    const handleFieldUpdate = (updatedField: ItemType, index: number) => {
        if (form){
            const updatedData: ItemType[] = [...form.config];
            updatedData[index] = updatedField;
            form.config = updatedData
            setForm(form);
        }
    };

    
    console.log("fuck you react")
    
    useEffect(()=>{
        console.log(id)
        fetchForm(id)
    },[id])

    
    return (
        <>
            <h1>{form?.id} - {form?.label}</h1>
            <div>
                {form?.config.map((block, index) => {
                    // component does exist
                    if (typeof Items[block.type] !== "undefined") {
                        return React.createElement(Items[block.type].render, {
                            key: index,
                            config: block,
                            onUpdateField: (updatedField: ItemType) => handleFieldUpdate(updatedField, index)
                        });
                    }
                    // component doesn't exist yet
                    return React.createElement(
                        () => <div>The component {block.type} was not found.</div>,
                        {key: index}
                    );
                })}
            </div>
            {!form && <div>loading...</div>}
            <div>
                {JSON.stringify(form)}
                
            </div>
        </>
    );
};

export default Form;