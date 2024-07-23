// import TextInput from "@/components/inputs/TextInput.tsx";

import {FormType} from "@/objects/forms.ts";
import {getForms} from "@/service.ts";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import React, {useEffect, useState} from "react";

const FormsList = ({setform}) => {
    const [selectedId, setSelectedId] = useState<string>("");
    const [forms, setForms] = useState<FormType[]>([]);
    
    const fetchForms = async () => {
        await getForms().then((formData) => setForms(formData));
    };
    
    useEffect(() => {
        console.log("fetching forms")
        fetchForms();
    },[selectedId]);
    
    return (
        <>
            <DataTable
                value={forms}
                tableStyle={{minWidth: "50rem"}}
                selectionMode="single"
                onSelectionChange={(e) => {
                    console.log(e);
                    setform(e.value.id.toString());
                }}
                dataKey="id"
                metaKeySelection={false}
            >
                <Column field="id" header="ID"></Column>
                <Column field="label" header="Label"></Column>
            </DataTable>
            <div>{selectedId}</div>
        </>
    );
};

export default FormsList;