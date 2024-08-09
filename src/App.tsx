import Form from "@/components/front/Form.tsx";
import AdminForm from "@/components/admin/Form.tsx";
import FormsList from "@/components/FormsList.tsx";
import React, {useEffect, useState} from "react";

import {library} from '@fortawesome/fontawesome-svg-core'
import {fas} from '@fortawesome/free-solid-svg-icons'
import {far} from '@fortawesome/free-regular-svg-icons'

library.add(fas,far)

import TestForm from "@/components/testing/Form.tsx"

export default function App() {
    const [formId, setFormId] = useState<string>("new");
    const [isAdmin, setAdmin] = useState<boolean>(true);
    
   
    
    if (formId){
        if (isAdmin){
          return (
              <>
              <TestForm id={formId}></TestForm>
                <button onClick={() => setFormId("")}>Cancel</button>
                <button onClick={() => setAdmin(false)}>front</button>
          </>
          )
        }
        return (
            <>
                <Form id={formId}></Form>
                <button onClick={()=>setFormId("")}>Cancel</button>
                <button onClick={()=> setAdmin(true)}>Admin</button>
            </>
        )
    } else {
        return (
            <>
                <FormsList setform={setFormId} ></FormsList>
            </>
        )
    }
}