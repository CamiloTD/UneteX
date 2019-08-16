import ClassReflect from '../reflect/class-reflect';
import * as Decorators from './utils';

export const hidden = Decorators.propertyFlags(<any>{ readable: false, writable: false, sync: false });
export const locked = Decorators.propertyFlags(<any>{ writable: false });
export const sync = Decorators.propertyFlags(<any>{ writable: true, sync: true });