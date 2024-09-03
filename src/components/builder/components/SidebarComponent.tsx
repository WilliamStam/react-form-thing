import {useDraggable} from "@dnd-kit/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {nanoid} from "nanoid";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import React, {useRef, useState} from "react";
import {Item, ItemType} from "@/objects/items.ts";
import items from "@/components/items/items.ts";
import {TabView, TabPanel} from 'primereact/tabview';
import {InputText} from "primereact/inputtext";
import {AccordionTab, Accordion} from "primereact/accordion";


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

export default function sidebarComponent(props) {
    const {fieldsRegKey} = props;
    const [panelIndex, setPanelIndex] = useState<number>(0);
    
    const items_list = {}
    items.map((item) => {
        let k = item.group?.label
        if (!Object.keys(items_list).includes(k) ){
            items_list[k] = {
                label: item.group?.label,
                items: []
            }
        }
        items_list[k]['items'].push(item);
    })
    
    const storePanelIndex = (index: number) => {
        
        setPanelIndex(index)
    }
    const storeAccordionIndex = (index: number) => {
        
        setPanelIndex(index)
    }
    
    return (
        <>
            <TabView
                activeIndex={panelIndex}
                onTabChange={(e) => storePanelIndex(e.index)}
                key={fieldsRegKey}
                className="sidebar"
           >
                <TabPanel header="Items">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText v-model="value1" placeholder="Search" className={"w-full my-3"}/>
                    </IconField>
                    
                    <Accordion activeIndex={0}>
                        {Object.keys(items_list).map((k) => {
                        return (
                            <AccordionTab header={items_list[k].label} key={k}>
                            {items_list[k].items.map((item) => {
                                return (<DraggableSidebarField key={`sidebar-${item.type}`} item={item}/>)
                            })}
                            </AccordionTab>
                        )
                        })}
                        
                     </Accordion>
                  
                </TabPanel>
                <TabPanel header="Forms">
                    forms
                </TabPanel>
            </TabView>
               
            
        </>
    );
}