import item from "@/components/Item.tsx";
import {FormType} from "@/objects/forms.ts";
import {ItemType} from "@/objects/items.ts";
import {getForm} from "@/service.ts";
import {clone_object} from "@/utilities.ts";
import {nanoid} from "nanoid";
import {ConfirmDialog} from "primereact/confirmdialog";
import React, {useEffect, useRef, useState} from "react";
import {useImmer} from "use-immer";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    rectSwappingStrategy,
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import Canvas, {SortableItem, Field} from "./components/CanvasComponent.tsx";
import FormSidebar, {SidebarField} from "./components/SidebarComponent.tsx";
import Properties from "./components/PropertiesComponent.tsx"
import ItemBlock from "@/components/Item.tsx"
import "@/components/builder/form.scss"
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

let formloadcount = 0

export default function Form({id}: {
    id: string,
}) {
    formloadcount = formloadcount + 1
    console.log("******************", formloadcount,"******************")
    const empty_form = () => {
        return {
            id: null,
            label: null,
            created_at: null,
            config: []
        }
    }
    
    const [form, setForm] = useState<FormType>(empty_form());
    const [activeItem, setActiveItem] = useState<ItemType|null>(null)
    
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
    
    // useEffect(() => {
    //     console.log("form change",form)
    //     if (activeItem){
    //         setActiveItem(form.config.find((item)=>item.id === activeItem.id)??null);
    //     }
    // }, [form]);
    
    
    
    
    
    // ----------- DND --------------
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(
        Date.now()
    );
    const [activeSidebarField, setActiveSidebarField] = useState(); // only for fields from the sidebar
    const [activeField, setActiveField] = useState(); // only for fields that are in the form.
    
    const cleanUp = () => {
        setActiveSidebarField(null);
        setActiveField(null);
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
        } else {
            setActiveField(activeData.item);
        }

    };
    
    
    const handleDragOver = (e) => {
        const {active, over} = e;
        console.log("over",over)
        const activeData = getData(active);
        const overData = getData(over);
        
        const new_form = clone_object(form)
        if (activeData.fromSidebar) {
            
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
                new_form.config = arrayMove(new_form.config, itemIndex, overIndex )
                setForm(new_form)
                console.log("SET FORM NOW ", new_form.config, new_form.config.map((f) => f.id))
            }
            
            
        } else {
            const itemIndex = new_form.config.findIndex((item) => item.id === activeData.item.id)
            const overIndex = new_form.config.findIndex((item) => item.id === overData.id);
            if (itemIndex != overIndex) {
                // new_form.config = arrayMove(new_form.config, itemIndex, overIndex)
                // console.log("normal sorting", itemIndex, overIndex)
                // setForm(new_form)
            }
            
        }
        
        
    };
    
    const handleDragEnd = (e) => {
        const {active, over} = e;
       
        const activeData = getData(active);
        const overData = getData(over);
        console.log("handleDragEnd", activeData, overData)
        
        
        const new_form = clone_object(form)
        console.log("handleDragEnd",form.config)
        const itemIndex = new_form.config.findIndex((item) => item.id === activeData.item.id)
        const overIndex = new_form.config.findIndex((item) => item.id === overData.id);
        if (itemIndex != overIndex) {
            new_form.config = arrayMove(new_form.config, itemIndex, overIndex)
            console.log("handleDragEnd normal sorting", itemIndex, overIndex)
            setForm(new_form)
        }
        
        setSidebarFieldsRegenKey(Date.now());
        cleanUp();
    };
    
    const onFormChange = (form:FormType)=>{
        const new_form = clone_object(form)
        setForm(new_form)
        console.log("new formicide",new_form)
    }
    
    let propertiesClassName = "properties-area px-1"
    if (activeItem){
        propertiesClassName = propertiesClassName + " active"
    }
    
    const handlerOnActiveItem = (item:ItemType|null) => {
        // console.log("aaaa",item)
        // if (item?.id == activeItem?.id){
        //     setActiveItem(null)
        // } else {
            setActiveItem(item)
        // }
        
    }
    
    return (
        <>
            <div className="form-builder">
                <DndContext
                    sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    collisionDetection={closestCenter}
                    autoScroll
                >
                    <div className="sidebar-area">
                        <FormSidebar fieldsRegKey={sidebarFieldsRegenKey}/>
                    </div>
                    <div className="canvas-area">
                        <SortableContext
                            strategy={rectSwappingStrategy}
                            items={form.config.map((f) => f.id)}
                        > <Canvas
                            form={form}
                            onFormChange={onFormChange}
                            
                            activeItem={activeItem}
                            setActiveItem={handlerOnActiveItem}
                        /> </SortableContext>
                    </div>
                    <div className={propertiesClassName}>
                        <Properties
                            form={form}
                            activeItem={activeItem}
                            setActiveItem={handlerOnActiveItem}
                            onFormChange={onFormChange}
                        />
                    </div>
                    
                    <DragOverlay dropAnimation={null}>
                        {activeSidebarField ? (
                            <SidebarField overlay item={activeSidebarField}/>
                        ) : null} {activeField ? <ItemBlock overlay item={activeField}/> : null}
                    </DragOverlay> </DndContext>
            
            </div>
            <div>{JSON.stringify(form)}</div>
            <ConfirmDialog/>
        </>
    
    );
}