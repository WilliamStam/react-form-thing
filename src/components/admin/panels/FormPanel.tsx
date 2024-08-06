// import TextInput from "@/components/inputs/TextInput.tsx";

import {FormType} from "@/objects/forms.ts";
import {InputText} from "primereact/inputtext";
import React from "react";

type PanelProps = {
    form: FormType;
    setForm: React.Dispatch<React.SetStateAction<FormType>>;
};

const FormPanel: React.FC<PanelProps> = ({form, setForm}) => {
    
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedData: FormType = {...form, [event.target.name]: event.target.value};
        setForm(updatedData);
    };
    
    return (
        <>
            <main className={"panel-body p-4"}>
                <div className="flex flex-column gap-2">
                    <label htmlFor="label">Form label</label>
                    <InputText
                        id="label"
                        name="label"
                        value={form?.label || ""}
                        onChange={handleOnChange}
                    ></InputText>
                    <small id="label-help">
                        A friendly name for your form
                    </small>
                </div>
            </main>
        </>
    );
};

export default FormPanel;