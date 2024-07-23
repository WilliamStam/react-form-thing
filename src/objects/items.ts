import React from "react";

export type ItemType = {
    type: string;
    [key: string]: any;
}


export interface FieldComponentProps {
    config: ItemType;
    onUpdateField: any;
}

export class ItemInit {
    constructor(
        public render: React.FC<FieldComponentProps>,
        public settings: React.FC<FieldComponentProps>,
        public type: string,
        public heading: string,
        public description: string,
        public hidden: boolean,
        public icon: string[],
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
        );
    }
}