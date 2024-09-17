import {FormType} from "@/objects/forms.ts";
import {ItemType} from "@/objects/items.ts";
import ItemBlock from "@/render/Item.tsx";
import {clone_object} from "@/utilities.ts";
import {useDroppable} from "@dnd-kit/core";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Button} from "primereact/button";
import {ButtonGroup} from "primereact/buttongroup";

import {confirmDialog} from "primereact/confirmdialog";
import {useEffect, useState} from "react";


export function SortableItem({id, config, active, setActive, onItemChange, onItemRemove}: {
    id: string,
    config: ItemType,
    active?: ItemType,
    setActive: (item: ItemType | undefined) => void,
    onItemChange: (item: ItemType) => void
    onItemRemove: (id: string) => void
}) {
    
    const {attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition} =
        useSortable({
            id,
            data: {
                id,
                item: config,
            },
            
        });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    let className = "sortable-item";
    if (config.id == active?.id) {
        className = className + " active";
    }
    
    
    const confirm = () => {
        confirmDialog({
            message: "Are you sure you want to remove this item?",
            header: "Confirmation",
            icon: "pi pi-exclamation-triangle",
            accept: () => onItemRemove(id),
            // reject: () => rejectFunc()
        });
    };
    let editBtn = <Button size="small" outlined label="Edit" icon="pi pi-pencil" onClick={() => setActive(config)}/>;
    if (active && active.id == config.id) {
        editBtn = <Button size="small" outlined label="Done" icon="pi pi-pencil" onClick={() => setActive(undefined)}/>;
    }
   
    return (
        <>
        <div ref={setNodeRef} style={style} {...attributes} className={className}>
            
            <ItemBlock item={config} onChange={onItemChange}/>
            
            <div className="flex flex-row align-items-center item-footer">
                <div className="flex-grow-1 item-type"> {config.type}</div>
                
                <ButtonGroup>
                    <Button {...listeners}
                        // @ts-ignore
                        ref={setActivatorNodeRef}
                        size="small"
                        outlined
                        label="Order"
                        icon="pi pi-sort"
                    />
                    
                    {editBtn}
                    
                    <Button size="small" outlined label="Remove" icon="pi pi-trash" onClick={confirm}/> </ButtonGroup>
            </div>
        
        
        </div>
        </>
    );
}

export default function CanvasComponent({form, onFormChange, activeItem, setActiveItem}: {
    form: FormType,
    onFormChange: (form: FormType) => void,
    activeItem?: ItemType,
    setActiveItem: (item: ItemType | undefined) => void,
    
}) {
    console.log("reloading CanvasComponent");
    const [items, setItems] = useState<ItemType[]>(form?.config ?? []);
    
    useEffect(() => {
        if (form && form.config && form.config != items) {
            console.log("resetting items", form, form.config, items);
            setItems(form.config ?? []);
        }
    }, [form]);
    
    
    const handleItemRemove = (item_id: string) => {
        
        const new_form = clone_object(form);
        new_form.config = new_form.config.filter(it =>
            it.id != item_id
        );
        onFormChange(new_form);
        if (activeItem && activeItem.id == item_id) {
            setActiveItem(undefined);
        }
        
    };
    
    const handleItemChange = (value: ItemType) => {
        const new_items: ItemType[] = items.map((item: ItemType) => {
            if (item.id == value.id) {
                return value;
            }
            return item;
        });
        setItems(new_items);
        
        const new_form = clone_object<FormType>(form);
        new_form.config = new_items;
        onFormChange(new_form);
    };
    
    // @ts-ignore
    const {listeners, setNodeRef, transform, transition} = useDroppable({
        id: "canvas_droppable",
        data: {
            parent: null,
            isContainer: true,
        },
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    return (
        <div ref={setNodeRef} className="canvas p-4" style={style} {...listeners}>
            {items?.map((item) => (
                <SortableItem
                    key={item.id}
                    id={item.id}
                    config={item}
                    active={activeItem}
                    setActive={setActiveItem}
                    onItemChange={handleItemChange}
                    onItemRemove={handleItemRemove}
                />
            ))}
        </div>
    );
}