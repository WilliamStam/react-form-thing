import Form from "@/components/front/Form.tsx";
import AdminForm from "@/components/admin/Form.tsx";
import FormsList from "@/components/FormsList.tsx";
import React, {useEffect, useState} from "react";

export default function App() {
    const [formId, setFormId] = useState<string>("");
    const [isAdmin, setAdmin] = useState<boolean>(false);
    
   
    
    if (formId){
        if (isAdmin){
          return (
              <>
              <AdminForm id={formId}></AdminForm>
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