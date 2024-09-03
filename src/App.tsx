import Form from "@/components/front/Form.tsx";
import AdminForm from "@/components/admin/Form.tsx";
import FormsList from "@/components/FormsList.tsx";
import React, {useContext, useEffect, useState} from "react";

import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'

library.add(fas,far)

import TestForm2 from "@/components/builder/Form.tsx"
import "@/assets/css/styles.scss"

export default function App() {
    const [formId, setFormId] = useState<string>("2");
    const [isAdmin, setAdmin] = useState<boolean>(true);
   
    
    if (formId){
        if (isAdmin){
          return (
              <>
              <TestForm2 id={formId}></TestForm2>
                <button onClick={() => setFormId("")}>Cancel</button>
                <button onClick={() => setAdmin(false)}>front</button>
          </>
          )
        }
       
    } else {
    
    }
}