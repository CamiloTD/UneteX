export interface ClassMetadata {
    methods: any;
    properties: any;
    remote: boolean;
    unsigned: boolean;
}

export interface MethodMetadata {
    readable: boolean;
}

export interface PropertyMetadata {
    readable: boolean;
    writable: boolean;
    sync: boolean;
}