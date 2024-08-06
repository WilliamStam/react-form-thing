import Items from "@/items.ts";
import {useDraggable} from "@dnd-kit/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {nanoid} from "nanoid";
import React, {useRef} from "react";



export function ItemInPanel({item}) {
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

function DraggableSidebarField(props) {
    const {item, ...rest} = props;
    
    const id = useRef(nanoid());
    
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: id.current,
        data: {
            item,
            fromSidebar: true,
        },
    });
    
    return (
        <div ref={setNodeRef} className="sidebar-field" {...attributes}>
            <ItemInPanel item={item} {...rest} {...listeners} />
        </div>
    );
}

export default function Sidebar(props) {
    console.log("rendering Sidebar")
    const {fieldsRegKey} = props;
    const items = Items;
    
    
    return (
        <div key={fieldsRegKey} className="sidebar">
            {Object.keys(items).map((key) => {
                return (<DraggableSidebarField key={`item-${key}`} item={items[key]}/>)
            })}
        </div>
    );
}