import Form from "@/components/Form.tsx";
import {useState} from "react";

export default function App() {
    const [formId, setFormId] = useState<string>("4");
    return (
        <>
            <div>
                <Form id={formId}></Form>
            </div>
            <button onClick={() => setFormId("1")}>1</button>
            <button onClick={() => setFormId("2")}>2</button>
            <button onClick={() => setFormId("3")}>3</button>
            <button onClick={() => setFormId("4")}>4</button>
        
        </>
    
    );
}