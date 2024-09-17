import {FormType} from "@/objects/forms.ts";
import {ItemType} from "@/objects/items.ts";
import ItemBlock from "@/render/Item.tsx";
import {clone_object} from "@/utilities.ts";
import {
    closestCenter,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    Active, Over
} from "@dnd-kit/core";
import {arrayMove, rectSwappingStrategy, SortableContext, sortableKeyboardCoordinates,} from "@dnd-kit/sortable";
import {nanoid} from "nanoid";
import {ConfirmDialog} from "primereact/confirmdialog";
import {useState} from "react";
import Canvas from "./components/CanvasComponent.tsx";
import Properties from "./components/PropertiesComponent.tsx";
import FormSidebar, {SidebarField} from "./components/SidebarComponent.tsx";
import "./form.scss";
import "primereact/resources/themes/lara-light-cyan/theme.css";
// import "primereact/resources/themes/lara-dark-cyan/theme.css";
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";

function getData(prop: Active | Over | null) {
    return prop?.data?.current ?? {};
}

let formloadcount = 0;

export default function Form({form, onChange}: {
    form: FormType,
    onChange: (value: FormType) => void
}) {
    formloadcount = formloadcount + 1;
    console.log("******************", formloadcount, "******************");
    
    const [activeItem, setActiveItem] = useState<ItemType | undefined>(undefined);
    
    
    // ----------- DND --------------
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    const [sidebarFieldsRegenKey, setSidebarFieldsRegenKey] = useState<string>(
        Date.now().toString()
    );
    const [activeSidebarField, setActiveSidebarField] = useState(); // only for fields from the sidebar
    const [activeField, setActiveField] = useState(); // only for fields that are in the form.
    
    const cleanUp = () => {
        setActiveSidebarField(undefined);
        setActiveField(undefined);
    };
    
    const handleDragStart = (e: DragStartEvent) => {
        const {active} = e;
        const activeData = getData(active);
        
        console.log("handleDragStart", activeData);
        const {item} = activeData;
        if (activeData.fromSidebar) {
            
            const new_item = item.default_config;
            new_item.id = nanoid();
            item.id = new_item.id;
            console.log("handleDragStart", "sidebar", item, new_item);
            console.log(new_item);
            setActiveSidebarField(item);
        } else {
            setActiveField(activeData.item);
        }
        
    };
    
    
    const handleDragOver = (e: DragOverEvent) => {
        const {active, over} = e;
        console.log("over", over);
        const activeData = getData(active);
        const overData = getData(over);
        
        const new_form = clone_object(form);
        if (activeData.fromSidebar) {
            
            console.log("handleDragOver", "fromSidebar", activeData.item.id);
            if (new_form.config.findIndex((item) => item.id === activeData.item.id) == -1) {
                console.log("handleDragOver", "new item", activeData.item.default_config, overData);
                new_form.config.push(activeData.item.default_config);
                const itemIndex = new_form.config.findIndex((item) => item.id === activeData.item.id);
                const overIndex = new_form.config.findIndex((item) => item.id === overData.id);
                new_form.config = arrayMove(new_form.config, itemIndex, overIndex);
                onChange(new_form);
            } else if (!over) {
                console.log("handleDragOver", "!over", overData);
                new_form.config = new_form.config.filter((f) => f.id !== activeData.item.id);
                onChange(new_form);
            } else {
                console.log("handleDragOver", "else", overData);
                const itemIndex = new_form.config.findIndex((item) => item.id === activeData.item.id);
                const overIndex = new_form.config.findIndex((item) => item.id === overData.id);
                console.log("arrayMove", new_form.config, itemIndex, overIndex, overData, activeData);
                new_form.config = arrayMove(new_form.config, itemIndex, overIndex);
                onChange(new_form);
                console.log("SET FORM NOW ", new_form.config, new_form.config.map((f) => f.id));
            }
            
            
        } else {
            const itemIndex = new_form.config.findIndex((item) => item.id === activeData.item.id);
            const overIndex = new_form.config.findIndex((item) => item.id === overData.id);
            if (itemIndex != overIndex) {
                // new_form.config = arrayMove(new_form.config, itemIndex, overIndex)
                // console.log("normal sorting", itemIndex, overIndex)
                // setForm(new_form)
            }
            
        }
        
        
    };
    
    const handleDragEnd = (e: DragEndEvent) => {
        const {active, over} = e;
        
        const activeData = getData(active);
        const overData = getData(over);
        console.log("handleDragEnd", activeData, overData);
        
        
        const new_form = clone_object(form);
        console.log("handleDragEnd", form.config);
        const itemIndex = new_form.config.findIndex((item) => item.id === activeData.item.id);
        const overIndex = new_form.config.findIndex((item) => item.id === overData.id);
        if (itemIndex != overIndex) {
            new_form.config = arrayMove(new_form.config, itemIndex, overIndex);
            console.log("handleDragEnd normal sorting", itemIndex, overIndex);
            onChange(new_form);
        }
        
        setSidebarFieldsRegenKey(Date.now().toString());
        cleanUp();
    };
    
    
    let propertiesClassName = "properties-area px-1";
    if (activeItem) {
        propertiesClassName = propertiesClassName + " active";
    }
    
    const handlerOnActiveItem = (item: ItemType | undefined) => {
        // console.log("aaaa",item)
        // if (item?.id == activeItem?.id){
        //     setActiveItem(null)
        // } else {
        setActiveItem(item);
        // }
        
    };
    
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
                            onFormChange={onChange}
                            activeItem={activeItem}
                            setActiveItem={handlerOnActiveItem}
                        /> </SortableContext>
                    </div>
                    <div className={propertiesClassName}>
                        <Properties
                            form={form}
                            activeItem={activeItem}
                            setActiveItem={handlerOnActiveItem}
                            onFormChange={onChange}
                        />
                    </div>
                    
                    <DragOverlay dropAnimation={null}>
                        {activeSidebarField ? (
                            <SidebarField item={activeSidebarField}/>
                        ) : null} {activeField ? <ItemBlock item={activeField} onChange={()=>{}}/> : null}
                    </DragOverlay> </DndContext>
            
            </div>
            <ConfirmDialog/>
        </>
    
    );
}