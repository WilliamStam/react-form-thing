Create a `.env.local` file that points to the "api" for vite to proxy through

```text
VITE_API=http://127.0.0.1:8000
```

# issues

i cant seem to get the blasted form to update the main config. or its local config even. 

the concept here is that the Form component loads it loads up a form based on id

```jsx
export default function App() {
    const [form, setForm] = useState("4")
    
    const changeHandle = (e: FormEvent<HTMLButtonElement>) => {
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
```

that should change the form to whatever is in the `service.ts` file's "data" object (for easy testing)

by default it loads form 4 which has a single select box but you cant change the value in it.

```jsx 

const Render: React.FC<FieldComponentProps> = ({config, onUpdateField}) => {
    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const updatedField: SelectOptionInput = {...itemConfig, ...config, value: event.target.value};
        onUpdateField(updatedField);
    };
    
    return (
        <>
            <article className="form-item">
                <label>
                    <Dropdown
                        value={config.value || ""}
                        onChange={handleOnChange}
                        options={config.options}
                    > </Dropdown>
                </label>
                <div className={"config-item"}>{JSON.stringify(config)}</div>
            </article>
        
        
        </>
    );
};
```

this "should" mean that any change here should push up to the parent `Form` component

so make any changes to the input component it should push up its new object and replace it into the form's config at the index its found at

it seems to me that on any change it just resets the form. the whole time. doesnt reload the `Form` component since i have some clever debugging in there.

i tried the whole textarea thing. but apparently since the "value" in the textarea is a `JSON.stringify(form)` it cant update the "reactive" bit. so whenever typing it just keeps jumping to the end and not accepting any changes. i think thats happening here as well. since im "changing" the object in the child item its just ignoring it in the parent

```typescript
const handleFieldUpdate = (updatedField: ItemType, index: number) => {
    if (form) {
        const updatedData: ItemType[] = [...form.config];
        updatedData[index] = updatedField;
        form.config = updatedData
        setForm(form);
    }
};
```

and the form component calling the child

```jsx 
return React.createElement(Items[block.type].render, {
    key: index,
    config: block,
    onUpdateField: (updatedField: ItemType) => handleFieldUpdate(updatedField, index)
});
```

----

Each src/items/* defines a item type. that has 2 components. 1 for "render" which will be the normal fill the form in now. and the other is settings that will be in the admin part