import TestForm2 from "@/components/builder/Form.tsx";

import {library} from "@fortawesome/fontawesome-svg-core";
import {far} from "@fortawesome/free-regular-svg-icons";
import {fas} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import "@/assets/css/styles.scss";

library.add(fas, far);

export default function App() {
    const [formId, setFormId] = useState<string>("2");
    const [isAdmin, setAdmin] = useState<boolean>(true);
    
    
    if (formId) {
        if (isAdmin) {
            return (
                <>
                    <TestForm2 id={formId}></TestForm2>
                    <button onClick={() => setFormId("")}>Cancel</button>
                    <button onClick={() => setAdmin(false)}>front</button>
                </>
            );
        }
        
    } else {
    
    }
}