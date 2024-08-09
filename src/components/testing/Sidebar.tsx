import Items from "@/items.ts";
import {Item, ItemType} from "@/objects/items.ts";
import {useDraggable} from "@dnd-kit/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {nanoid} from "nanoid";
import React, {useRef} from "react";



export function ItemInPanel({item,...rest}:{
    item: Item
}) {
    
    return (
        <>
            <div className="item-panel-item flex p-2 w-100">
                <div className="item-icon mr-2">
                    <FontAwesomeIcon icon={item.icon}/>
                </div>
                <div>
                    <div className="item-title">{item.heading}</div>
                    <div className="item-text">{item.description}</div>
                </div>
            </div>
        </>
    )
}

function DraggableSidebarField({item,...rest}:{
    item: Item
}) {
    
    const id = useRef(nanoid());
    // console.log(id)
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: id.current,
        data: {
            item,
            fromSidebar: true,
        },
    });
    
    return (
        <div ref={setNodeRef} className="sidebar-field" {...attributes} {...listeners} {...rest}>
            <ItemInPanel item={item} {...rest}  />
        </div>
    );
}

export default function Sidebar({fieldsRegKey}: {fieldsRegKey: number}) {
    console.log("rendering Sidebar")
    const items = Items;
    console.log(fieldsRegKey)
    
    return (
        <div className="sidebar" key={fieldsRegKey}>{fieldsRegKey}
            {Object.keys(items).map((key) => {
                return (<DraggableSidebarField key={`sidebar-${key}`} item={items[key]}/>)
            })}
        </div>
    );
}