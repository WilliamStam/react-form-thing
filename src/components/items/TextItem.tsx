import {FieldComponentProps, Item, ItemType} from "@/objects/items.ts";
import {nanoid} from "nanoid";
import {InputText} from "primereact/inputtext";
import React, {useEffect, useState} from "react";

export type TextInputConfig = ItemType & {
    label: string
    value: string
}

const itemConfig: TextInputConfig = {
    id: nanoid(),
    type: "text",
    label: "",
    value: "",
};

const Render: React.FC<FieldComponentProps> = ({config, onChange}) => {
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedData: TextInputConfig = {...{...itemConfig, ...config}, value: event.target.value};
        onChange(updatedData);
    };
    
    const id = Math.random().toString(36).substring(2, 15);
    
    return (
        <>
            <article className="form-item">
                <div className="flex flex-column gap-2">
                    <label htmlFor={id}>{config.label}</label>
                    <InputText
                        value={config.value || ""}
                        onChange={handleOnChange}
                    ></InputText>
                </div>
                <div className={"config-item"}>{JSON.stringify(config)}</div>
            </article>
        </>
    );
};
const Settings: React.FC<FieldComponentProps> = ({config, onChange}) => {
    const [data, setData] = useState<TextInputConfig>({...itemConfig, ...config});
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedData: TextInputConfig = {...data, value: event.target.value};
        setData(updatedData);
    };
    useEffect(() => {
        onChange(data);
    }, [data]);
    
    
    return (
        <>
            <article className="form-item">
                <div className="flex flex-column gap-2">
                    <label htmlFor={"label"}>Label</label>
                    <InputText id={"label"} value={config.value || ""} onChange={handleOnChange}></InputText>
                </div>
                <div className={"config-item"}>{JSON.stringify(config)}</div>
            </article>
        </>
    );
};

export default new Item({
    type: "text",
    render: Render,
    settings: Settings,
    heading: "Text input",
    description: "a simple box to insert a value into",
    hidden: false,
    icon: "fa-solid fa-font",
    default_config: itemConfig
});