import item from "@/components/Item.tsx";
import {FormType} from "@/objects/forms.ts";
import {ItemType} from "@/objects/items.ts";
import {getForm} from "@/service.ts";
import {clone_object} from "@/utilities.ts";
import {nanoid} from "nanoid";
import {useEffect, useRef, useState} from "react";
import {useImmer} from "use-immer";
import {DndContext, DragOverlay, closestCenter} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Canvas, {Field} from "./canvas.tsx";
import Sidebar, {SidebarField} from "./sidebar.tsx";
import "./styles.css"
function getData(prop) {
    return prop?.data?.current ?? {};
}

function fixItem(item: ItemType) {
    if (!item?.id) {
        item["id"] = nanoid();
    }
    return item;
}

function fixitems(items: ItemType[]) {
    return items.map(fixItem) ?? [];
}



export default function Form({id}: {
    id: string,
}) {
    
    const empty_form = () => {
        return {
            id: null,
            label: null,
            created_at: null,
            config: []
        }
        
    }
    
    const [form, setForm] = useState<FormType>(empty_form());
    
    
    const fetchForm = async (id: string) => {
        await getForm(id).then((formData) => {
            if (formData) {
                formData.config = fixitems(formData.config ?? []);
            } else {
                formData = empty_form()
            }
            console.log("fetchForm", formData)
            setForm(formData);
        });
    };
    
    useEffect(() => {
        fetchForm(id);
    }, [id]);
    useEffect(() => {
        console.log("form change",form)
    }, [form]);
    
    const onChange = (value: FormType) => {
        if (form) {
            const v = clone_object<FormType>(value);
            console.log("UPDATING FORM", v);
            setForm(v);
        } else {
            console.log("UPDATING NO FORM");
        }
        
        
    };
    
    
    // ----------- DND --------------
    
    const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(
        Date.now()
    );
    const spacerInsertedRef = useRef();
    const currentDragFieldRef = useRef();
    const [activeSidebarField, setActiveSidebarField] = useState(); // only for fields from the sidebar
    const [activeField, setActiveField] = useState(); // only for fields that are in the form.
    
    const cleanUp = () => {
        setActiveSidebarField(null);
        setActiveField(null);
        currentDragFieldRef.current = null;
        spacerInsertedRef.current = false;
    };
    
    const handleDragStart = (e) => {
        const {active} = e;
        const activeData = getData(active);
        
        
        console.log("handleDragStart",activeData);
        const {item} = activeData;
        if (activeData.fromSidebar) {
            
            const new_item = item.default_config
            new_item.id = nanoid()
            item.id = new_item.id
            console.log("handleDragStart","sidebar",item, new_item)
            console.log(new_item)
            setActiveSidebarField(item);
            // currentDragFieldRef.current = new_item
        } else {
            // const {field, index} = activeData;
            //
            setActiveField(activeData.item);
            // currentDragFieldRef.current = activeData.item;
            
            // const new_form = clone_object(form);
            // new_form.config.splice(index, 1, createSpacer({id: active.id}))
            // setForm(new_form);
        }

    };
    
    const handleDragOver = (e) => {
        const {active, over} = e;
        console.log("over",over)
        const activeData = getData(active);
        const overData = getData(over);
        
        //
        // if (activeData.fromSidebar){
        //     const new_item = activeData.item.default_config
        //
        //     console.log("ITS FROM THE SIDEBAR")
        //     console.log(form.config, new_item);
        //
        //     // const new_form = clone_object(form)
        //     if (overData.id){
        //
        //         const itemIndex = items.findIndex((item) => item.id === new_item.id);
        //         const overIndex = items.findIndex((item) => item.id === overData.id);
        //
        //         console.log("current index", itemIndex, new_item.id)
        //         console.log("over index", overIndex, overData.id)
        //
        //         setItems(arrayMove(items, itemIndex, overIndex));
        //         console.log("handleDragOver","sidebar", items)
        //
        //     } else {
        //         console.log("NO OVER ID")
        //
        //     }
        //
        //
        //
        //
        //     // new_form.config = arrayMove(new_form.config, itemIndex, overIndex)
        //     // setForm(new_form)
        //
        //     // updateData((draft)=>{
        //     //
        //     //     console.log("current index", itemIndex, activeData)
        //     //     console.log("over index", overIndex, overData)
        //     //     console.log("move", itemIndex, overIndex)
        //     //     return arrayMove(draft, itemIndex, overIndex)
        //     //     console.log(draft);
        //     //     return draft
        //     // })
        //
        //
        // }
        
        if (activeData.fromSidebar) {
            const new_form = clone_object(form)
            console.log("handleDragOver","fromSidebar",activeData.item.id);
            if (new_form.config.findIndex((item) => item.id === activeData.item.id) == -1){
                console.log("handleDragOver","new item",activeData.item.default_config, overData);
                new_form.config.push(activeData.item.default_config);
                const itemIndex = new_form.config.findIndex((item) => item.id === activeData.item.id)
                const overIndex = new_form.config.findIndex((item) => item.id === overData.id);
                new_form.config = arrayMove(new_form.config, itemIndex, overIndex)
                setForm(new_form)
            } else if (!over){
                console.log("handleDragOver","!over", overData)
                new_form.config = new_form.config.filter((f) => f.id !== activeData.item.id)
                setForm(new_form)
            } else {
                console.log("handleDragOver","else", overData)
                const itemIndex = new_form.config.findIndex((item) => item.id === activeData.item.id)
                const overIndex = new_form.config.findIndex((item) => item.id === overData.id);
                console.log("arrayMove", new_form.config, itemIndex, overIndex, overData, activeData)
                if (itemIndex != overIndex){
                    new_form.config = arrayMove(new_form.config, itemIndex, overIndex)
                    setForm(new_form)
                    console.log("SET FORM NOW ", new_form.config)
                }
            }
            
            // if (!spacerInsertedRef.current) {
            //     console.log("!spacerInsertedRef.current")
            //     new_form.config.push(currentDragFieldRef.current)
            //     spacerInsertedRef.current = true;
            //
            // } else if (!over) {
            //     console.log("!over")
            //     // This solves the issue where you could have a spacer handing out in the canvas if you drug
            //     // a sidebar item on and then off
            //
            //     new_form.config = new_form.config.filter((f) => f.id !== currentDragFieldRef.current.id)
            //     spacerInsertedRef.current = false;
            // } else {
            //     console.log("else")
            //     // Since we're still technically dragging the sidebar draggable and not one of the sortable draggables
            //     // we need to make sure we're updating the spacer position to reflect where our drop will occur.
            //     // We find the spacer and then swap it with the over skipping the op if the two indexes are the same
            //     const spacerIndex = new_form.config.findIndex(
            //         (f) => f.id === active.id
            //     );
            //
            //     const nextIndex =
            //         overData.index > -1 ? overData.index : new_form.config.length - 1;
            //
            //     if (nextIndex === spacerIndex) {
            //         return;
            //     }
            //
            //     new_form.config = arrayMove(new_form.config, spacerIndex, overData.index)
            // }
            
        }
        
        
    };
    
    const handleDragEnd = (e) => {
        const {over} = e;
        
        // We dropped outside of the over so clean up so we can start fresh.
        // if (!over) {
        //     cleanUp();
        //     updateData((draft) => {
        //         return draft.filter((f) => f.type !== "spacer");
        //
        //     });
        //     return;
        // }
        //
        // // This is where we commit the clone.
        // // We take the field from the this ref and replace the spacer we inserted.
        // // Since the ref just holds a reference to a field that the context is aware of
        // // we just swap out the spacer with the referenced field.
        // let nextField = currentDragFieldRef.current;
        //
        // if (nextField) {
        //     const overData = getData(over);
        //
        //     updateData((draft) => {
        //         const spacerIndex = draft.findIndex((f) => f.type === "spacer");
        //         draft.splice(spacerIndex, 1, nextField);
        //         console.log("handleDragEnd",spacerIndex, overData.index)
        //         arrayMove(
        //             draft.fields,
        //             spacerIndex,
        //             overData.index || 0
        //         );
        //         return draft.fields
        //     });
        // }
        
        console.log("handleDragEnd",form.config)
        
        
        setSidebarFieldsRegenKey(Date.now());
        cleanUp();
    };
    
    return (
        <div className="app">
            <div className="content">
                <DndContext
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCenter}
                    autoScroll
                >
                    <Sidebar fieldsRegKey={sidebarFieldsRegenKey}/>
                    <SortableContext
                        strategy={verticalListSortingStrategy}
                        items={form.config.map((f) => f.id)}
                    >
                        <Canvas form={form} onChange={onChange}/>
                    </SortableContext>
                    <DragOverlay dropAnimation={false}>
                        {activeSidebarField ? (
                            <SidebarField overlay item={activeSidebarField}/>
                        ) : null} {activeField ? <Field overlay item={activeField}/> : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
}