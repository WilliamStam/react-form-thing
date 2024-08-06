// import TextInput from "@/components/inputs/TextInput.tsx";

import ItemBlock from "@/components/Item.tsx";
import {HandleFieldOnChangeType, ItemType} from "@/objects/items.ts";
import {Button} from "primereact/button";
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const AdminItemBlock = ({item, onChange}: {
    item: ItemType,
    onChange: HandleFieldOnChangeType
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable(item);
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    return (
        <>
            <div className="item-admin" ref={setNodeRef} style={style} {...attributes} {...listeners}>
                <div className="item-admin-buttons">
                    <Button icon="pi pi-pencil" size="small" outlined/> <Button
                    icon="pi pi-trash"
                    size="small"
                    outlined
                /> <Button icon="pi pi-arrows-v" size="small" outlined/>
                </div>
                <ItemBlock item={item} onChange={onChange}></ItemBlock>
            </div>
        
        
        </>
    );
    
    
};
export default AdminItemBlock;