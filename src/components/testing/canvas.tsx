import {FormType, HandleFormOnChangeType} from "@/objects/forms.ts";
import {HandleFieldOnChangeType, ItemType} from "@/objects/items.ts";
import {clone_object} from "@/utilities.ts";
import {useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";

import ItemBlock from "@/components/Item.tsx";
import React, {useEffect, useState} from "react";



export function Field(props) {
    const {item, overlay, ...rest} = props;
    
    
    let className = "";
    if (overlay) {
        className += " overlay";
    }
    
    return (
        <div className={className}>
            <ItemBlock item={item} {...rest} />
        </div>
    );
}

export function SortableItem({id, config, onChange}: {
    id: string,
    config: ItemType,
    onChange: HandleFieldOnChangeType
}) {
    
    const {attributes, listeners, setNodeRef, transform, transition} =
        useSortable({
            id,
            data: {
                id,
                item:config,
            },
        });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    if (config.type=="spacer"){
        return (
            <>
            <div ref={setNodeRef} {...attributes}>spacer</div>
            </>
        )
    }
    return (
        <div ref={setNodeRef} style={style} {...attributes} className="drag-block">
            <button {...listeners} className="drag-handle">=</button>
            <Field item={config} onChange={onChange}/>
        </div>
    );
}

export default function Canvas({form, onChange}: {
    form: FormType,
    onChange: HandleFormOnChangeType
}) {
    const [items, setItems] = useState<ItemType[]>(form?.config ?? []);
    
    useEffect(() => {
        if (form && form.config && form.config != items) {
            console.log("resetting items", form, form.config, items)
            setItems(form.config ?? []);
        }
    }, [form, items]);
    //
    // useEffect(() => {
    //     // Update the document title using the browser API
    //     console.log("watching it",items)
    //     onChange(items)
    // },[items]);
    
    
    const handleFieldUpdate = (updatedField: ItemType, index: number) => {
        if (form) {
            const new_form = clone_object<FormType>(form)
            const updatedData: ItemType[] = new_form.config;
            updatedData[index] = updatedField;
            new_form.config = updatedData
            // form.config = updatedData
            setItems(new_form.config)
            onChange(new_form);
            console.log("handleFieldUpdate", new_form)
        }
    };
    
    
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
        <div ref={setNodeRef} className="canvas" style={style} {...listeners}>
            <div className="canvas-fields">
                {items?.map((item, index) => (
                    <SortableItem
                        key={item.id}
                        id={item.id}
                        config={item}
                        onChange={(value: ItemType) => handleFieldUpdate(value, index)}
                    />
                ))}
            </div>
        </div>
    );
}