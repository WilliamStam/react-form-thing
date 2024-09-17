import items from "@/items/items.ts";
import {ItemType} from "@/objects/items.ts";
import React from "react";

const ItemBlock = ({item, onChange}: {
    item: ItemType,
    onChange: (item: ItemType) => void
}) => {
    const item_object = items.getByItem(item);
    if (item && item_object) {
        return React.createElement(item_object.form.render, {
            config: item,
            onChange: onChange
        });
    }
    // component doesn't exist yet
    return React.createElement(
        () => <div>The component {item.type} was not found.</div>,
    );
};

export default ItemBlock;