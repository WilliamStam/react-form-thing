import {Field, FieldComponentProps} from "@/objects.ts";
import {ItemType} from "@/types/form.ts";
import {Dropdown} from "primereact/dropdown";
import React from "react";


type SelectOptionType = {
    value: string
    label: string
}

export type SelectOptionInput = ItemType & {
    name: string
    value: string
    options: SelectOptionType[]
}
const itemConfig: SelectOptionInput = {
    type: "select",
    name: "",
    value: "",
    options: []
};

const Render: React.FC<FieldComponentProps> = ({config, onUpdateField}) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedField: SelectOptionInput = {...itemConfig, ...config, value: event.target.value};
        onUpdateField(updatedField);
    };
    
    return (
        <>
            <article className="form-item">
                <label>
                    <Dropdown
                        value={config.value || ""}
                        onChange={handleOnChange}
                        options={config.options}
                    > </Dropdown>
                </label>
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
    type: "select",
    render: Render,
    settings: Settings,
    heading: "Select box",
    description: "select from a list of items in a drop down",
    hidden: false,
    icon: ["far", "square-caret-down"],
});