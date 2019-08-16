import { NONE, SYNC } from './enums';

export interface ClassMetadata {
    flags: number;
    fields: any;
}

export interface PropertyMetadata {
    flags: number;
}

export function defaultClassMetadata (): ClassMetadata {
    return <ClassMetadata> {
        flags: NONE,
        fields: {}
    }
}

export function defaultPropertyMetadata (): PropertyMetadata {
    return <PropertyMetadata> {
        flags: NONE
    }
}

export function getClassMetadata (_class_: any) {
    const proto = _class_.prototype? _class_.prototype : _class_;

    return proto.__UneteX__ || (proto.__UneteX__ = defaultClassMetadata());
}

export function getPropertyMetadata (_class_: any, property: string) {
    const metadata = getClassMetadata(_class_);

    return metadata.fields[property] || (metadata.fields[property] = defaultPropertyMetadata());
}