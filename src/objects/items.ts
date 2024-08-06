import React from "react";

export type ItemType = {
    id: string;
    type: string;
    [key: string]: any;
}

export type HandleFieldOnChangeType = (value: ItemType) => void;

export interface FieldComponentProps {
    config: ItemType;
    onChange: HandleFieldOnChangeType;
}

export class ItemInit {
    constructor(
        public render: React.FC<FieldComponentProps>,
        public settings: React.FC<FieldComponentProps>,
        public type: string,
        public heading: string,
        public description: string,
        public hidden: boolean,
        public icon: string,
        public default_config: ItemType,
    ) {
    }
}

export class Item extends ItemInit {
    constructor(init: ItemInit) {
        super(
            init.render,
            init.settings,
            init.type,
            init.heading,
            init.description,
            init.hidden,
            init.icon,
            init.default_config
        );
    }
}