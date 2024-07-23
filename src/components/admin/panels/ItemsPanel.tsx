// import TextInput from "@/components/inputs/TextInput.tsx";

import AdminForm from "@/components/admin/Form.tsx";
import {InputTextarea} from 'primereact/inputtextarea';
import {ItemType, Item} from "@/objects/items.ts";
import Items from "@/items.ts";
import {FormType} from "@/objects/forms.ts";
import React, {useState, useEffect, useRef, CSSProperties} from "react";
import {getForm} from "@/service.ts";
import {InputText} from "primereact/inputtext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {DndContext, DragOverlay, useDraggable} from "@dnd-kit/core";

interface ItemInPanelProps {
    item: Item;
}

const ItemInPanel: React.FC<ItemInPanelProps> = ({item}) => {
    
    
    return (
        <>
            <div className="item-panel-item flex p-2 w-100" >
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


const ItemDraggableInPanel: React.FC<ItemInPanelProps> = ({item}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging
    } = useDraggable({
        id: item.type,
        data: item
    });
    
    const style: CSSProperties | undefined = isDragging
        ? {
            position: "absolute",
            transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
            cursor: "move",
        }
        : {
            cursor: "pointer"
        };
    
    
    return (
        <>
            <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <ItemInPanel item={item} ></ItemInPanel>
            </div>
            {isDragging && <ItemInPanel item={item} style={{display: "none !important"}}></ItemInPanel>}
        </>
    )
}


const ItemsPanel: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const items = Items;
    console.log(Items);
    
    function handleDragEnd(event: any) {
        if (event.over) {
            console.log("DONE",event)
        }
    }
    
    
    return (
        <>
            <header className={"panel-header p-2"}>
                <div className="p-inputgroup w-full">
                    
                    <InputText placeholder="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-search"></i>
                    </span>
                </div>
            </header>
            <main className={'panel-body'}>
                <DndContext onDragEnd={handleDragEnd}>
                {Object.keys(items).map((key) => {
                    console.log(items[key].description);
                    return (
                        <ItemDraggableInPanel key={`item-${key}`} item={items[key]}>{items[key].description}</ItemDraggableInPanel>
                    )
                })}
                </DndContext>
                
                
            </main>
            <footer className={'panel-footer'}>items footer</footer>
        
        </>
    );
};

export default ItemsPanel;