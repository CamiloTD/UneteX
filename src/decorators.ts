import { getClassMetadata, getPropertyMetadata } from './protocol/xreflect';
import { VIRTUAL, INSTANCIABLE, SYNC, HIDDEN, KEY } from './protocol/enums';
import VirtualClass from './classes/virtual-class';

const classFlagActivator = (flags: number) => (_class_: any) => { getClassMetadata(_class_).flags |= flags };
const propFlagActivator  = (flags: number) => (_class_: any, property: string) => { getPropertyMetadata(_class_, property).flags |= flags };

/* Class Decorators */
    export const virtual = (_class_: any) => {
        getClassMetadata(_class_).flags |= VIRTUAL;
    }
    export const instanciable = (_class_: any) => {
        virtual(_class_);
        getClassMetadata(_class_).flags |= INSTANCIABLE;
    }
    
/* Property Decorators */
    export const sync = propFlagActivator(SYNC);
    export const hidden = propFlagActivator(HIDDEN);
    export const key = propFlagActivator(KEY);