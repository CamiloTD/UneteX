import * as XReflect from '../xreflect';
import { NONE, PROPERTY, METHOD, CLASS } from '../enums';

export interface ObjectProxyContext {
    type: number;
    route: Array<string>;
    metadata: XReflect.ClassMetadata | XReflect.PropertyMetadata;
    class?: any;
}