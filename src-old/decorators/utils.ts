import ClassReflect from '../reflect/class-reflect';

export function propertyFlags (props: Array<any>): any {
    return function (_class_: any, propertyName: string) {
        const propertyMetadata: any = ClassReflect.property(_class_, propertyName);
        
        for(const name in props)
            propertyMetadata[name] = props[name];
    }
}

export function methodFlags (props: Array<any>): any {
    return function (_class_: any, propertyName: string) {
        const propertyMetadata: any = ClassReflect.method(_class_, propertyName);
        
        for(const name in props)
            propertyMetadata[name] = props[name];
    }
}

export function classFlag (props: Array<any>): any {
    return function (_class_: any) {
        const classMetadata: any = ClassReflect.metadata(_class_);
        
        for(const name in props)
            classMetadata[name] = props[name];
    }
}