// import TextInput from "@/components/inputs/TextInput.tsx";

import AdminForm from "@/components/admin/Form.tsx";
import {InputTextarea} from 'primereact/inputtextarea';
import {ItemType} from "@/objects/items.ts";
import Items from "@/items.ts";
import {FormType} from "@/objects/forms.ts";
import React, {useState, useEffect, useRef} from "react";
import {getForm} from "@/service.ts";
import {InputText} from "primereact/inputtext";

const ItemsPanel = () => {
    const [searchText, setSearchText] = useState<string>("");
    const items = Items
    console.log(Items)
    
    return (
        <>
            <header className={'panel-header p-2'}>
                <div className="p-inputgroup w-full">
                    
                    <InputText placeholder="Search" value={searchText} onChange={(e) =>setSearchText(e.target.value)}/>
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-search"></i>
                    </span>
                </div>
            </header>
            <main className={'panel-body p-4'}>
                {Object.entries(items).forEach(([key, value]) => {
                    console.log(`Key: ${key}, Value: ${value.description}`);
                    return (
                        <>
                            <div>a</div>
                        </>
                    )
                })}
                
            </main>
            <footer className={'panel-footer'}>items footer</footer>
        
        </>
    );
};

export default ItemsPanel;