import {FormType} from "@/objects/forms.ts";
import {nanoid} from "nanoid";

const data = [
    {
        "id": 4,
        "label": "Daily checklist",
        "config": [
            {
                "id": nanoid(),
                "type": "select",
                "options": [
                    {
                        "value": "1",
                        "label": "1"
                    },
                    {
                        "value": "2",
                        "label": "2"
                    }
                ],
                "name": "What date",
                "value": "1"
            },
            {
                "id": nanoid(),
                "type": "form",
                "form": 3,
                "name": "sdefsdf"
            }
        ],
        "created_at": "2024-07-08T16:01:02"
    },
    
    {
        "id": 2,
        "label": "Screwdriver",
        "config": [
            {
                "id": nanoid(),
                "type": "text",
                "label": "Name"
            },
            {
                "id": nanoid(),
                "type": "date",
                "label": "Name"
            },
            {
                "id": nanoid(),
                "type": "select",
                "options": [
                    {
                        "value": "Flat",
                        "label": "Flat"
                    },
                    {
                        "value": "philips",
                        "label": "Philips"
                    }
                ],
                "label": "Type"
            }
        ],
        "created_at": "2024-07-01T17:10:17"
    },
    {
        "id": 3,
        "label": "Toolbox",
        "config": [
            {
                "id": nanoid(),
                "type": "text",
                "label": "Name"
            },
            {
                "id": nanoid(),
                "type": "form",
                "form": 1
            },
            {
                "id": nanoid(),
                "type": "form",
                "form": 2
            }
        ],
        "created_at": "2024-07-01T17:10:52"
    }
]


export function getForm(id?: string): FormType | undefined {
    return data.find((item) => item.id.toString() === id);
}