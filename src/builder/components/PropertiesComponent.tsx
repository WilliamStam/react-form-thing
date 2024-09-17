import items from "@/items/items.ts";
import {FormType} from "@/objects/forms.ts";
import {ItemType} from "@/objects/items.ts";
import {clone_object} from "@/utilities.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import React, {useEffect, useState} from "react";

const ItemSettings = ({item, onChange}: {
    item: ItemType,
    onChange: (item: ItemType) => void
}) => {
    const item_object = items.getByItem(item)
    if (item_object) {
        return React.createElement(item_object.settings.render, {
            config: item,
            onChange: onChange
        });
    }
    // component doesn't exist yet
    return React.createElement(
        () => <div>The component {item.type} was not found.</div>,
    );
};
export default function PropertiesComponent({form, onFormChange, activeItem, setActiveItem}: {
    form: FormType,
    onFormChange: (form: FormType) => void,
    activeItem?: ItemType,
    setActiveItem: (item: ItemType | undefined) => void,
    
}) {
    console.log("reloading PropertiesComponent");
    const [editing_form, setEditingForm] = useState(form);
    const [editing_item, setEditingItem] = useState(activeItem);
    
    const handleFormItemChange = (value: ItemType) => {
        console.log("handleFormItemChange", value);
        //
        setEditingItem(value);
        // //
        const new_form = clone_object(editing_form);
        new_form.config = new_form.config.map((it) => {
            if (it.id == value.id) {
                return value;
            }
            return it;
        });
        onFormChange(new_form);
    };
    const handleOnFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedData: FormType = {...editing_form, [event.target.name]: event.target.value};
        console.log(updatedData);
        setEditingForm(updatedData);
        onFormChange(updatedData);
    };
    
    const handleCancel = () => {
        setActiveItem(undefined);
    };
    
    console.log("activeItem", editing_item);
    
    useEffect(() => {
        setEditingItem(activeItem);
    }, [activeItem]);
    
    useEffect(() => {
        setEditingForm(form);
    }, [form]);
    
    
    // useEffect(() => {
    //     const new_form = clone_object(form)
    //     new_form.config = new_form.config.map((it: ItemType) => {
    //         if (item.id == it.id) {
    //             return item
    //         }
    //         return it
    //     })
    //     // onFormChange(new_form)
    // }, [item]);
    
    
    
    
    if (editing_item) {
        const item = items.getByItem(editing_item);
        if (item){
            return (
                <>
                    <div className="item-panel-item flex">
                        <div className="item-icon mr-2">
                            <FontAwesomeIcon icon={item.icon}/>
                        </div>
                        <div>
                            <h2>{item.heading}</h2>
                        </div>
                    </div>
                    
                    <ItemSettings item={editing_item} onChange={handleFormItemChange}></ItemSettings>
                    
                    <Button onClick={handleCancel} size="small" className={"w-full mt-5"}>Done</Button>
                </>
            );
        }
        return React.createElement(
            () => <div>The component {editing_item.type} was not found.</div>,
        );
        
    } else {
        return (
            <>
                <div className="item-panel-item flex px-3">
                    
                    <div>
                        <h1>Form Settings</h1>
                    </div>
                </div>
                <Accordion activeIndex={0}> <AccordionTab header="General" key="general">
                    <div className="form-item flex flex-column gap-4">
                        
                        <div className="flex flex-column gap-2">
                            <label htmlFor="label">Form label</label>
                            <InputText
                                onChange={handleOnFormChange}
                                name={"label"}
                                value={editing_form.label ?? ""}
                                className={"w-full"}
                            ></InputText>
                        </div>
                    </div>
                </AccordionTab> </Accordion>
            </>
        );
    }
    
    
}