import Form from "@/components/Form.tsx";
import React, {FormEvent, useState} from "react";

export default function App() {
    const [form,setForm] = useState("4")
    
    const changeHandle = (e:FormEvent<HTMLButtonElement>) => {
        setForm(e.currentTarget.dataset.value || "")
    }
    return (
        <>
            <div>
                <Form id={form}></Form>
            </div>
            <button onClick={changeHandle} data-value={1}>1</button>
            <button onClick={changeHandle} data-value={2}>2</button>
            <button onClick={changeHandle} data-value={3}>3</button>
            <button onClick={changeHandle} data-value={4}>4</button>
            
        </>
    
    );
}