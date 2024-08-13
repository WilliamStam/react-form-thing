import {useDraggable} from "@dnd-kit/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {nanoid} from "nanoid";
import React, {useRef} from "react";
import {Item, ItemType} from "@/objects/items.ts";
import Items from "@/items.ts";
export function SidebarField(props) {
    const {item, overlay} = props;
    
    let className = "sidebar-field";
    if (overlay) {
        className += " overlay";
    }
    
    return <>
        <article className={className}>
            <div className="item-panel-item flex p-2 w-100">
                <div className="item-icon mr-2">
                    <FontAwesomeIcon icon={item.icon}/>
                </div>
                <div>
                    <div className="item-title">{item.heading}</div>
                    <div className="item-text">{item.description}</div>
                </div>
            </div>
        </article>
    </>;
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
        <div ref={setNodeRef} className="sidebar-field" {...attributes} {...listeners}>
            
            <SidebarField item={item} {...rest} />
        </div>
    );
}

export default function Sidebar(props) {
    const {fieldsRegKey} = props;
    
    return (
        <>
            {/* <div>{fieldsRegKey}</div> */}
        <div key={fieldsRegKey} className="sidebar">
            {Object.keys(Items).map((key) => {
                return (<DraggableSidebarField key={`sidebar-${key}`} item={Items[key]}/>)
            })}
        </div>
        </>
    );
}