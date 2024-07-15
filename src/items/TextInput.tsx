import {InputText} from "primereact/inputtext";
import {Field, FieldComponentProps} from "@/objects.ts";
import React from "react";
import {ItemType} from "@/types/form.ts"
export type TextInputConfig = ItemType & {
    label: string
    value: string
}

const itemConfig: TextInputConfig = {
    type: "text",
    label: "",
    value: "",
};

const Render: React.FC<FieldComponentProps> = ({config, onUpdateField}) => {
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedField: TextInputConfig = {...itemConfig, ...config, value: event.target.value};
        onUpdateField(updatedField);
    };
    
    const id = Math.random().toString(36).substring(2, 15)
    
    return (
        <>
            <article className="form-item">
            <div className="flex flex-column gap-2">
                <label htmlFor={id}>{config.label}</label>
                <InputText id={id} value={config.value || ""} onChange={handleOnChange}></InputText>
            </div>
            <div className={"config-item"}>{JSON.stringify(config)}</div>
            </article>
        </>
    );
};
const Settings: React.FC<FieldComponentProps> = ({...props}) => {
    return (
        <>
            <h1>Settings</h1>
            <div>{JSON.stringify(props.config)}</div>
        </>
    );
};

export default new Field({
    type: "text",
    render: Render,
    settings: Settings,
    heading: "Text input",
    description: "a simple box to insert a value into",
    hidden: false,
    icon: ["fas", "font"],
});