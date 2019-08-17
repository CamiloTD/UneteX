import { NONE, SYNC } from './enums';
let uniqueIdCounter = 0;
export interface ClassMetadata {
    ref: number;
    name: string;
    flags: number;
    fields: any;
    methods: [];
}

export interface PropertyMetadata {
    flags: number;
}

export function defaultClassMetadata (_class_: any): ClassMetadata {
    //? SHOULD I PUT A RANDOM NAME????
    return <ClassMetadata> {
        name: _class_ && _class_.name || "Anonymous",
        ref: uniqueIdCounter++,
        flags: NONE,
        fields: {},
        methods: Object.keys(_class_.prototype).filter((fnName) => typeof _class_.prototype[fnName] === "function")
    }
}

export function defaultPropertyMetadata (_class_: any, classMeta: ClassMetadata): PropertyMetadata {
    return <PropertyMetadata> {
        class: classMeta.ref,
        flags: NONE
    }
}

export function getClassMetadata (_class_: any) {
    const proto = _class_.prototype? _class_.prototype : _class_;

    return proto.__UneteX__ || (proto.__UneteX__ = defaultClassMetadata(_class_));
}

export function getPropertyMetadata (_class_: any, property: string) {
    const metadata = getClassMetadata(_class_);

    return metadata.fields[property] || (metadata.fields[property] = defaultPropertyMetadata(_class_, metadata));
}