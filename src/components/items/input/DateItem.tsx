import {FieldComponentProps, Item, ItemRenderer, ItemType} from "@/objects/items.ts";
import {nanoid} from "nanoid";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import React, {useEffect, useState} from "react";

export type DateInputConfig = ItemType & {
    label: string
    value: string
}

const itemConfig: DateInputConfig = {
    id: nanoid(),
    type: "date",
    label: "",
    value: "",
    placeholder: "",
};

const FormComponent: React.FC<FieldComponentProps> = ({config, onChange}) => {
    const [item, setItem] = useState<DateInputConfig>({...itemConfig, ...config});
    useEffect(() => {
        setItem({...itemConfig, ...config});
    }, [config]);
    
    const handleOnChange = (event: React.ChangeEvent<React.SyntheticEvent>) => {
        console.log(event.value.toString());
        const updatedData: DateInputConfig = {...{...itemConfig, ...config}, value: event.value};
        console.log("UPDATEDDATA",updatedData);
        // onChange(updatedData);
        setItem(updatedData);
        console.log(event)
        
    };
    
    const id = Math.random().toString(36).substring(2, 15);
    
    return (
        <>
            <div className="flex flex-column gap-2">
                <label htmlFor={id}>{config.label}</label>
                <Calendar
                    value={item.value}
                    onChange={handleOnChange}
                    placeholder={item.placeholder || ""}
                    className="w-full"
                    id={id}
                    dateFormat="dd/mm/yy"
                    showIcon
                ></Calendar>
            </div>
        </>
    );
};
const SettingsComponent: React.FC<FieldComponentProps> = ({config, onChange}) => {
    const [data, setData] = useState<DateInputConfig>({...itemConfig, ...config});
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedData: DateInputConfig = {...data, [event.target.name]: event.target.value};
        setData(updatedData);
        onChange(updatedData);
    };
    
    
    useEffect(() => {
        setData({...itemConfig, ...config});
    }, [config]);
    
    
    return (
        <>
            <Accordion activeIndex={0}> <AccordionTab header="General" key="general">
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
            </AccordionTab> </Accordion>
        
        </>
    );
};

export default new Item({
    type: itemConfig.type,
    form: new ItemRenderer({
        render: FormComponent,
        validation: (item: DateInputConfig) => {
            console.log(item);
        }
    }),
    settings: new ItemRenderer({
        render: SettingsComponent,
        validation: (item: DateInputConfig) => {
            console.log(item);
        }
    }),
    heading: "Date picker input",
    description: "a simple box to select a date",
    hidden: false,
    icon: "fa-regular fa-calendar",
    default_config: itemConfig
});