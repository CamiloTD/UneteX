import { getClassMetadata, getPropertyMetadata } from './protocol/xreflect';
import { VIRTUAL, SYNC, HIDDEN, KEY } from './protocol/enums';

const classFlagActivator = (flags: number) => (_class_: any) => { getClassMetadata(_class_).flags |= flags };
const propFlagActivator  = (flags: number) => (_class_: any, property: string) => { getPropertyMetadata(_class_, property).flags |= flags };

/* Class Decorators */
    export const virtual = (_class_: any) => {
        getClassMetadata(_class_).flags |= VIRTUAL;
    }
    
/* Property Decorators */
    export const sync = propFlagActivator(SYNC);
    export const hidden = propFlagActivator(HIDDEN);
    export const key = propFlagActivator(KEY);