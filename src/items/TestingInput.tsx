import {Field, FieldComponentProps} from "@/objects.ts";

import React, {useState} from "react";

type ParentProps = {
    data: Field[]; // Assuming 'Field' is the type of your objects
    onUpdateData: (data: Field[]) => void;
}

const ParentComponent: React.FC<ParentProps> = ({data: initialData, onUpdateData}) => {
    const [data, setData] = useState(initialData);
    
    // local handler to update data
    const handleUpdate = (updatedField: Field, index: number) => {
        let updatedData = [...data];
        updatedData[index] = updatedField;
        setData(updatedData);
        onUpdateData(updatedData); // pass the data back to the parent
    };
    
    return (
        <div>
            {data.map((field, index) => (
                <ChildComponent
                    key={index}
                    field={field}
                    onUpdateField={(updatedField) => handleUpdate(updatedField, index)}
                />
            ))}
        </div>
    );
};

type ChildProps = {
    field: Field;
    onUpdateField: (field: Field) => void;
}

const ChildComponent: React.FC<ChildProps> = ({field, onUpdateField}) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedField = {...field, value: event.target.value};
        onUpdateField(updatedField);
    };
    
    return (
        <div>
            <input value={field.value} onChange={handleOnChange}/>
        </div>
    );
};