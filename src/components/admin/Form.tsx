// import TextInput from "@/components/inputs/TextInput.tsx";

import {InputTextarea} from 'primereact/inputtextarea';
import {ItemType} from "@/objects/items.ts";
import items from "@/items.ts";
import {FormType} from "@/objects/forms.ts";
import React, {useState, useEffect, useRef} from "react";
import {getForm} from "@/service.ts";
import {TabView, TabPanel} from 'primereact/tabview';
import FormPanel from "@/components/admin/panels/FormPanel.tsx";
import FormsPanel from "@/components/admin/panels/FormsPanel.tsx";
import ItemsPanel from "@/components/admin/panels/ItemsPanel.tsx";
import {useDroppable} from "@dnd-kit/core";


const Form = ({id}: {
    id: string,
}) => {
    const [form, setForm] = useState<FormType>();
    const [panelIndex, setPanelIndex] = useState<number>(1);
    const {isOver, setNodeRef} = useDroppable({
        id: "wtf"
    });
    
    const fetchForm = async (id: string) => {
        await getForm(id).then((formData) => setForm(formData));
    }
    
    const handleFieldUpdate = (updatedField: ItemType, index: number) => {
        if (form) {
            const updatedData: ItemType[] = [...form.config];
            updatedData[index] = updatedField;
            const new_form_value = {...form, config: updatedData};
            // form.config = updatedData
            setForm(new_form_value);
        }
    };
    
    
    const textRef = useRef<HTMLTextAreaElement>();
    const handleJsonChange = () => {
        const new_form_value = {...form, ...JSON.parse(textRef.current.value)};
        setForm(new_form_value);
    };
    
    
    
    
    useEffect(() => {
        console.log(id)
        fetchForm(id)
    }, [id])
    
    return (
        <>
            <section className={"form-admin"}>
                <nav>
                    <TabView activeIndex={panelIndex} onTabChange={(e) => setPanelIndex(e.index)}>
                        <TabPanel header="Form">
                            <FormPanel form={form} setForm={setForm}></FormPanel>
                        </TabPanel>
                        <TabPanel header="Items">
                            <ItemsPanel form={form} setForm={setForm}></ItemsPanel>
                        </TabPanel>
                        <TabPanel header="Forms">
                            <FormsPanel form={form} setForm={setForm}></FormsPanel>
                        </TabPanel>
                    </TabView>
                </nav>
                <main className={"mx-4"} ref={setNodeRef}>
                        {form?.config.map((block, index) => {
                            // component does exist
                            if (typeof items[block.type] !== "undefined") {
                                return React.createElement(items[block.type].render, {
                                    key: index,
                                    config: block,
                                    onUpdateField: (updatedField: ItemType) => handleFieldUpdate(updatedField, index)
                                });
                            }
                            // component doesn't exist yet
                            return React.createElement(
                                () => <div>The component {block.type} was not found.</div>,
                                {key: index}
                            );
                        })}
                    
                    
                </main>
                <footer>
                    <div>
                        <InputTextarea
                            style={{
                                width: "100%",
                                height: "100px"
                            }}
                            defaultValue={JSON.stringify(form)}
                            ref={textRef}
                            onBlur={handleJsonChange}
                        ></InputTextarea>
                    
                    </div>
                </footer>
            </section>
        
        </>
    );
};

export default Form;