// @ts-nocheck
import {FieldComponentProps, Item, ItemRenderer, ItemType} from "@/objects/items.ts";
import {nanoid} from "nanoid";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {FormEvent} from "primereact/ts-helpers";
import React, {useEffect, useState} from "react";

export type DateInputConfig = ItemType & {
    label: string
    value: string
    placeholder: string
    format: string
}

const itemConfig: DateInputConfig = {
    id: nanoid(),
    type: "date",
    label: "",
    value: "",
    placeholder: "",
    format: "yy-mm-dd",
};


const FormComponent: React.FC<FieldComponentProps> = ({config, onChange}) => {
    const [item, setItem] = useState<DateInputConfig>({...itemConfig, ...config});
    useEffect(() => {
        setItem({...itemConfig, ...config});
    }, [config]);
    
    const handleOnChange = (event: FormEvent<(Date | null)[]>) => {
        console.log(event.value);
        const updatedData: DateInputConfig = {...{...itemConfig, ...config}, value: event.value};
        onChange(updatedData);
        setItem(updatedData);
        // console.log(event.value as Date);
        
    };
    
    const id = Math.random().toString(36).substring(2, 15);
    
   
    return (
        <>
            <Calendar
                // value={date}
                // viewDate={date}
                onChange={(e) => {
                    // setDate(e.value);
                    console.log(e.value);
                }}
                dateFormat="yy-mm-dd"
            />
            
            {/* <div className="flex flex-column gap-2"> */}
            {/*     <div>{JSON.stringify(item)}</div> */}
            {/*     <label htmlFor={id}>{item.label}</label> */}
            {/*      */}
            {/*     <Calendar */}
            {/*         // value={item.value} */}
            {/*         // viewDate={item.value} */}
            {/*         onChange={handleOnChange} */}
            {/*         placeholder={item.placeholder || ""} */}
            {/*         className="w-full" */}
            {/*         id={id} */}
            {/*         dateFormat={item.format} */}
            {/*         showIcon */}
            {/*     ></Calendar> */}
            {/* </div> */}
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
                    <div className="flex flex-column gap-2">
                        <label htmlFor={"format"}>Format</label>
                        <InputText
                            id={"format"}
                            value={data.format || ""}
                            name={"format"}
                            onChange={handleOnChange}
                            className="w-full"
                        />
                        <ul>
                            <li>d - day of month (no leading zero)
                            </li>
                            <li>dd - day of month (two digit)
                            </li>
                            <li>o - day of the year (no leading zeros)
                            </li>
                            <li>oo - day of the year (three digit)
                            </li>
                            <li>D - day name short
                            </li>
                            <li>DD - day name long
                            </li>
                            <li>m - month of year (no leading zero)
                            </li>
                            <li>mm - month of year (two digit)
                            </li>
                            <li>M - month name short
                            </li>
                            <li>MM - month name long
                            </li>
                            <li>y - year (two digit)
                            </li>
                            <li>yy - year (four digit)</li>
                        </ul>
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
            return {};
        }
    }),
    settings: new ItemRenderer({
        render: SettingsComponent,
        validation: (item: DateInputConfig) => {
            console.log(item);
            return {};
        }
    }),
    heading: "Date picker input",
    description: "a simple box to select a date",
    hidden: false,
    icon: ["far", "calendar"],
    default_config: itemConfig
});