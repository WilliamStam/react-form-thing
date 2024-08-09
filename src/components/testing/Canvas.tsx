import {FormType, HandleFormOnChangeType} from "@/objects/forms.ts";
import {ItemType, HandleFieldOnChangeType} from "@/objects/items.ts";
import {clone_object} from "@/utilities.ts";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {nanoid} from "nanoid";
import React, {forwardRef, useEffect, useState} from "react";
import ItemBlock from "@/components/Item.tsx";

export const Item = forwardRef(({id, item, onChange, ...props}: {
    id: string,
    item: ItemType,
    onChange: HandleFieldOnChangeType
}, ref) => {
    
    return (
        <>
        <div {...props} ref={ref} >
            {item &&
                <ItemBlock item={item} onChange={onChange} id={id}></ItemBlock>
            }
        </div>
        </>
    );
});

export function SortableItem({id, config, onChange}: {
    id: string,
    config: ItemType,
    onChange: HandleFieldOnChangeType
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: id,
        
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    return (
        <>
            <div style={style} ref={setNodeRef} {...attributes} className="drag-block">
                <button {...listeners} className="drag-handle">=</button>
                <div style={{marginLeft:"40px"}}>{id}</div>
                <Item onChange={onChange} item={config}></Item>
            </div>
        
        </>
    );
}

export default function Canvas({form, onChange}: {
    form: FormType,
    onChange: HandleFormOnChangeType
}) {
    const [items, setItems] = useState<ItemType[]>(form?.config ?? []);
    
    useEffect(() => {
        if (form && form.config && form.config != items){
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
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useDroppable({
        id: "canvas_droppable",
        data: {
            parent: null,
            isContainer: true
        }
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };
    
    return (
        <>
            <div
                ref={setNodeRef}
                className="canvas"
                style={style}
                {...attributes}
                {...listeners}
            >
                <div className="canvas-fields">
                    {items.map((item,index) => <SortableItem
                        key={item.id}
                        config={item}
                        id={item.id}
                        onChange={(value: ItemType) => handleFieldUpdate(value, index)}
                    />)}
            </div>
            </div>
            
                
            
        </>
    );
    
   
}