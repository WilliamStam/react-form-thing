import {TextInputConfig} from "@/components/items/TextItem.tsx";
import {FieldComponentProps, Item, ItemType} from "@/objects/items.ts";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import React, {useEffect, useState} from "react";
import {nanoid} from 'nanoid'
type SelectOptionType = {
    value: string
    label: string
}

export type SelectOptionInput = ItemType & {
    label: string
    value: string
    options: SelectOptionType[]
}
const itemConfig: SelectOptionInput = {
    id: nanoid(),
    type: "select",
    label: "",
    value: "",
    options: [{label:"a",value:"A"}, {label: "b", value: "B"}]
};

const Render: React.FC<FieldComponentProps> = ({config, onChange}) => {
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedData: TextInputConfig = {...{...itemConfig, ...config}, value: event.target.value};
        onChange(updatedData);
    };
    
    return (
        <>
            <article className="form-item">
                <label>
                    <Dropdown
                        value={config.value || ""}
                        onChange={handleOnChange}
                        options={config.options}
                        showClear placeholder={config.label || ""}
                        className={'w-full'}
                    > </Dropdown>
                </label>
                <div className={"config-item"}>{JSON.stringify(config)}</div>
            </article>
        
        
        </>
    );
};
const Settings: React.FC<FieldComponentProps> = ({config, onChange}) => {
    const [data, setData] = useState<SelectOptionInput>({...itemConfig, ...config});
    
    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedData: SelectOptionInput = {...data, [event.target.name]: event.target.value};
        setData(updatedData);
        
    };
    
    useEffect(() => {
        onChange(data);
    }, [data]);
    
    return (
        <>
            <div>
                <InputText
                    name={'label'}
                    value={config.label || ""}
                    onChange={handleOnChange}
                ></InputText>
            </div>
            {/* <div>{JSON.stringify(config)}</div> */}
        </>
    );
};

export default new Item({
    type: "select",
    render: Render,
    settings: Settings,
    heading: "Select box",
    description: "select from a list of items in a drop down",
    hidden: false,
    icon: "fa-regular fa-square-caret-down",
    default_config: itemConfig
});