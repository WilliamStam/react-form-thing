import {FormType} from "@/objects/forms.ts";
import {ItemType, Item} from "@/objects/items.ts";
import {getForm} from "@/service.ts";
import {clone_object} from "@/utilities.ts";
import {
    closestCenter,
    closestCorners,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, SortableContext} from "@dnd-kit/sortable";
import {nanoid} from "nanoid";
import React, {useEffect, useState, useRef} from "react";
import Canvas from "./Canvas.tsx";
import Sidebar from "./Sidebar.tsx";
import "./style.css";

function fixitems(items: ItemType[]) {
    return items.map((f) => {
        if (!f?.id) {
            f["id"] = nanoid();
        }
        return f;
    }) ?? [];
}

function createSpacer({id}) {
    return {
        id,
        type: "spacer",
        title: "spacer",
    };
}

export default function Form({id}: {
    id: string,
}) {
    const [form, setForm] = useState<Partial<FormType>>();
    
    const fetchForm = async (id: string) => {
        await getForm(id).then((formData) => {
            if (formData) {
                formData.config = fixitems(formData.config ?? []);
            } else {
                formData = {
                    id: undefined,
                    label: undefined,
                    created_at: undefined,
                    config: []
                }
            }
            console.log("fetchForm",formData)
            setForm(formData);
        });
    };
    
    useEffect(() => {
        fetchForm(id);
    }, [id]);
    
    const onChange = (value: FormType) => {
        if (form) {
            const v = clone_object<FormType>(value);
            console.log("UPDATING FORM", v);
            setForm(v);
        } else {
            console.log("UPDATING NO FORM");
        }
        
        
    };
    
    
    const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(
        Date.now()
    );
    const spacerInsertedRef = useRef();
    const currentDragFieldRef = useRef();
    const [activeSidebarField, setActiveSidebarField] = useState(); // only for fields from the sidebar
    const [activeField, setActiveField] = useState(); // only for fields that are in the form.
    
    const [activeId, setActiveId] = useState(null);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const cleanUp = () => {
        setActiveSidebarField(null);
        setActiveField(null);
        currentDragFieldRef.current = null;
        spacerInsertedRef.current = false;
    };
    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {form && <div className="grid">
                    <div className="col-4">
                        <Sidebar fieldsRegKey={sidebarFieldsRegenKey}></Sidebar>
                    </div>
                    <div className="col-8">
                        <SortableContext
                            items={form?.config ?? []}
                            strategy={verticalListSortingStrategy}
                        >
                            <Canvas
                                form={form}
                                onChange={onChange}
                            > </Canvas>
                        
                        </SortableContext>
                        
                    </div>
                
                </div>}
                <DragOverlay
                    dropAnimation={null}
                >
                
                </DragOverlay>
            </DndContext>
        
            <div>{JSON.stringify(form)}</div>
        
        </>
    );
    
    function handleDragStart(event) {
        const {active} = event;
        console.log(event)
        console.log(active)
        if (active?.data?.current?.fromSidebar){
            const new_form = clone_object<FormType>(form);
            const data: Item = active.data.current.item
            data.default_config.id = nanoid()
            new_form.config.push(data.default_config)
            setForm(new_form)
        }
        
    }
    function handleDragOver(event) {
        const {active, over} = event;
        console.log(event)
        console.log(active)
        // if (active?.data?.current?.fromSidebar){
        //     const new_form = clone_object<FormType>(form);
        //     const data: Item = active.data.current.item
        //     data.default_config.id = nanoid()
        //     new_form.config.push(data.default_config)
        //     setForm(new_form)
        // }
        
    }
    
    function handleDragEnd(event) {
        const {active, over} = event;
        console.log("active",active,"over",over)
        if (!form) {
            return
        }
        if (active.data?.current?.fromSidebar) {
            // console.log("handleDragEnd","from sidebar")
            const data: Item = active.data.current.item
            data.default_config.id = nanoid()
            setSidebarFieldsRegenKey(Date.now())
            
            currentDragFieldRef.current = data
            // const new_form = clone_object<FormType>(form);
            // const newIndex = form.config.findIndex((item) => item['id'] === over.id);
            //
            // console.log("newIndex",newIndex)
            // new_form.config.splice(newIndex+1,0, data.default_config)
            
            // setForm(new_form)
        } else {
            // console.log("** handleDragEnd **")
            console.log(event)
            // console.log("active", active, "over", over, "activeId", activeId)
            if (form && (active.id !== over.id)) {
                const oldIndex = form.config.findIndex((item) => item['id'] === active.id);
                const newIndex = form.config.findIndex((item) => item['id'] === over.id);
                const new_form = clone_object(form);
                // console.log("oldIndex", oldIndex, "newIndex", newIndex)
                new_form.config = arrayMove(form.config, oldIndex, newIndex)
                setForm(new_form)
            }
            // console.log("clearing active", active)
            setActiveId(null);
            console.log("active id", activeId)
            console.log("-- handleDragEnd --")
        }
    }
    
}