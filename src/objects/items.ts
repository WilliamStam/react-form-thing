import React from "react";
import {Group} from "@/objects/groups.ts"
export type ItemType = {
    id: string;
    type: string;
    [key: string]: any;
}



export type FunctionItemType = (value: ItemType) => void;
export type FunctionItemTypeNullable = (value: ItemType | null) => void;
export type FunctionItemIDType = (value: string) => void;
export type ItemValidationFunctionType = (item: ItemType) => { [key: string]: string[] };

export interface FieldComponentProps {
    config: ItemType;
    onChange: FunctionItemType;
}

export class ItemRendererInit {
    constructor(
        public render: React.FC<FieldComponentProps>,
        public validation: ItemValidationFunctionType
    ) {
    }
}

export class ItemRenderer extends ItemRendererInit {
    constructor(init: ItemRendererInit) {
        super(
            init.render,
            init.validation,
           
        );
    }
}
export class ItemInit {
    constructor(
        public form: ItemRenderer,
        public settings: ItemRenderer,
        
        public type: string,
        public heading: string,
        public description: string,
        public hidden: boolean,
        public icon: string,
        public default_config: ItemType,
        public group?: Group,
    ) {
        if (!this.group) {
            this.group = new Group({
                label: "None",
            });
        }
    }
}

export class Item extends ItemInit {
    constructor(init: ItemInit) {
        
        super(
            init.form,
            init.settings,
            
            init.type,
            init.heading,
            init.description,
            init.hidden,
            init.icon,
            init.default_config,
            init.group,
        );
    }
}


export class ItemRegistry {
    constructor(
        public items: Item[] = [],
    ) {
    }
    
    registerItem(item: Item, group?: Group): void {
        if (group) {
            item.group = group;
        }
        this.items.push(item);
    }
    
    getByItem(item: ItemType): Item | undefined {
        if (item) return this.items.find(it => it.type === item.type);
        return undefined
    }
    getByType(type: string): Item | undefined {
        return this.items.find(item => item.type === type);
    }
    
    * [Symbol.iterator]() {
        for (const item of this.items) {
            yield item;
        }
    }
    
    map<U>(callback: (item: Item, index: number, array: Item[]) => U): U[] {
        return this.items.map((item, index, array) => callback(item, index, array));
    }
    
}