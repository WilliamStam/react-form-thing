import SelectInput from "@/inputs/SelectInput.tsx";
import TextInput from "@/inputs/TextInput.tsx";
import React from "react";

export type InputType = {
    type: string;
    [key: string]: any;
}


export interface FieldComponentProps {
    config: InputType;
    onUpdateField: any;
}

export class InputInit {
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

export class Input extends InputInit {
    constructor(init: InputInit) {
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