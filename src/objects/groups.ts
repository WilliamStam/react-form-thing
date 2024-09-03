
export class GroupInit {
    constructor(
        public label: string,
    ) {
    }
}
export class Group extends GroupInit {
    constructor(init: GroupInit) {
        super(
            init.label,
        );
    }
}