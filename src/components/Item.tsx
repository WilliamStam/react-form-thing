
import items from "@/components/items/items.ts";
import {ItemType} from "@/objects/items.ts";
import React, {useEffect, useState} from "react";

const Item = ({item, ...rest}: {
    item: ItemType,
}) => {
    
    if (typeof items.getByItem(item) !== "undefined") {
        return React.createElement(items.getByItem(item).form.render, {
            config: item,
            ...rest
        });
    }
    // component doesn't exist yet
    return React.createElement(
        () => <div>The component {item.type} was not found.</div>,
    );
};

const ItemBlock = ({item, ...rest}: {
    item: ItemType,
}) => {
    return (
        <article className={`item item-block-${item.type}`}>
            <Item item={item} {...rest}></Item>
        </article>
    )
};
export default ItemBlock;