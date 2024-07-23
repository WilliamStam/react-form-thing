// import TextInput from "@/components/inputs/TextInput.tsx";

import {InputTextarea} from "primereact/inputtextarea";
import {ItemType} from "@/objects/items.ts";
import items from "@/items.ts";
import {FormType} from "@/objects/forms.ts";
import React, {useState, useEffect, useRef} from "react";
import {getForm} from "@/service.ts";


const Form = ({id}: {
    id: string,
}) => {
    const [form, setForm] = useState<FormType>();
    
    const fetchForm = async (id: string) => {
        await getForm(id).then((formData) => setForm(formData));
    };
    
    const handleFieldUpdate = (updatedField: ItemType, index: number) => {
        if (form) {
            const updatedData: ItemType[] = [...form.config];
            updatedData[index] = updatedField;
            const new_form_value = {...form, config: updatedData};
            // form.config = updatedData
            setForm(new_form_value);
        }
    };
    
    const textRef = useRef<HTMLTextAreaElement>();
    const handleJsonChange = () => {
        const new_form_value = {...form, ...JSON.parse(textRef.current.value)};
        setForm(new_form_value);
    };
    
    console.log("fuck you react");
    
    useEffect(() => {
        fetchForm(id);
    }, [id]);
    
    return (
        <>
            <h1>{form?.id} - {form?.label}</h1>
            <div>
                {form?.config.map((block, index) => {
                    // component does exist
                    if (typeof items[block.type] !== "undefined") {
                        return React.createElement(items[block.type].render, {
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