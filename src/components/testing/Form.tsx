import {FormType} from "@/objects/forms.ts";
import {ItemType} from "@/objects/items.ts";
import {getForm} from "@/service.ts";
import {clone_object} from "@/utilities.ts";
import {nanoid} from "nanoid";
import {useEffect, useRef, useState} from "react";
import {useImmer} from "use-immer";
import {DndContext, DragOverlay} from "@dnd-kit/core";
import {HandleFormConfigOnChangeType} from "@/objects/forms"
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Canvas from "./Canvas";
import Sidebar, {ItemInPanel} from "./Sidebar";
import "./style.css"

function getData(prop) {
    return prop?.data?.current ?? {};
}

function createSpacer({id}) {
    return {
        id,
        type: "spacer",
        title: "spacer",
    };
}
function fixitems(items: ItemType[]){
    return items.map((f) => {
        if (!f?.id) {
            f['id'] = nanoid()
        }
        return f
    }) ?? []
}
export default function Form({id}: {
    id: string,
}) {
    console.log("rendering Form")
    const [form, setForm] = useState<FormType>();
    const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState(
        Date.now()
    );
    const spacerInsertedRef = useRef();
    const currentDragFieldRef = useRef();
    const [activeSidebarField, setActiveSidebarField] = useState(); // only for fields from the sidebar
    const [activeField, setActiveField] = useState(); // only for fields that are in the form.
 
    const updateData = (r) => {
        if (form){
            const f = clone_object<FormType>(form)
            f.config = r(f.config)
            console.log("updateData",f.config);
            setForm(f)
        }
       
    }
    
    const fetchForm = async (id: string) => {
        await getForm(id).then((formData) => {
            if (formData){
                formData.config = fixitems(formData.config ?? [])
            }
            
            setForm(formData)
            // updateData(fixitems(formData?.config ?? []))
        });
    };
    
    
    useEffect(() => {
        fetchForm(id)
        
    }, [id])
    
    
    
    const cleanUp = () => {
        setActiveSidebarField(null);
        setActiveField(null);
        currentDragFieldRef.current = null;
        spacerInsertedRef.current = false;
    };
    const handleDragStart = (e) => {
        const {active} = e;
        const activeData = getData(active);
        
        // This is where the cloning starts.
        // We set up a ref to the field we're dragging
        // from the sidebar so that we can finish the clone
        // in the onDragEnd handler.
        if (activeData.fromSidebar) {
            const {field} = activeData;
            const {type} = field;
            setActiveSidebarField(field);
            // Create a new field that'll be added to the fields array
            // if we drag it over the canvas.
            currentDragFieldRef.current = {
                id: active.id,
                type,
                name: `${type}${items.length + 1}`,
                parent: null,
            };
            return;
        }
        
        // We aren't creating a new element so go ahead and just insert the spacer
        // since this field already belongs to the canvas.
        const {field, index} = activeData;
        
        setActiveField(field);
        currentDragFieldRef.current = field;
        updateData((draft) => {
            draft.splice(index, 1, createSpacer({id: active.id}));
            return draft
        });
    };
    
    const handleDragOver = (e) => {
        const {active, over} = e;
        const activeData = getData(active);
        
        // Once we detect that a sidebar field is being moved over the canvas
        // we create the spacer using the sidebar fields id with a spacer suffix and add into the
        // fields array so that it'll be rendered on the canvas.
        
        // 🐑 CLONING 🐑
        // This is where the clone occurs. We're taking the id that was assigned to
        // sidebar field and reusing it for the spacer that we insert to the canvas.
        if (activeData.fromSidebar) {
            const overData = getData(over);
            
            if (!spacerInsertedRef.current) {
                const spacer = createSpacer({
                    id: active.id + "-spacer",
                });
                
                updateData((draft) => {
                    if (!draft.length) {
                        draft.push(spacer);
                    } else {
                        const nextIndex =
                            overData.index > -1 ? overData.index : draft.length;
                        
                        draft.splice(nextIndex, 0, spacer);
                    }
                    spacerInsertedRef.current = true;
                    return draft
                });
            } else if (!over) {
                // This solves the issue where you could have a spacer handing out in the canvas if you drug
                // a sidebar item on and then off
                updateData((draft) => {
                    draft = draft.filter((f) => f.type !== "spacer");
                    return draft
                });
                spacerInsertedRef.current = false;
            } else {
                // Since we're still technically dragging the sidebar draggable and not one of the sortable draggables
                // we need to make sure we're updating the spacer position to reflect where our drop will occur.
                // We find the spacer and then swap it with the over skipping the op if the two indexes are the same
                updateData((draft) => {
                    const spacerIndex = draft.findIndex(
                        (f) => f.id === active.id + "-spacer"
                    );
                    
                    const nextIndex =
                        overData.index > -1 ? overData.index : draft.length - 1;
                    
                    if (nextIndex === spacerIndex) {
                        return;
                    }
                    
                    draft = arrayMove(draft, spacerIndex, overData.index);
                    return draft
                });
            }
        }
    };
    
    const handleDragEnd = (e) => {
        const {over} = e;
        
        // We dropped outside of the over so clean up so we can start fresh.
        if (!over) {
            cleanUp();
            updateData((draft) => {
                draft = draft.filter((f) => f.type !== "spacer");
                return draft
            });
            return;
        }
        
        // This is where we commit the clone.
        // We take the field from the this ref and replace the spacer we inserted.
        // Since the ref just holds a reference to a field that the context is aware of
        // we just swap out the spacer with the referenced field.
        let nextField = currentDragFieldRef.current;
        
        if (nextField) {
            const overData = getData(over);
            
            updateData((draft) => {
                const spacerIndex = draft.findIndex((f) => f.type === "spacer");
                draft.splice(spacerIndex, 1, nextField);
                
                draft = arrayMove(
                    draft,
                    spacerIndex,
                    overData.index || 0
                );
                return draft
            });
        }
        
        setSidebarFieldsRegenKey(Date.now());
        cleanUp();
    };
    
    const handleItemsUpdate: HandleFormConfigOnChangeType = (new_config: FormType['config']) => {
        
        console.log("handleItemsUpdate",new_config);
        if (form) {
            const new_form: FormType = clone_object<FormType>(form);
            new_form.config = new_config;
            setForm(new_form);
            console.log(new_form);
        }
    };
    
    console.log(form)
    
    
    return (
        <div className="app">
            <div className="content">
                
                {form &&
                <DndContext
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    autoScroll
                >
                    <Sidebar/>
                    <SortableContext
                        strategy={verticalListSortingStrategy}
                        items={form.config.map((f) => f.id)}
                    >
                        <Canvas items={form.config} onChange={handleItemsUpdate} />
                    </SortableContext>
                    <DragOverlay dropAnimation={false}>
                    </DragOverlay>
                </DndContext>}
            </div>
        </div>
    );
}