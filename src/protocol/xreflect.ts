import { NONE, SYNC } from './enums';
let uniqueIdCounter = 0;
export interface ClassMetadata {
    ref: number;
    name: string;
    flags: number;
    fields: any;
    methods: Array<string>;
    addons: any;
}

export interface PropertyMetadata {
    flags: number;
}

export function defaultClassMetadata (): ClassMetadata {
    //? SHOULD I PUT A RANDOM NAME????
    return <ClassMetadata> {
        name: "Anonymous",
        ref: uniqueIdCounter++,
        flags: NONE,
        fields: {},
        methods: [],
        addons: {}
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

    return proto.__UneteX__ || (proto.__UneteX__ = defaultClassMetadata());
}

export function getPropertyMetadata (_class_: any, property: string) {
    const metadata = getClassMetadata(_class_);

    return metadata.fields[property] || (metadata.fields[property] = defaultPropertyMetadata(_class_, metadata));
}

export function getClassHiddenMetadata (_class_: any) {
    const proto = _class_.prototype? _class_.prototype : _class_;

    return proto.__Hidden__UneteX__ || (proto.__Hidden__UneteX__ = {});
}

export function getPropertyHiddenMetadata (_class_: any, property: string) {
    const metadata = getClassHiddenMetadata(_class_);

    return metadata.fields[property] || (metadata.fields[property] = {});
}