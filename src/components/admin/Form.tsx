// import TextInput from "@/components/inputs/TextInput.tsx";

import {clone_object} from "@/utilities.ts";
import {InputTextarea} from 'primereact/inputtextarea';
import {ItemType, HandleFieldOnChangeType} from "@/objects/items.ts";
import items from "@/items.ts";
import {FormType} from "@/objects/forms.ts";
import React, {useState, useEffect, useRef} from "react";
import {getForm} from "@/service.ts";
import {TabView, TabPanel} from 'primereact/tabview';
import FormPanel from "@/components/admin/panels/FormPanel.tsx";
import FormsPanel from "@/components/admin/panels/FormsPanel.tsx";
import ItemsPanel from "@/components/admin/panels/ItemsPanel.tsx";
import AdminItemBlock from "./Item.tsx"

import {useDroppable} from "@dnd-kit/core";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

function SortableItem(props) {
    const {id, index, field} = props;
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id,
        data: {
            index,
            id,
            field
        }
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };
    
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            &gt; {props.index} - {JSON.stringify(props)}
        </div>
    );
}

const Form = ({id}: {
    id: string,
}) => {
    const [form, setForm] = useState<FormType>();
    // const [panelIndex, setPanelIndex] = useState<number>(1);
    //
    const fetchForm = async (id: string) => {
        await getForm(id).then((formData) => setForm(formData));
    };
    //
    // const handleFieldUpdate = (updatedField: ItemType, index: number) => {
    //     if (form) {
    //         const updatedData: ItemType[] = [...form.config];
    //         updatedData[index] = updatedField;
    //         const new_form_value = {...form, config: updatedData};
    //         // form.config = updatedData
    //         setForm(new_form_value);
    //     }
    // };
    //
    // const textRef = useRef<HTMLTextAreaElement>();
    // const handleJsonChange = () => {
    //     const new_form_value = {...form, ...JSON.parse(textRef.current.value)};
    //     setForm(new_form_value);
    // };
    //
    useEffect(() => {
        console.log(id)
        fetchForm(id)
    }, [id])
    //
    //
    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(KeyboardSensor, {
    //         coordinateGetter: sortableKeyboardCoordinates,
    //     })
    // );
    
    // function handleDragEnd(event) {
    //     const {active, over} = event;
    //     console.log("handleDragEnd")
    //     if (active.id !== over.id) {
    //         let fff = clone_object(form)
    //
    //
    //         fff.config = (items) => {
    //             const oldIndex = items.indexOf(active.id);
    //             const newIndex = items.indexOf(over.id);
    //
    //             return arrayMove(items, oldIndex, newIndex);
    //         };
    //
    //         setForm(fff);
    //     }
    // }
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useDroppable({
        id: "canvas_droppable",
        data: {
            parent: null,
            isContainer: true
        }
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };
    
    
    return (
        <div
            ref={setNodeRef}
            className="canvas"
            style={style}{...attributes} {...listeners}
        >
            {form && form.config &&
                <SortableContext
                    items={form.config}
                    strategy={verticalListSortingStrategy}
                >
                {form.config.map((block, index) =>
                    <SortableItem key={`item-${index}`} index={index} config={block}/>)
                }
                </SortableContext>
            }
        </div>
    );
    
    function setneworder(config) {
        console.log("setneworder", config())
    }
    
    function handleDragEnd(event) {
        const {active, over} = event;
        let f : FormType = clone_object(form)
        console.log("handleDragEnd", active, over,active.id, over.id)
        if (active.id !== over.id) {
            if (f && f.config){
                f.config = arrayMove(f.config, over.id, active.id)
                setForm(f)
                //
                // setneworder((items) => {
                //     console.log(items)
                //     const oldIndex = items.indexOf(active.id);
                //     const newIndex = items.indexOf(over.id);
                //     console.log(arrayMove(form.config, oldIndex, newIndex))
                //     return arrayMove(form.config, oldIndex, newIndex);
                // });
            }
            
            
        }
    }
    //
    // return (
    //     <>
    //         <section className={"form-admin"}>
    //             <nav>
    //                 <TabView activeIndex={panelIndex} onTabChange={(e) => setPanelIndex(e.index)}>
    //                     <TabPanel header="Form">
    //                         <FormPanel form={form} setForm={setForm}></FormPanel>
    //                     </TabPanel>
    //                     <TabPanel header="Items">
    //                         <ItemsPanel form={form} setForm={setForm}></ItemsPanel>
    //                     </TabPanel>
    //                     <TabPanel header="Forms">
    //                         <FormsPanel form={form} setForm={setForm}></FormsPanel>
    //                     </TabPanel>
    //                 </TabView>
    //             </nav>
    //             <main>
    //                 <DndContext
    //                     sensors={sensors}
    //                     // collisionDetection={closestCenter}
    //                     onDragEnd={handleDragEnd}
    //                 >
    //
    //
    //                 {form && form.config &&
    //                     <SortableContext
    //                         items={form.config}
    //                         strategy={verticalListSortingStrategy}
    //                     >
    //                     {form.config.map((block, index) => {
    //                         // component does exist
    //                         return (
    //                             <AdminItemBlock
    //                                 item={block}
    //                                 key={index}
    //                                 onChange={(conf: ItemType) => handleFieldUpdate(conf, index)}
    //                             ></AdminItemBlock>
    //                         );
    //                     })}
    //                     </SortableContext>
    //                 }
    //                 </DndContext>
    //
    //             </main>
    //             <footer>
    //                 <div>
    //                     <InputTextarea
    //                         style={{
    //                             width: "100%",
    //                             height: "100px"
    //                         }}
    //                         defaultValue={JSON.stringify(form)}
    //                         ref={textRef}
    //                         onBlur={handleJsonChange}
    //                     ></InputTextarea>
    //
    //                 </div>
    //             </footer>
    //         </section>
    //
    //     </>
    // );
    //
};

export default Form;