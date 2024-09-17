import items from "@/items/items.ts";
import {useDraggable} from "@dnd-kit/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {nanoid} from "nanoid";
import {Accordion, AccordionTab} from "primereact/accordion";
import {IconField} from "primereact/iconfield";
import {InputIcon} from "primereact/inputicon";
import {InputText} from "primereact/inputtext";
import {TabPanel, TabView} from "primereact/tabview";
import {useRef, useState} from "react";
import {Item} from "@/objects/items.ts";

export function SidebarField({item}: {
    item: Item
}) {
    
    return <>
        <article className={"sidebar-field"}>
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

function DraggableSidebarField({item}:{
    item: Item
}) {
    
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
            
            <SidebarField item={item} />
        </div>
    );
}

export default function SidebarComponent({fieldsRegKey}:{
    fieldsRegKey: string
}) {
    const [panelIndex, setPanelIndex] = useState<number>(0);
    
    type paneltype = {
        label: string,
        items: Item[]
    }
    
    
    const items_list: {[key: string]: paneltype} = {};
    items.map((item) => {
        const k = item.group?.label || "";
        if (!Object.keys(items_list).includes(k)) {
            items_list[k] = {
                label: item.group?.label || "",
                items: []
            };
        }
        items_list[k]["items"].push(item);
    });
    
    const storePanelIndex = (index: number) => {
        setPanelIndex(index);
    };
   
    
    return (
        <>
            <TabView
                activeIndex={panelIndex}
                onTabChange={(e) => storePanelIndex(e.index)}
                key={fieldsRegKey.toString()}
                className="sidebar"
            > <TabPanel header="Items"> <IconField iconPosition="left"> <InputIcon className="pi pi-search"/> <InputText
                v-model="value1"
                placeholder="Search"
                className={"w-full my-3"}
            /> </IconField>
                
                <Accordion activeIndex={0}>
                    {Object.keys(items_list).map((k) => {
                        return (
                            <AccordionTab header={items_list[k].label} key={k}>
                                {items_list[k].items.map((item) => {
                                    return (<DraggableSidebarField key={`sidebar-${item.type}`} item={item}/>);
                                })}
                            </AccordionTab>
                        );
                    })}
                
                </Accordion>
            
            </TabPanel> <TabPanel header="Forms"> forms </TabPanel> </TabView>
        
        
        </>
    );
}