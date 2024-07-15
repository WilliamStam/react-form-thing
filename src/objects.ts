import {ItemType} from "@/types/form.ts";
import React from "react";

export interface FieldComponentProps {
    config: ItemType;
    onUpdateField: any;
}

export class FieldInit {
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

export class Field extends FieldInit {
    constructor(init: FieldInit) {
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