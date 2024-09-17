import FormBuilder from "@/builder/Form.tsx";
import {FormType} from "@/objects/forms.ts";
import {getForm} from "@/service.ts";

import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";

library.add(fas, far);

export default function App() {
    const [form, setForm] = useState<FormType|undefined>(getForm("2"))
    
    const onChange = (value: FormType) => {
        setForm(value);
    };
    
    const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>)=>{
        setForm(JSON.parse(event.target.value))
    }
    if (form){
        return (
            <>
                <FormBuilder form={form} onChange={onChange} />
                <textarea
                    value={JSON.stringify(form)}
                    onChange={handleOnChange}
                    style={{
                        width: "100%",
                        height: "100px"
                    }}
                />
            </>
        );
    } else {
        return (
            <>
            <div>Loading...</div>
            </>
        )
    }
    
}