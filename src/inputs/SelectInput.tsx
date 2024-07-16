import {FieldComponentProps, Input, InputType} from "@/objects/inputs.ts";
import {Dropdown} from "primereact/dropdown";
import {InputText} from "primereact/inputtext";
import React, {useEffect, useState} from "react";
type SelectOptionType = {
    value: string
    label: string
}

export type SelectOptionInput = InputType & {
    label: string
    value: string
    options: SelectOptionType[]
}
const itemConfig: SelectOptionInput = {
    type: "select",
    label: "",
    value: "",
    options: []
};

const Render: React.FC<FieldComponentProps> = ({config, onUpdateField}) => {
    const [data, setData] = useState<SelectOptionInput>({...itemConfig, ...config});
    
    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedData: SelectOptionInput = {...data, value: event.target.value};
        setData(updatedData);
        
    };
    useEffect(() => {
        onUpdateField(data);
    }, [data]);
    
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
                <div className={"config-item"}>{JSON.stringify(data)}</div>
            </article>
        
        
        </>
    );
};
const Settings: React.FC<FieldComponentProps> = ({config, onUpdateField}) => {
    const [data, setData] = useState<SelectOptionInput>({...itemConfig, ...config});
    
    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedData: SelectOptionInput = {...data, [event.target.name]: event.target.value};
        setData(updatedData);
        
    };
    useEffect(() => {
        onUpdateField(data);
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
            <div>{JSON.stringify(config)}</div>
        </>
    );
};

export default new Input({
    type: "select",
    render: Render,
    settings: Settings,
    heading: "Select box",
    description: "select from a list of items in a drop down",
    hidden: false,
    icon: ["far", "square-caret-down"],
});