import {FormType} from "@/types/form.ts";

const data = [
    {
        "id": 4,
        "label": "Daily checklist",
        "config": [
            {
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
                "type": "form",
                "form": 3,
                "name": "sdefsdf"
            }
        ],
        "created_at": "2024-07-08T16:01:02"
    },
    {
        "id": 1,
        "label": "Hammer",
        "config": [
            {
                "type": "text",
                "label": "Name"
            },
            {
                "type": "select",
                "options": [
                    {
                        "value": "s",
                        "label": "Small"
                    },
                    {
                        "value": "m",
                        "label": "Medium"
                    }
                ],
                "label": "Size"
            },
            {
                "type": "select",
                "options": [
                    {
                        "value": "red",
                        "label": "red"
                    },
                    {
                        "value": "green",
                        "label": "green"
                    },
                    {
                        "value": "blue",
                        "label": "blue"
                    }
                ],
                "name": "Colour",
                "label": "Colour"
            },
            {
                "type": "text",
                "name": "Whats your name",
                "label": "Whats your name"
            }
        ],
        "created_at": "2024-07-01T17:08:44"
    },
    {
        "id": 2,
        "label": "Screwdriver",
        "config": [
            {
                "type": "text",
                "label": "Name"
            },
            {
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
                "type": "text",
                "label": "Name"
            },
            {
                "type": "form",
                "form": 1
            },
            {
                "type": "form",
                "form": 2
            }
        ],
        "created_at": "2024-07-01T17:10:52"
    }
]



export async function getForms(): Promise<FormType[]> {
    return data;
}

export async function getForm(id?: string): Promise<FormType | undefined> {
    return data.find((item) => item.id.toString() === id);
}