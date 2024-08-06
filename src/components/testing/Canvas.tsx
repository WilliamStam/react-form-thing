import {ItemType} from "@/objects/items.ts";
import {useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities";
import {useSortable} from "@dnd-kit/sortable";
import {FormType} from "@/objects/forms.ts";
import {Button} from "primereact/button";
import {useState} from "react";
import {renderers} from "./fields";
import ItemBlock from "@/components/Item"
import {HandleFieldOnChangeType} from "@/objects/items.ts";
import {HandleFormConfigOnChangeType} from "@/objects/forms.ts";




function SortableField({id,item, onChange}: {
    id: string,
    item: ItemType,
    onChange: HandleFieldOnChangeType
}) {
    // console.log("render SortableField",item)
    
    const {attributes, listeners, setNodeRef, transform, transition} =
        useSortable({
            id,
            data: {item},
        });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    return (
        <>
            <div ref={setNodeRef} style={style} {...attributes}>
                <div  >
                    <div className="item-admin-buttons">
                        <Button icon="pi pi-pencil" size="small" outlined/> <Button
                        icon="pi pi-trash"
                        size="small"
                        outlined
                    /> <Button icon="pi pi-arrows-v" size="small" outlined {...listeners}/>
                    </div>
                </div>
                <ItemBlock item={item} onChange={onChange}></ItemBlock>
            </div>
        
        </>
    );
}

export default function Canvas({items, onChange}: {
    items: ItemType[],
    onChange: HandleFormConfigOnChangeType
}) {
    // console.log("rendering Canvas");
    const [items_list, setItems] = useState<ItemType[]>(items);
    
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
    
    
    const handleFieldUpdate = (updatedField: ItemType, index: number) => {
            const updatedData: ItemType[] = [...items];
            updatedData[index] = updatedField;
            // form.config = updatedData
            onChange(updatedData);
            console.log(updatedField, index)
    };
    
    return (
        <div ref={setNodeRef} className="canvas" style={style} {...listeners}>
            <div className="canvas-fields">
                {items.map((item, index) => (
                    <SortableField
                        key={index}
                        id={item.id}
                        item={item}
                        onChange={(conf: ItemType) => handleFieldUpdate(conf, index)}
                    />
                ))}
            </div>
        </div>
    );
}