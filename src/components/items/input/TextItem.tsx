import {DateInputConfig} from "@/components/items/input/DateItem.tsx";
import {FieldComponentProps, Item, ItemType, ItemRenderer} from "@/objects/items.ts";
import {nanoid} from "nanoid";
import {InputText} from "primereact/inputtext";
import React, {useEffect, useState} from "react";
import {render} from "sass";
import {InputGroup} from "@/components/items/groups.ts"
import {Accordion, AccordionTab} from "primereact/accordion";

export type TextInputConfig = ItemType & {
    label: string
    value: string
}

const itemConfig: TextInputConfig = {
    id: nanoid(),
    type: "text",
    label: "",
    value: "",
    placeholder: "",
};

const FormComponent: React.FC<FieldComponentProps> = ({config, onChange}) => {
    const [item, setItem] = useState<DateInputConfig>({...itemConfig, ...config});
    useEffect(() => {
        setItem({...itemConfig, ...config});
    }, [config]);
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedData: TextInputConfig = {...{...itemConfig, ...config}, value: event.target.value};
        onChange(updatedData);
        setItem(updatedData)
    };
    
    
    
    const id = Math.random().toString(36).substring(2, 15);
    
    return (
        <>
                <div className="flex flex-column gap-2">
                    <label htmlFor={id}>{config.label}</label>
                    <InputText
                        value={item.value}
                        onChange={handleOnChange}
                        placeholder={item.placeholder}
                        className="w-full"
                        id={id}
                    ></InputText>
                </div>
        </>
    );
};
const SettingsComponent: React.FC<FieldComponentProps> = ({config, onChange}) => {
    const [data, setData] = useState<TextInputConfig>({...itemConfig, ...config});
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedData: TextInputConfig = {...data, [event.target.name]: event.target.value};
        setData(updatedData);
        onChange(updatedData);
    };
    
    
    useEffect(() => {
        setData({...itemConfig, ...config});
    }, [config]);
    
    
    return (
        <>
            <Accordion activeIndex={0}>
                <AccordionTab header="General" key="general">
                <div className="form-item flex flex-column gap-4">
                    
                    <div className="flex flex-column gap-2">
                        <label htmlFor={"label"}>Label</label>
                        <InputText
                            id={"label"}
                            value={data.label || ""}
                            name={"label"}
                            onChange={handleOnChange}
                            className="w-full"
                        />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor={"placeholder"}>Placeholder</label>
                        <InputText
                            id={"placeholder"}
                            value={data.placeholder || ""}
                            name={"placeholder"}
                            onChange={handleOnChange}
                            className="w-full"
                        />
                    </div>
                </div>
            </AccordionTab>
            </Accordion>
       
        </>
    );
};

export default new Item({
    type: itemConfig.type,
    form: new ItemRenderer({
        render: FormComponent,
        validation: (item: TextInputConfig)=>{console.log(item)}
    }),
    settings: new ItemRenderer({
        render: SettingsComponent,
        validation: (item: TextInputConfig)=>{console.log(item)}
    }),
    heading: "Text input",
    description: "a simple box to insert a value into",
    hidden: false,
    icon: "fa-solid fa-font",
    default_config: itemConfig
});