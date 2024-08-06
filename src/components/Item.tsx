
import items from "@/items.ts";
import {HandleFieldOnChangeType, ItemType} from "@/objects/items.ts";
import React, {useEffect, useState} from "react";

const ItemBlock = ({item, onChange}: {
    item: ItemType,
    onChange: HandleFieldOnChangeType
}) => {
    
    if (typeof items[item.type] !== "undefined") {
        return React.createElement(items[item.type].render, {
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